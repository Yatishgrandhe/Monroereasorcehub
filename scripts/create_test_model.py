"""
Create a minimal test TensorFlow model for cover letter generation
This creates a simple model that can be loaded by TensorFlow.js for testing
"""

import tensorflow as tf
import numpy as np
import os
import json

# Create output directory
output_dir = 'public/models/cover_letter'
os.makedirs(output_dir, exist_ok=True)

print("Creating minimal test model...")

# Create a very simple sequential model for testing
# This is a minimal model that will load but needs training for real use
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(100,), name='dense_1'),
    tf.keras.layers.Dense(32, activation='relu', name='dense_2'),
    tf.keras.layers.Dense(16, activation='relu', name='dense_3'),
    tf.keras.layers.Dense(1, activation='sigmoid', name='output')
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Create dummy training data to initialize weights
dummy_input = np.random.random((1, 100))
dummy_output = np.random.random((1, 1))
model.fit(dummy_input, dummy_output, epochs=1, verbose=0)

# Save the model
print(f"Saving model to {output_dir}...")
model.save(f'{output_dir}/keras_model.h5')

# Convert to TensorFlow.js format
print("Converting to TensorFlow.js format...")
try:
    import tensorflowjs as tfjs
    tfjs.converters.save_keras_model(model, output_dir)
    print(f"✅ Model saved successfully to {output_dir}/")
    print(f"   Files created:")
    for file in os.listdir(output_dir):
        print(f"   - {file}")
except ImportError:
    print("⚠️  tensorflowjs not installed. Install with: pip install tensorflowjs")
    print("   Then run: tensorflowjs_converter --input_format keras public/models/cover_letter/keras_model.h5 public/models/cover_letter/")
    print("   Or use the training script to create a proper model.")

print("\n✅ Test model creation complete!")
print("Note: This is a minimal test model. For production, train with real data using training/train_cover_letter_model.py")

