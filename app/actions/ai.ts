'use server';

import { 
  generateProfessionalSummary, 
  enhanceBulletPoint, 
  suggestSkills, 
  generateCoverLetter, 
  analyzeJobDescription,
  generateInterviewQuestions,
  type ResumeData,
  type JobPosting
} from '@/lib/ai/gemini';
import {
  generateProfessionalSummaryLocal,
  enhanceBulletPointLocal,
  suggestSkillsLocal,
  generateCoverLetterLocal,
  generateInterviewQuestionsLocal,
  analyzeJobDescriptionLocal,
  shouldUseLocalAI,
  type ResumeExperience
} from '@/lib/ai/local-ai';
import { createClient } from '@/lib/supabase/server';

export async function generateSummaryAction(experience: ResumeData['experience'], targetJob?: string) {
  try {
    // Use local AI for all users (works offline and for guests)
    let summary: string;
    if (shouldUseLocalAI()) {
      summary = generateProfessionalSummaryLocal(experience as ResumeExperience[], targetJob);
    } else {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
        summary = await generateProfessionalSummary(experience);
        } else {
          // Use local AI for guest users
          summary = generateProfessionalSummaryLocal(experience as ResumeExperience[], targetJob);
        }
      } catch (error) {
        console.error('Gemini failed, using local AI fallback:', error);
        summary = generateProfessionalSummaryLocal(experience as ResumeExperience[], targetJob);
      }
    }
    
    return { success: true, summary };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { success: false, error: 'Failed to generate summary' };
  }
}

export async function enhanceBulletPointAction(originalText: string, context?: string) {
  try {
    // Use local AI for all users (works offline and for guests)
    let enhanced: string;
    if (shouldUseLocalAI()) {
      enhanced = enhanceBulletPointLocal(originalText, context);
    } else {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
        enhanced = await enhanceBulletPoint(originalText, context);
        } else {
          // Use local AI for guest users
          enhanced = enhanceBulletPointLocal(originalText, context);
        }
      } catch (error) {
        console.error('Gemini failed, using local AI fallback:', error);
        enhanced = enhanceBulletPointLocal(originalText, context);
      }
    }

    return { success: true, enhanced };
  } catch (error) {
    console.error('Error enhancing bullet point:', error);
    return { success: false, error: 'Failed to enhance bullet point' };
  }
}

export async function suggestSkillsAction(jobDescription: string, currentSkills: string[] = []) {
  try {
    // Use local AI for all users (works offline and for guests)
    let skills: string[];
    if (shouldUseLocalAI()) {
      skills = suggestSkillsLocal(jobDescription, currentSkills);
    } else {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
        skills = await suggestSkills(jobDescription, currentSkills);
        } else {
          // Use local AI for guest users
          skills = suggestSkillsLocal(jobDescription, currentSkills);
        }
      } catch (error) {
        console.error('Gemini failed, using local AI fallback:', error);
        skills = suggestSkillsLocal(jobDescription, currentSkills);
      }
    }

    return { success: true, skills };
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return { success: false, error: 'Failed to suggest skills' };
  }
}

export async function generateCoverLetterAction(resumeData: ResumeData, jobPosting: JobPosting) {
  try {
    // Use local AI for offline functionality (works for all users)
    // Note: TensorFlow.js models are called from client-side components, not server actions
    let coverLetter: string;
    if (shouldUseLocalAI()) {
      coverLetter = generateCoverLetterLocal(resumeData, jobPosting);
    } else {
      try {
    const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          coverLetter = await generateCoverLetter(resumeData, jobPosting);
        } else {
          // Use local AI for guest users
          coverLetter = generateCoverLetterLocal(resumeData, jobPosting);
    }
      } catch (error) {
        console.error('Gemini failed, using local AI fallback:', error);
        coverLetter = generateCoverLetterLocal(resumeData, jobPosting);
      }
    }
    
    return { success: true, coverLetter };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return { success: false, error: 'Failed to generate cover letter' };
  }
}

export async function analyzeJobAction(jobDescription: string) {
  try {
    // Use local AI for offline functionality (works for all users)
    let analysis;
    if (shouldUseLocalAI()) {
      analysis = analyzeJobDescriptionLocal(jobDescription);
    } else {
      try {
    const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          analysis = await analyzeJobDescription(jobDescription);
        } else {
          // Use local AI for guest users
          analysis = analyzeJobDescriptionLocal(jobDescription);
        }
      } catch (error) {
        console.error('Gemini failed, using local AI fallback:', error);
        analysis = analyzeJobDescriptionLocal(jobDescription);
      }
    }
    
    return { success: true, analysis };
  } catch (error) {
    console.error('Error analyzing job:', error);
    return { success: false, error: 'Failed to analyze job description' };
  }
}

export async function generateInterviewQuestionsAction(jobPosting: JobPosting) {
  try {
    // Use local AI for offline functionality (works for all users)
    // Note: TensorFlow.js models are called from client-side components, not server actions
    let questions: string[];
    if (shouldUseLocalAI()) {
      questions = generateInterviewQuestionsLocal(jobPosting);
    } else {
      try {
    const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          questions = await generateInterviewQuestions(jobPosting);
        } else {
          // Use local AI for guest users
          questions = generateInterviewQuestionsLocal(jobPosting);
    }
      } catch (error) {
        console.error('Gemini failed, using local AI fallback:', error);
        questions = generateInterviewQuestionsLocal(jobPosting);
      }
    }
    
    return { success: true, questions };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return { success: false, error: 'Failed to generate interview questions' };
  }
}
