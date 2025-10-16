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
import { createClient } from '@/lib/supabase/server';

export async function generateSummaryAction(experience: ResumeData['experience']) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const summary = await generateProfessionalSummary(experience);
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

    const enhanced = await enhanceBulletPoint(originalText, context);
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

    const skills = await suggestSkills(jobDescription, currentSkills);
    return { success: true, skills };
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return { success: false, error: 'Failed to suggest skills' };
  }
}

export async function generateCoverLetterAction(resumeData: ResumeData, jobPosting: JobPosting) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const coverLetter = await generateCoverLetter(resumeData, jobPosting);
    return { success: true, coverLetter };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return { success: false, error: 'Failed to generate cover letter' };
  }
}

export async function analyzeJobAction(jobDescription: string) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const analysis = await analyzeJobDescription(jobDescription);
    return { success: true, analysis };
  } catch (error) {
    console.error('Error analyzing job:', error);
    return { success: false, error: 'Failed to analyze job description' };
  }
}

export async function generateInterviewQuestionsAction(jobPosting: JobPosting) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const questions = await generateInterviewQuestions(jobPosting);
    return { success: true, questions };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return { success: false, error: 'Failed to generate interview questions' };
  }
}
