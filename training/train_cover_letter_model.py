"""
TensorFlow Model Training Script for Cover Letter Generation
Run this locally to train your model, then deploy to Vercel
"""

import tensorflow as tf
import numpy as np
import json
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Configuration
VOCAB_SIZE = 5000  # Reduced for smaller dataset
MAX_LENGTH = 256   # Reduced for faster training
EMBEDDING_DIM = 64  # Reduced for smaller model
LSTM_UNITS = 128    # Reduced for smaller model
BATCH_SIZE = 8      # Smaller batch for small dataset
EPOCHS = 20         # More epochs for small dataset

def load_training_data(data_path: str):
    """Load training data from JSON file"""
    with open(data_path, 'r') as f:
        data = json.load(f)
    
    inputs = []
    outputs = []
    
    for example in data.get('training_data', data):
        # Combine resume and job data as input
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
    """Tokenize and prepare data for training"""
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

def build_model(vocab_size: int):
    """Build the neural network model"""
    model = Sequential([
        Embedding(vocab_size, EMBEDDING_DIM, input_length=MAX_LENGTH),
        LSTM(LSTM_UNITS, return_sequences=True),
        Dropout(0.3),
        LSTM(LSTM_UNITS // 2),
        Dropout(0.3),
        Dense(512, activation='relu'),
        Dropout(0.3),
        Dense(vocab_size, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_model():
    """Main training function"""
    print("Loading training data...")
    inputs, outputs = load_training_data('training/training_data.json')
    
    print(f"Loaded {len(inputs)} examples")
    print("Preparing data...")
    X_train, y_train, input_tokenizer, output_tokenizer = prepare_data(inputs, outputs)
    
    print("Building model...")
    model = build_model(VOCAB_SIZE)
    model.summary()
    
    print("Training model...")
    history = model.fit(
        X_train, y_train,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_split=0.2,
        verbose=1
    )
    
    # Save model
    print("Saving model...")
    os.makedirs('training/models/cover_letter', exist_ok=True)
    model.save('training/models/cover_letter')
    
    # Save tokenizers
    with open('training/models/cover_letter/input_tokenizer.json', 'w') as f:
        json.dump(input_tokenizer.to_json(), f)
    
    with open('training/models/cover_letter/output_tokenizer.json', 'w') as f:
        json.dump(output_tokenizer.to_json(), f)
    
    print("✅ Model saved successfully!")
    print("\n📦 Converting to TensorFlow.js format...")
    try:
        import tensorflowjs as tfjs
        os.makedirs('public/models/cover_letter', exist_ok=True)
        tfjs.converters.save_keras_model(model, 'public/models/cover_letter')
        print("✅ TensorFlow.js model created in public/models/cover_letter/")
    except ImportError:
        print("⚠️  tensorflowjs not installed. Run:")
        print("  pip install tensorflowjs")
        print("  tensorflowjs_converter --input_format keras training/models/cover_letter public/models/cover_letter")
    
    return model

if __name__ == '__main__':
    train_model()

