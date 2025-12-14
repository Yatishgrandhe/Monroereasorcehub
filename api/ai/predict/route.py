"""
TensorFlow Model API Route for Vercel
Serves TensorFlow models via serverless function
"""

from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import json
import os
import sys

app = Flask(__name__)

# Global model cache
MODELS = {}

def load_model(model_type: str):
    """Load and cache TensorFlow model"""
    if model_type in MODELS:
        return MODELS[model_type]
    
    try:
        # Model path relative to this file
        model_path = os.path.join(
            os.path.dirname(__file__),
            'models',
            model_type
        )
        
        if not os.path.exists(model_path):
            return None
        
        model = tf.keras.models.load_model(model_path)
        MODELS[model_type] = model
        return model
    except Exception as e:
        print(f"Error loading model {model_type}: {e}")
        return None

def preprocess_cover_letter_input(resume_data: dict, job_posting: dict) -> np.ndarray:
    """Preprocess input for cover letter generation"""
    # Combine resume and job data
    text = f"{resume_data.get('summary', '')} {job_posting.get('description', '')}"
    
    # Tokenize and pad (adjust based on your model)
    # This is a placeholder - implement your actual preprocessing
    tokens = text.split()[:512]  # Limit to 512 tokens
    encoded = [hash(token) % 10000 for token in tokens]
    
    # Pad to fixed length
    while len(encoded) < 512:
        encoded.append(0)
    
    return np.array([encoded[:512]])

def postprocess_cover_letter_output(prediction: np.ndarray) -> str:
    """Postprocess model output to text"""
    # This is a placeholder - implement your actual postprocessing
    # Convert token IDs back to text
    return "Generated cover letter from TensorFlow model"

@app.route('/api/ai/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        data = request.get_json()
        model_type = data.get('type', 'cover-letter')  # 'cover-letter' or 'interview-questions'
        
        # Load model
        model = load_model(model_type)
        if not model:
            return jsonify({
                'success': False,
                'error': f'Model {model_type} not found'
            }), 404
        
        # Preprocess
        if model_type == 'cover-letter':
            input_data = preprocess_cover_letter_input(
                data.get('resumeData', {}),
                data.get('jobPosting', {})
            )
        else:
            input_data = preprocess_cover_letter_input(
                {'summary': ''},
                data.get('jobPosting', {})
            )
        
        # Predict
        prediction = model.predict(input_data, verbose=0)
        
        # Postprocess
        if model_type == 'cover-letter':
            output = postprocess_cover_letter_output(prediction)
            return jsonify({
                'success': True,
                'coverLetter': output
            })
        else:
            output = postprocess_cover_letter_output(prediction)
            questions = output.split('\n')[:10]
            return jsonify({
                'success': True,
                'questions': questions
            })
            
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Vercel serverless function handler
def handler(request):
    """Vercel serverless function entry point"""
    return app(request.environ, lambda status, headers: None)

