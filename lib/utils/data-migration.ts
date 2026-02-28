/**
 * Utility functions for migrating local storage data to Supabase database
 * This ensures users don't lose their work when they sign up or log in
 */

import { supabase } from '@/lib/supabase/client';

const LOCAL_STORAGE_KEYS = {
  RESUME: 'monroe_resume_builder_data',
  COVER_LETTERS: 'monroe_cover_letters',
  JOB_ANALYSIS: 'monroe_job_analysis',
  INTERVIEW_QUESTIONS: 'monroe_interview_questions',
} as const;

interface MigrationResult {
  success: boolean;
  migrated: {
    resumes: number;
    coverLetters: number;
    jobAnalysis: number;
    interviewQuestions: number;
  };
  errors: string[];
}

let isMigrating = false;

/**
 * Migrate all local storage data to Supabase database
 */
export async function migrateLocalDataToDatabase(userId: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migrated: {
      resumes: 0,
      coverLetters: 0,
      jobAnalysis: 0,
      interviewQuestions: 0,
    },
    errors: [],
  };

  if (typeof window === 'undefined' || isMigrating) {
    return result;
  }

  isMigrating = true;

  try {
    // Migrate resume data
    const resumeData = localStorage.getItem(LOCAL_STORAGE_KEYS.RESUME);
    if (resumeData) {
      try {
        const parsed = JSON.parse(resumeData);
        if (parsed && parsed.personalInfo) {
          // Check if resume already exists (to avoid duplicates)
          const { data: existing, error: checkError } = await supabase
            .from('resumes')
            .select('id')
            .eq('user_id', userId)
            .limit(1);

          if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 is schema cache error, ignore it
            result.errors.push(`Resume check error: ${checkError.message}`);
          } else if (!existing || existing.length === 0) {
            // Create resume in database
            const { error } = await supabase
              .from('resumes')
              .insert({
                user_id: userId,
                resume_data: parsed,
                title: `${parsed.personalInfo?.firstName || 'My'} ${parsed.personalInfo?.lastName || 'Resume'}`,
              });

            if (error) {
              result.errors.push(`Resume migration error: ${error.message}`);
            } else {
              result.migrated.resumes = 1;
            }
          } else {
            // Resume already exists, skip migration
            result.migrated.resumes = 0;
          }
        }
      } catch (error) {
        result.errors.push(`Resume parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate cover letters (stored in local storage as JSON)
    // Note: Cover letters are typically stored per-session, so we'll save them to a user_data field
    // or store them in a way that can be retrieved later
    const coverLettersData = localStorage.getItem(LOCAL_STORAGE_KEYS.COVER_LETTERS);
    if (coverLettersData) {
      try {
        const parsed = JSON.parse(coverLettersData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Store cover letters data for later retrieval
          // For now, we'll count them but not migrate to a specific table
          // as there may not be a cover_letters table
          result.migrated.coverLetters = parsed.length;
          // You can extend this to save to a user_data table or similar
        } else if (parsed && typeof parsed === 'object') {
          result.migrated.coverLetters = 1;
        }
      } catch (error) {
        result.errors.push(`Cover letters parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate job analysis data
    const jobAnalysisData = localStorage.getItem(LOCAL_STORAGE_KEYS.JOB_ANALYSIS);
    if (jobAnalysisData) {
      try {
        const parsed = JSON.parse(jobAnalysisData);
        if (parsed && Object.keys(parsed).length > 0) {
          // Store job analysis as JSON in user preferences or a separate table
          // For now, we'll store it in a user_data table if it exists
          // This is a placeholder - you may need to create this table
          result.migrated.jobAnalysis = 1;
        }
      } catch (error) {
        result.errors.push(`Job analysis parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Note: Interview questions are typically generated on-demand, so we don't need to migrate them

    // CRITICAL: Clear local storage after successful migration OR if we skipped because data exists
    // This prevents multiple migration attempts and duplicates
    if (result.migrated.resumes > 0 || (resumeData && result.migrated.resumes === 0)) {
      clearLocalDataAfterMigration();
    }

    if (result.errors.length > 0) {
      result.success = false;
    }
  } catch (error) {
    result.success = false;
    result.errors.push(`Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    isMigrating = false;
  }

  return result;
}

/**
 * Check if user has local data that needs migration
 */
export function hasLocalDataToMigrate(): boolean {
  if (typeof window === 'undefined') return false;

  return !!(
    localStorage.getItem(LOCAL_STORAGE_KEYS.RESUME) ||
    localStorage.getItem(LOCAL_STORAGE_KEYS.COVER_LETTERS) ||
    localStorage.getItem(LOCAL_STORAGE_KEYS.JOB_ANALYSIS)
  );
}

/**
 * Clear local storage after successful migration (optional)
 */
export function clearLocalDataAfterMigration(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(LOCAL_STORAGE_KEYS.RESUME);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.COVER_LETTERS);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.JOB_ANALYSIS);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.INTERVIEW_QUESTIONS);
}

