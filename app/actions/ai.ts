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
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    let summary: string;
    if (shouldUseLocalAI()) {
      summary = generateProfessionalSummaryLocal(experience as ResumeExperience[], targetJob);
    } else {
      try {
        summary = await generateProfessionalSummary(experience);
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
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    let enhanced: string;
    if (shouldUseLocalAI()) {
      enhanced = enhanceBulletPointLocal(originalText, context);
    } else {
      try {
        enhanced = await enhanceBulletPoint(originalText, context);
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
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    let skills: string[];
    if (shouldUseLocalAI()) {
      skills = suggestSkillsLocal(jobDescription, currentSkills);
    } else {
      try {
        skills = await suggestSkills(jobDescription, currentSkills);
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
