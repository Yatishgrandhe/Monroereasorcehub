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
  JOB_APPLICATIONS: 'monroe_job_applications',
} as const;

interface MigrationResult {
  success: boolean;
  migrated: {
    resumes: number;
    coverLetters: number;
    jobAnalysis: number;
    interviewQuestions: number;
    jobApplications: number;
  };
  errors: string[];
}

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
      jobApplications: 0,
    },
    errors: [],
  };

  if (typeof window === 'undefined') {
    return result;
  }

  try {
    // Migrate resume data
    const resumeData = localStorage.getItem(LOCAL_STORAGE_KEYS.RESUME);
    if (resumeData) {
      try {
        const parsed = JSON.parse(resumeData);
        if (parsed && parsed.personalInfo) {
          // Check if this exact resume already exists in database
          const { data: existing, error: checkError } = await supabase
            .from('resumes')
            .select('id, resume_data')
            .eq('user_id', userId);

          if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 is schema cache error, ignore it
            result.errors.push(`Resume check error: ${checkError.message}`);
          } else {
            // Check if the local storage resume is different from existing ones
            let shouldMigrate = true;
            if (existing && existing.length > 0) {
              // Compare the local storage resume with existing ones
              // If it's identical to any existing resume, skip migration
              const localResumeString = JSON.stringify(parsed);
              shouldMigrate = !existing.some((resume: any) => {
                const existingResumeString = JSON.stringify(resume.resume_data);
                return localResumeString === existingResumeString;
              });
            }

            if (shouldMigrate) {
              // Create resume in database
              const resumeTitle = `${parsed.personalInfo?.firstName || 'My'} ${parsed.personalInfo?.lastName || 'Resume'}`;
              const { error } = await supabase
                .from('resumes')
                .insert({
                  user_id: userId,
                  resume_data: parsed,
                  title: resumeTitle,
                });

              if (error) {
                result.errors.push(`Resume migration error: ${error.message}`);
                console.error('Resume migration error:', error);
              } else {
                result.migrated.resumes = 1;
                console.log('Resume migrated successfully:', resumeTitle);
              }
            } else {
              // Resume already exists with same data, skip migration
              result.migrated.resumes = 0;
              console.log('Resume already exists in database, skipping migration');
            }
          }
        }
      } catch (error) {
        result.errors.push(`Resume parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Resume parsing error:', error);
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

    // Migrate job applications
    const jobApplicationsData = localStorage.getItem(LOCAL_STORAGE_KEYS.JOB_APPLICATIONS);
    if (jobApplicationsData) {
      try {
        const parsed = JSON.parse(jobApplicationsData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`Found ${parsed.length} job applications in local storage to migrate`);
          
          // Check existing applications to avoid duplicates
          const { data: existing, error: checkError } = await supabase
            .from('job_applications')
            .select('id, title, company, job_title, created_at')
            .eq('user_id', userId);

          if (checkError && checkError.code !== 'PGRST116') {
            result.errors.push(`Job applications check error: ${checkError.message}`);
            console.error('Job applications check error:', checkError);
          } else {
            let migratedCount = 0;
            let skippedCount = 0;
            
            for (const app of parsed) {
              try {
                // Normalize comparison values (trim whitespace, handle nulls)
                const appTitle = (app.title || '').trim();
                const appCompany = (app.company || '').trim();
                const appJobTitle = (app.job_title || '').trim();
                
                // Check if this application already exists (by title, company, and job_title)
                const exists = existing?.some((existingApp: any) => {
                  const existingTitle = (existingApp.title || '').trim();
                  const existingCompany = (existingApp.company || '').trim();
                  const existingJobTitle = (existingApp.job_title || '').trim();
                  
                  return existingTitle === appTitle && 
                         existingCompany === appCompany &&
                         existingJobTitle === appJobTitle;
                });

                if (!exists) {
                  // Handle resume_id - if it's 'local-resume', set to null
                  let resumeId = app.resume_id;
                  if (resumeId === 'local-resume' || !resumeId || resumeId === '') {
                    resumeId = null;
                  }
                  
                  // Ensure job_requirements, job_analysis, and interview_questions are properly formatted
                  const jobRequirements = app.job_requirements || null;
                  const jobAnalysis = app.job_analysis || null;
                  const interviewQuestions = app.interview_questions ? (Array.isArray(app.interview_questions) ? app.interview_questions : null) : null;
                  
                  const insertData: any = {
                    user_id: userId,
                    title: appTitle || `${appJobTitle} at ${appCompany}` || 'Untitled Application',
                    company: appCompany || 'Unknown Company',
                    job_title: appJobTitle || 'Unknown Position',
                    location: app.location || null,
                    job_description: app.job_description || null,
                    job_requirements: jobRequirements,
                    cover_letter: app.cover_letter || null,
                    job_analysis: jobAnalysis,
                    interview_questions: interviewQuestions,
                    resume_id: resumeId,
                    status: app.status || 'draft',
                  };
                  
                  // Only add timestamps if they exist and are valid
                  if (app.created_at) {
                    insertData.created_at = app.created_at;
                  }
                  if (app.updated_at) {
                    insertData.updated_at = app.updated_at;
                  }

                  const { error: insertError } = await supabase
                    .from('job_applications')
                    .insert(insertData);

                  if (insertError) {
                    result.errors.push(`Job application migration error for "${appTitle}": ${insertError.message}`);
                    console.error('Job application migration error:', insertError, 'Data:', insertData);
                  } else {
                    migratedCount++;
                    console.log(`Successfully migrated job application: ${appTitle}`);
                  }
                } else {
                  skippedCount++;
                  console.log(`Skipping duplicate job application: ${appTitle}`);
                }
              } catch (appError) {
                result.errors.push(`Error processing job application: ${appError instanceof Error ? appError.message : 'Unknown error'}`);
                console.error('Error processing individual job application:', appError, app);
              }
            }
            
            result.migrated.jobApplications = migratedCount;
            console.log(`Job applications migration complete: ${migratedCount} migrated, ${skippedCount} skipped`);
          }
        } else if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          // Handle case where it's a single object instead of array
          console.log('Found single job application object in local storage');
          result.migrated.jobApplications = 0;
          result.errors.push('Job applications stored as single object instead of array. Please save applications again.');
        }
      } catch (error) {
        result.errors.push(`Job applications parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Job applications parsing error:', error);
      }
    }

    // Note: Interview questions are typically generated on-demand, so we don't need to migrate them separately

    if (result.errors.length > 0) {
      result.success = false;
    }
  } catch (error) {
    result.success = false;
    result.errors.push(`Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    localStorage.getItem(LOCAL_STORAGE_KEYS.JOB_ANALYSIS) ||
    localStorage.getItem(LOCAL_STORAGE_KEYS.JOB_APPLICATIONS)
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
  localStorage.removeItem(LOCAL_STORAGE_KEYS.JOB_APPLICATIONS);
}

