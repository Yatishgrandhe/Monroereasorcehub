# TensorFlow Models

This directory contains TensorFlow.js models for AI-powered features.

## Current Status

⚠️ **Placeholder Models**: The current model files are placeholders for testing the integration. They are not trained models and will not produce meaningful results.

## Model Files

- `cover_letter/model.json` - Model architecture for cover letter generation
- `cover_letter/weights.bin` - Model weights (placeholder)
- `interview_questions/model.json` - Model architecture for interview question generation
- `interview_questions/weights.bin` - Model weights (placeholder)

## To Create Real Models

1. **Collect Training Data**: Gather 500-1000+ examples (see `training/training_data_template.json`)

2. **Train Model**: 
   ```bash
   cd training
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python3 train_cover_letter_model.py
   ```

3. **Convert to TensorFlow.js**:
   ```bash
   pip install tensorflowjs
   tensorflowjs_converter --input_format keras models/cover_letter public/models/cover_letter
   ```

4. **Replace Placeholder Files**: The trained model will replace the placeholder files

## Testing

The app will attempt to load these models. If they fail to load (which is expected with placeholders), the app will automatically fall back to:
1. Gemini API (if logged in and API key is set)
2. Local AI (always works)

## Notes

- Model files are gitignored (see `.gitignore`)
- Keep model files under 50MB for browser performance
- Models are loaded lazily on first use

