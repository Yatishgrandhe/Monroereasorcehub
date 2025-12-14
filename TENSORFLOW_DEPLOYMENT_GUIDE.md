# TensorFlow Model Deployment Guide for Vercel

## 📊 Data Requirements

### Minimum Data for Training
- **Cover Letter Generation**: 500-1,000 examples (resume + job posting → cover letter pairs)
- **Interview Questions**: 300-500 examples (job posting → questions pairs)
- **Text Generation Tasks**: 1,000-5,000 examples minimum for decent quality

### Recommended Data
- **Good Quality**: 5,000-10,000 examples
- **High Quality**: 10,000+ examples
- **Format**: JSON or CSV with input-output pairs

## ⚠️ Vercel Limitations

### Serverless Function Limits
- **Hobby Plan**: 50MB function size, 10s execution time
- **Pro Plan**: 250MB function size, 60s execution time
- **Enterprise**: Custom limits

### TensorFlow Model Sizes
- **Small Model**: 5-20MB (feasible on Vercel)
- **Medium Model**: 20-100MB (Pro plan only)
- **Large Model**: 100MB+ (not recommended for Vercel)

## 🎯 Recommended Approaches

### Option 1: TensorFlow.js (Browser-Based) ⭐ RECOMMENDED
**Best for**: Small models, client-side inference, no server costs

**Pros**:
- Runs entirely in browser
- No serverless function limits
- Works offline after initial load
- No API latency

**Cons**:
- Model must be <50MB for reasonable load times
- Requires TensorFlow.js conversion

### Option 2: Lightweight Python API (Vercel Serverless)
**Best for**: Medium models, server-side processing

**Pros**:
- Can use full TensorFlow
- Better for larger models
- Server-side processing

**Cons**:
- Subject to Vercel limits
- Cold start latency
- Higher costs

### Option 3: Hybrid Approach
**Best for**: Best of both worlds

- Use TensorFlow.js for simple tasks
- Use serverless API for complex tasks
- Fallback to local AI if both fail

## 🚀 Implementation Guide

### Step 1: Train Your Model (Python)

```python
# train_model.py
import tensorflow as tf
import numpy as np
import json

# Load your training data
with open('training_data.json', 'r') as f:
    data = json.load(f)

# Prepare data
# X = input features (resume + job description)
# y = output (cover letter or questions)

# Simple example architecture
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, 128),
    tf.keras.layers.LSTM(256, return_sequences=True),
    tf.keras.layers.LSTM(128),
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(vocab_size, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
model.fit(X_train, y_train, epochs=10, batch_size=32)

# Save model
model.save('cover_letter_model')
model.save_weights('cover_letter_weights.h5')

# Convert to TensorFlow.js format
# pip install tensorflowjs
# tensorflowjs_converter --input_format keras cover_letter_model ./tfjs_model
```

### Step 2A: Deploy with TensorFlow.js (Recommended)

```bash
# Install TensorFlow.js
npm install @tensorflow/tfjs
```

Create a model loader:

```typescript
// lib/ai/tensorflow-model.ts
import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

export async function loadModel() {
  if (model) return model;
  
  try {
    // Load from public folder or CDN
    model = await tf.loadLayersModel('/models/cover_letter_model/model.json');
    return model;
  } catch (error) {
    console.error('Failed to load TensorFlow model:', error);
    return null;
  }
}

export async function generateWithModel(input: string): Promise<string> {
  const loadedModel = await loadModel();
  if (!loadedModel) {
    throw new Error('Model not loaded');
  }
  
  // Preprocess input
  const preprocessed = preprocessInput(input);
  
  // Predict
  const prediction = loadedModel.predict(preprocessed) as tf.Tensor;
  const result = await prediction.data();
  
  // Postprocess
  return postprocessOutput(result);
}
```

### Step 2B: Deploy with Python API (Vercel Serverless)

Create API route:

