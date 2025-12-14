#!/bin/bash

# Setup script to create TensorFlow models
# This will create test models and convert them to TensorFlow.js format

echo "🚀 Setting up TensorFlow models..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if TensorFlow is installed
if ! python3 -c "import tensorflow" 2>/dev/null; then
    echo "📦 Installing TensorFlow..."
    pip3 install tensorflow tensorflowjs numpy
fi

# Create directories
echo "📁 Creating model directories..."
mkdir -p public/models/cover_letter
mkdir -p public/models/interview_questions

# Create test model
echo "🤖 Creating test model..."
python3 scripts/create_test_model.py

# Check if conversion was successful
if [ -f "public/models/cover_letter/model.json" ]; then
    echo "✅ Model created successfully!"
    echo "📂 Model location: public/models/cover_letter/"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Train a real model with: python3 training/train_cover_letter_model.py"
    echo "   2. Or use the test model for now (it will work but needs training for real use)"
else
    echo "⚠️  Model conversion pending. Run:"
    echo "   pip install tensorflowjs"
    echo "   tensorflowjs_converter --input_format keras public/models/cover_letter/keras_model.h5 public/models/cover_letter/"
fi

