# TensorFlow Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Install TensorFlow.js
```bash
npm install @tensorflow/tfjs
```

### Step 2: Train Your Model (Python)

1. **Collect Training Data** (500-1000 examples minimum):
   ```bash
   # Create training_data.json with your examples
   # See training/training_data_template.json for format
   ```

2. **Train the Model**:
   ```bash
   cd training
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python train_cover_letter_model.py
   ```

3. **Convert to TensorFlow.js**:
   ```bash
   pip install tensorflowjs
   tensorflowjs_converter --input_format keras models/cover_letter public/models/cover_letter
   ```

### Step 3: Deploy

The model will automatically be used when available. The code already includes:
- ✅ TensorFlow.js integration
- ✅ Fallback to local AI
- ✅ Works for all users (guest + logged in)

## 📊 Data Requirements Summary

| Quality Level | Examples Needed | Training Time |
|--------------|----------------|---------------|
| Basic | 500-1,000 | 1-2 hours |
| Good | 5,000-10,000 | 4-8 hours |
| Excellent | 10,000+ | 12+ hours |

## 🎯 Recommended Approach

**For Vercel Deployment:**
1. Use **TensorFlow.js** (browser-based) - Best option
   - Model size: Keep <50MB
   - No server costs
   - Works offline
   
2. Use **Python API** (serverless) - If model is larger
   - Model size: <250MB (Pro plan)
   - Requires Vercel Pro
   - Has cold start latency

## 📝 Data Collection Tips

1. **Use Your Current Local AI** to generate initial examples
2. **Manually refine** the best examples
3. **Augment data** by paraphrasing
4. **Validate** with 20% holdout set

## 🔧 Current Integration

The app is already set up to:
- ✅ Try TensorFlow.js model first (if available)
- ✅ Fallback to Gemini API (if logged in)
- ✅ Fallback to local AI (always works)

No changes needed - just add your trained model to `public/models/`!

