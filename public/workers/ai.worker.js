// Use CDN - workers in public/ cannot resolve npm packages; must use full URL
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Skip local check to allow loading from Hugging Face CDN
env.allowLocalModels = false;
env.useBrowserCache = true; // CRITICAL: This ensures the model is saved in the browser's Cache storage

// Proxy the message back to the main thread
class ProgressProxy {
    static post(status, progress, message) {
        self.postMessage({ type: 'progress', status, progress, message });
    }
}

let generator = null;

async function loadModel() {
    if (generator) return generator;

    ProgressProxy.post('init', 0, 'Initializing Local AI Engine...');

    // Using a lightweight, fast model for resume generation
    // LaMini-Flan-T5-783M is excellent for text tasks and relatively compact
    generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M', {
        progress_callback: (data) => {
            if (data.status === 'initiate') {
                ProgressProxy.post('init', 5, 'Synchronizing Engine...');
            } else if (data.status === 'progress') {
                ProgressProxy.post('downloading', data.progress, `Transferring Data: ${Math.round(data.progress)}%`);
            } else if (data.status === 'done') {
                ProgressProxy.post('ready', 100, 'Optimization Complete');
            }
        }
    });

    ProgressProxy.post('ready', 100, 'AI Ready Locally');
    return generator;
}

self.onmessage = async (e) => {
    const { type, text, jobTitle, industry, experienceLevel } = e.data;

    try {
        const model = await loadModel();

        let prompt = '';
        if (type === 'summary') {
            prompt = `Generate a 3-sentence professional resume summary for a ${jobTitle} in the ${industry} industry with ${experienceLevel} level experience. Use these details: ${text}`;
        } else if (type === 'experience') {
            prompt = `Rewrite this achievement note for a ${jobTitle} resume into one or two high-impact professional bullet points using action verbs and the STAR method (Situation, Task, Action, Result). Focus on quantifiable results: ${text}`;
        }

        ProgressProxy.post('generating', 50, 'Architecting content...');

        const output = await model(prompt, {
            max_new_tokens: 256,
            temperature: 0.7,
            repetition_penalty: 1.2,
        });

        self.postMessage({
            type: 'result',
            output: output[0].generated_text,
            requestId: e.data.requestId
        });

    } catch (error) {
        self.postMessage({
            type: 'error',
            error: error.message
        });
    }
};
