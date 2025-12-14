# TensorFlow Model Deployment on Vercel

## 📋 Summary

I've set up everything you need to deploy a TensorFlow model for cover letter and interview question generation on Vercel.

## 📊 Data Requirements

### Minimum Data Needed:
- **Cover Letters**: 500-1,000 examples (resume + job → cover letter pairs)
- **Interview Questions**: 300-500 examples (job posting → questions pairs)

### Recommended:
- **Good Quality**: 5,000-10,000 examples
- **Excellent Quality**: 10,000+ examples

## 🎯 Two Deployment Options

### Option 1: TensorFlow.js (Browser) ⭐ RECOMMENDED
**Best for**: Small models (<50MB), no server costs, works offline

**Steps:**
1. Train model in Python (see `training/train_cover_letter_model.py`)
2. Convert to TensorFlow.js: `tensorflowjs_converter --input_format keras models/cover_letter public/models/cover_letter`
3. Place model files in `public/models/cover_letter/`
4. Done! The app will automatically use it.

**Pros:**
- ✅ No Vercel limits
- ✅ No server costs
- ✅ Works offline
- ✅ Fast (no API latency)

### Option 2: Python API (Serverless)
**Best for**: Larger models (50-250MB), server-side processing

**Steps:**
1. Train model in Python
2. Place model in `api/ai/predict/models/`
3. Deploy to Vercel (Python runtime configured)
4. Model served via `/api/ai/predict`

**Pros:**
- ✅ Can use full TensorFlow
- ✅ Better for larger models

**Cons:**
- ⚠️ Vercel Pro plan needed (250MB limit)
- ⚠️ Cold start latency
- ⚠️ Higher costs

## 🚀 Quick Start

### 1. Collect Training Data
Create `training/training_data.json` with format:
```json
{
  "training_data": [
    {
      "resume": {...},
      "job_description": "...",
      "cover_letter": "..."
    }
  ]
}
```

### 2. Train Model
```bash
cd training
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train_cover_letter_model.py
```

### 3. Convert to TensorFlow.js
```bash
pip install tensorflowjs
tensorflowjs_converter --input_format keras models/cover_letter public/models/cover_letter
```

### 4. Deploy
Just push to Vercel! The code already handles:
- ✅ Loading TensorFlow.js models
- ✅ Fallback to local AI
- ✅ Works for all users

## 📁 Files Created

- `lib/ai/tensorflow-model.ts` - TensorFlow.js integration
- `api/ai/predict/route.py` - Python API route (optional)
- `training/train_cover_letter_model.py` - Training script
- `training/training_data_template.json` - Data format template
- `TENSORFLOW_DEPLOYMENT_GUIDE.md` - Full detailed guide
- `TENSORFLOW_QUICK_START.md` - Quick reference

## ⚙️ Current Setup

The app now tries models in this order:
1. **TensorFlow.js** (browser) - if model available
2. **Gemini API** - if logged in and API key set
3. **Local AI** - always works as fallback

## 🔧 Vercel Configuration

Updated `vercel.json` to support:
- ✅ Python runtime for API routes
- ✅ Extended function timeouts
- ✅ Model file serving

## 💡 Tips

1. **Start Small**: Begin with 500-1000 examples
2. **Use Pre-trained**: Fine-tune GPT-2 or similar (smaller, faster)
3. **Model Size**: Keep <50MB for browser, <250MB for serverless
4. **Test Locally**: Test TensorFlow.js model before deploying

## 📚 Next Steps

1. Collect/generate training data
2. Train your model locally
3. Convert to TensorFlow.js
4. Place in `public/models/`
5. Deploy to Vercel

The integration is complete - just add your trained model!