```python
# api/ai/predict/route.py
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os

app = Flask(__name__)

# Load model (cache it)
model = None

def load_model():
    global model
    if model is None:
        model_path = os.path.join(os.path.dirname(__file__), 'model')
        model = tf.keras.models.load_model(model_path)
    return model

@app.route('/api/ai/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_text = data.get('input', '')
        
        # Load model
        model = load_model()
        
        # Preprocess
        preprocessed = preprocess_input(input_text)
        
        # Predict
        prediction = model.predict(preprocessed)
        
        # Postprocess
        output = postprocess_output(prediction)
        
        return jsonify({
            'success': True,
            'output': output
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

Create `vercel.json` configuration:

```json
{
  "functions": {
    "api/ai/predict/route.py": {
      "runtime": "python3.9",
      "maxDuration": 30
    }
  },
  "builds": [
    {
      "src": "api/ai/predict/route.py",
      "use": "@vercel/python"
    }
  ]
}
```

## 📦 Project Structure

```
monroe-resource-hub/
├── models/                    # TensorFlow models
│   ├── cover_letter/         # Cover letter model
│   │   ├── model.json        # TensorFlow.js model
│   │   └── weights/          # Model weights
│   └── interview_questions/  # Interview questions model
├── api/
│   └── ai/
│       └── predict/
│           └── route.py      # Python API route
├── lib/
│   └── ai/
│       ├── tensorflow-model.ts  # TensorFlow.js integration
│       └── local-ai.ts         # Current local AI
└── public/
    └── models/                # Public model files (for TensorFlow.js)
```

## 🔧 Integration with Existing Code

Update `app/actions/ai.ts` to use TensorFlow:

```typescript
import { generateWithTensorFlow } from '@/lib/ai/tensorflow-model';

export async function generateCoverLetterAction(resumeData: ResumeData, jobPosting: JobPosting) {
  try {
    // Try TensorFlow model first
    try {
      const coverLetter = await generateWithTensorFlow(resumeData, jobPosting);
      return { success: true, coverLetter };
    } catch (error) {
      console.error('TensorFlow failed, using local AI:', error);
      // Fallback to local AI
      const coverLetter = generateCoverLetterLocal(resumeData, jobPosting);
      return { success: true, coverLetter };
    }
  } catch (error) {
    return { success: false, error: 'Failed to generate cover letter' };
  }
}
```

## 📝 Data Collection Template

```json
{
  "training_data": [
    {
      "input": {
        "resume": {
          "experience": "...",
          "skills": ["..."]
        },
        "job": {
          "title": "...",
          "description": "..."
        }
      },
      "output": {
        "cover_letter": "..."
      }
    }
  ]
}
```

## 🎓 Training Tips

1. **Start Small**: Begin with 500-1000 examples
2. **Use Pre-trained Models**: Fine-tune GPT-2 or similar
3. **Data Quality > Quantity**: Better to have 1,000 good examples than 10,000 poor ones
4. **Augment Data**: Use paraphrasing to expand dataset
5. **Validate**: Keep 20% for validation

## 💡 Recommended Model Architecture

For text generation (cover letters, questions):

```python
# Use a transformer-based model
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Fine-tune GPT-2 (small, fast)
model = GPT2LMHeadModel.from_pretrained('gpt2')
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')

# Fine-tune on your data
# Then convert to TensorFlow.js or serve via API
```

## 🚨 Important Considerations

1. **Model Size**: Keep models <50MB for browser, <250MB for serverless
2. **Cold Starts**: Python serverless functions have cold start latency
3. **Costs**: Vercel Pro plan needed for larger models
4. **Privacy**: Browser-based models keep data local
5. **Performance**: TensorFlow.js is slower than native TensorFlow

## 🔄 Migration Path

1. **Phase 1**: Keep current local AI as fallback
2. **Phase 2**: Add TensorFlow.js model for browser
3. **Phase 3**: Add Python API for complex tasks
4. **Phase 4**: Optimize and choose best approach

## 📚 Resources

- TensorFlow.js: https://www.tensorflow.org/js
- Vercel Python: https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python
- Model Conversion: https://www.tensorflow.org/js/guide/conversion

