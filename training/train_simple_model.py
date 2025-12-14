"""
Simplified model training using a lightweight approach
This creates a working model faster
"""

import json
import os
import sys

print("🚀 Starting model training...")

# Try to import TensorFlow
try:
    import tensorflow as tf
    import numpy as np
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Embedding, LSTM, Dropout
    from tensorflow.keras.preprocessing.text import Tokenizer
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    print("✅ TensorFlow imported successfully")
except ImportError:
    print("❌ TensorFlow not installed. Installing now...")
    os.system("pip3 install --user tensorflow tensorflowjs numpy --quiet")
    try:
        import tensorflow as tf
        import numpy as np
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Dense, Embedding, LSTM, Dropout
        from tensorflow.keras.preprocessing.text import Tokenizer
        from tensorflow.keras.preprocessing.sequence import pad_sequences
        print("✅ TensorFlow installed and imported")
    except:
        print("❌ Failed to install TensorFlow. Using fallback approach...")
        sys.exit(1)

# Configuration for small dataset
VOCAB_SIZE = 2000
MAX_LENGTH = 200
EMBEDDING_DIM = 32
LSTM_UNITS = 64
BATCH_SIZE = 4
EPOCHS = 15

def load_training_data():
    """Load training data"""
    with open('training/training_data.json', 'r') as f:
        data = json.load(f)
    
    inputs = []
    outputs = []
    
    for example in data.get('training_data', []):
        resume = example.get('resume', {})
        resume_text = f"{resume.get('summary', '')} {' '.join(resume.get('skills', []))}"
        if resume.get('experience'):
            for exp in resume['experience']:
                resume_text += f" {exp.get('position', '')} {exp.get('description', '')}"
        
        input_text = f"{resume_text} {example.get('job_description', '')}"
        output_text = example.get('cover_letter', '')
        
        inputs.append(input_text)
        outputs.append(output_text)
    
    return inputs, outputs

def prepare_data(inputs, outputs):
    """Prepare data for training"""
    # Tokenize inputs
    input_tokenizer = Tokenizer(num_words=VOCAB_SIZE, oov_token='<OOV>')
    input_tokenizer.fit_on_texts(inputs)
    input_sequences = input_tokenizer.texts_to_sequences(inputs)
    input_padded = pad_sequences(input_sequences, maxlen=MAX_LENGTH, padding='post')
    
    # Tokenize outputs
    output_tokenizer = Tokenizer(num_words=VOCAB_SIZE, oov_token='<OOV>')
    output_tokenizer.fit_on_texts(outputs)
    output_sequences = output_tokenizer.texts_to_sequences(outputs)
    output_padded = pad_sequences(output_sequences, maxlen=MAX_LENGTH, padding='post')
    
    return input_padded, output_padded, input_tokenizer, output_tokenizer

def build_model():
    """Build a simple model"""
    model = Sequential([
        Embedding(VOCAB_SIZE, EMBEDDING_DIM, input_length=MAX_LENGTH),
        LSTM(LSTM_UNITS, return_sequences=True),
        Dropout(0.2),
        LSTM(LSTM_UNITS // 2),
        Dropout(0.2),
        Dense(128, activation='relu'),
        Dropout(0.2),
        Dense(VOCAB_SIZE, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def main():
    print("📊 Loading training data...")
    inputs, outputs = load_training_data()
    print(f"✅ Loaded {len(inputs)} examples")
    
    print("🔧 Preparing data...")
    X_train, y_train, input_tokenizer, output_tokenizer = prepare_data(inputs, outputs)
    
    print("🏗️  Building model...")
    model = build_model()
    model.summary()
    
    print("🎓 Training model (this may take a few minutes)...")
    history = model.fit(
        X_train, y_train,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_split=0.2,
        verbose=1
    )
    
    print("💾 Saving model...")
    os.makedirs('training/models/cover_letter', exist_ok=True)
    model.save('training/models/cover_letter')
    
    # Save tokenizers
    with open('training/models/cover_letter/input_tokenizer.json', 'w') as f:
        json.dump(input_tokenizer.to_json(), f)
    with open('training/models/cover_letter/output_tokenizer.json', 'w') as f:
        json.dump(output_tokenizer.to_json(), f)
    
    print("🔄 Converting to TensorFlow.js...")
    try:
        import tensorflowjs as tfjs
        os.makedirs('public/models/cover_letter', exist_ok=True)
        tfjs.converters.save_keras_model(model, 'public/models/cover_letter')
        print("✅ TensorFlow.js model saved to public/models/cover_letter/")
        print("\n🎉 Model training complete!")
        print("📁 Model files:")
        for file in os.listdir('public/models/cover_letter'):
            size = os.path.getsize(f'public/models/cover_letter/{file}')
            print(f"   - {file} ({size:,} bytes)")
    except ImportError:
        print("⚠️  tensorflowjs not installed. Installing...")
        os.system("pip3 install --user tensorflowjs --quiet")
        try:
            import tensorflowjs as tfjs
            os.makedirs('public/models/cover_letter', exist_ok=True)
            tfjs.converters.save_keras_model(model, 'public/models/cover_letter')
            print("✅ TensorFlow.js model saved!")
        except:
            print("❌ Could not convert. Run manually:")
            print("   tensorflowjs_converter --input_format keras training/models/cover_letter public/models/cover_letter")

if __name__ == '__main__':
    main()

