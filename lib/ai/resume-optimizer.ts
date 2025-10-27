/**
 * Advanced Resume Optimization AI
 * Provides intelligent feedback and suggestions to improve resume quality
 */

export interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsOptimization: string[];
  skillGaps: string[];
  impactEnhancements: string[];
}

export interface JobMatchAnalysis {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  resumeOptimizations: string[];
}

/**
 * Analyze resume quality and provide comprehensive feedback
 */
export function analyzeResumeQuality(resumeData: any, targetJob?: string): ResumeAnalysis {
  const analysis: ResumeAnalysis = {
    overallScore: 100,
    strengths: [],
    weaknesses: [],
    suggestions: [],
    atsOptimization: [],
    skillGaps: [],
    impactEnhancements: []
  };

  // Check for personal info completeness
  if (!resumeData.personalInfo?.email || !resumeData.personalInfo?.phone) {
    analysis.weaknesses.push('Missing contact information');
    analysis.overallScore -= 10;
  } else {
    analysis.strengths.push('Complete contact information');
  }

  // Check for professional summary
  if (!resumeData.summary || resumeData.summary.length < 50) {
    analysis.weaknesses.push('Professional summary is too short or missing');
    analysis.suggestions.push('Write a compelling 2-3 sentence professional summary highlighting your key achievements');
    analysis.overallScore -= 15;
  } else {
    analysis.strengths.push('Strong professional summary');
  }

  // Check experience section
  if (resumeData.experience.length === 0) {
    analysis.weaknesses.push('No work experience listed');
    analysis.overallScore -= 20;
  } else {
    resumeData.experience.forEach((exp: any, index: number) => {
      if (!exp.description || exp.description.length < 20) {
        analysis.weaknesses.push(`Experience #${index + 1} lacks detail`);
        analysis.suggestions.push(`Add more details about your role and responsibilities in "${exp.position}"`);
      }
      
      if (!exp.achievements || exp.achievements.length === 0) {
        analysis.weaknesses.push(`Experience #${index + 1} has no achievements`);
        analysis.suggestions.push(`Add 3-5 bullet points highlighting your achievements at ${exp.company}`);
      } else {
        const hasQuantified = exp.achievements.some((ach: string) => /\d+/.test(ach));
        if (!hasQuantified) {
          analysis.impactEnhancements.push(`Add quantifiable metrics to your achievements in "${exp.position}"`);
        } else {
          analysis.strengths.push(`Quantified achievements in ${exp.company}`);
        }
      }
    });
  }

  // Check education section
  if (resumeData.education.length === 0) {
    analysis.weaknesses.push('No education listed');
    analysis.overallScore -= 10;
  } else {
    analysis.strengths.push('Education section complete');
  }

  // Check skills section
  if (resumeData.skills.length === 0) {
    analysis.weaknesses.push('No skills listed');
    analysis.suggestions.push('Add 5-10 relevant technical and soft skills');
    analysis.overallScore -= 15;
  } else if (resumeData.skills.length < 5) {
    analysis.weaknesses.push('Too few skills listed');
    analysis.suggestions.push('Consider adding more skills to strengthen your profile');
    analysis.overallScore -= 5;
  } else {
    analysis.strengths.push(`Well-rounded skills list (${resumeData.skills.length} skills)`);
  }

  // ATS Optimization
  const atsKeywords = ['Lead', 'Manage', 'Develop', 'Implement', 'Improve', 'Achieve', 'Increase', 'Decrease'];
  const hasAtsKeywords = JSON.stringify(resumeData).match(new RegExp(atsKeywords.join('|'), 'i'));
  
  if (!hasAtsKeywords) {
    analysis.atsOptimization.push('Use action verbs like "Led", "Managed", "Developed" in your experience');
    analysis.overallScore -= 5;
  }

  if (!resumeData.personalInfo?.linkedin) {
    analysis.atsOptimization.push('Add your LinkedIn profile for better visibility');
  }

  // Generate targeted suggestions based on target job
  if (targetJob) {
    const jobLower = targetJob.toLowerCase();
    
    // Check for relevant keywords based on job type
    if (jobLower.includes('engineer') || jobLower.includes('developer')) {
      const techSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node', 'SQL', 'Git'];
      const hasTechSkills = techSkills.some(skill => 
        JSON.stringify(resumeData.skills).includes(skill)
      );
      
      if (!hasTechSkills) {
        analysis.skillGaps.push('Add technical skills relevant to software engineering');
      }
    }
    
    if (jobLower.includes('manager') || jobLower.includes('lead')) {
      const leadershipKeywords = ['lead', 'manage', 'supervis', 'direct', 'team'];
      const hasLeadership = leadershipKeywords.some(keyword =>
        JSON.stringify(resumeData.experience).toLowerCase().includes(keyword)
      );
      
      if (!hasLeadership) {
        analysis.suggestions.push('Highlight leadership and management experience for managerial roles');
      }
    }
    
    if (jobLower.includes('data') || jobLower.includes('analyst')) {
      const dataSkills = ['SQL', 'Python', 'Excel', 'Analysis', 'Reporting'];
      const hasDataSkills = dataSkills.some(skill => 
        JSON.stringify(resumeData.skills).includes(skill)
      );
      
      if (!hasDataSkills) {
        analysis.skillGaps.push('Add data analysis skills like SQL, Python, or Excel');
      }
    }
  }

  // Calculate final score
  analysis.overallScore = Math.max(0, Math.min(100, analysis.overallScore));

  return analysis;
}

/**
 * Analyze job match and provide recommendations
 */
export function analyzeJobMatch(resumeData: any, jobDescription: string): JobMatchAnalysis {
  const analysis: JobMatchAnalysis = {
    matchPercentage: 0,
    matchingSkills: [],
    missingSkills: [],
    recommendations: [],
    resumeOptimizations: []
  };

  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract skills from job description
  const skillKeywords = [
    // Technical
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css',
    'typescript', 'angular', 'vue', 'git', 'aws', 'docker', 'kubernetes',
    // Business
    'project management', 'agile', 'scrum', 'leadership', 'team management',
    'strategic planning', 'business development', 'client relations',
    // Soft Skills
    'communication', 'problem solving', 'critical thinking', 'time management',
    'analytical skills', 'collaboration', 'adaptability'
  ];

  // Find matching skills
  skillKeywords.forEach(skill => {
    if (jobLower.includes(skill) && resumeText.includes(skill)) {
      analysis.matchingSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    } else if (jobLower.includes(skill) && !resumeText.includes(skill)) {
      analysis.missingSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  // Calculate match percentage
  const totalRelevantSkills = skillKeywords.filter(skill => jobLower.includes(skill)).length;
  const matchingSkillsCount = analysis.matchingSkills.length;
  analysis.matchPercentage = totalRelevantSkills > 0 
    ? Math.round((matchingSkillsCount / totalRelevantSkills) * 100) 
    : 0;

  // Generate recommendations
  if (analysis.matchPercentage < 50) {
    analysis.recommendations.push('Consider acquiring some of the missing skills');
    analysis.resumeOptimizations.push('Highlight skills that match the job description');
  }

  if (analysis.missingSkills.length > 0) {
    analysis.recommendations.push(`Add these skills to your resume: ${analysis.missingSkills.slice(0, 3).join(', ')}`);
  }

  // Check for experience alignment
  const experienceKeywords = extractExperienceKeywords(jobLower);
  let matchingExperience = 0;
  
  resumeData.experience?.forEach((exp: any) => {
    const expText = (exp.position + ' ' + exp.description + ' ' + exp.company).toLowerCase();
    experienceKeywords.forEach(keyword => {
      if (expText.includes(keyword)) {
        matchingExperience++;
      }
    });
  });

  if (matchingExperience === 0) {
    analysis.resumeOptimizations.push('Highlight relevant experience that matches the job requirements');
    analysis.recommendations.push('Emphasize transferable skills from your experience');
  }

  return analysis;
}

/**
 * Generate ATS-optimized bullet points
 */
export function generateATSBulletPoint(achievement: string, context?: string): string {
  let bullet = achievement.trim();
  
  // Ensure it starts with an action verb
  const actionVerbs = [
    'Achieved', 'Increased', 'Decreased', 'Improved', 'Developed', 'Implemented',
    'Managed', 'Led', 'Created', 'Designed', 'Optimized', 'Streamlined'
  ];
  
  const hasActionVerb = actionVerbs.some(verb => bullet.startsWith(verb));
  
  if (!hasActionVerb) {
    const appropriateVerb = selectBestActionVerb(bullet, context);
    bullet = appropriateVerb + ' ' + bullet;
  }
  
  // Add quantifiers if missing
  if (!/\d+/.test(bullet)) {
    const quantifier = selectQuantifier(bullet);
    if (quantifier) {
      bullet = bullet.replace(/many|several|various/g, quantifier);
    }
  }
  
  // Ensure it's concise (60-80 characters ideal)
  if (bullet.length > 120) {
    bullet = bullet.substring(0, 117) + '...';
  }
  
  return bullet.charAt(0).toUpperCase() + bullet.slice(1);
}

function extractExperienceKeywords(jobDescription: string): string[] {
  const keywords: string[] = [];
  
  // Industry-specific keywords
  if (jobDescription.includes('software')) keywords.push('software', 'development', 'coding');
  if (jobDescription.includes('marketing')) keywords.push('marketing', 'campaign', 'brand');
  if (jobDescription.includes('sales')) keywords.push('sales', 'revenue', 'clients');
  if (jobDescription.includes('finance')) keywords.push('finance', 'budget', 'financial');
  if (jobDescription.includes('education')) keywords.push('education', 'teaching', 'students');
  
  return [...new Set(keywords)];
}

function selectBestActionVerb(text: string, context?: string): string {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('team') || textLower.includes('manage')) return 'Managed';
  if (textLower.includes('create') || textLower.includes('develop')) return 'Developed';
  if (textLower.includes('improve') || textLower.includes('optimize')) return 'Improved';
  if (textLower.includes('increase') || textLower.includes('growth')) return 'Increased';
  if (textLower.includes('reduce') || textLower.includes('cut')) return 'Reduced';
  if (textLower.includes('lead')) return 'Led';
  if (textLower.includes('design')) return 'Designed';
  if (textLower.includes('implement')) return 'Implemented';
  
  if (context) {
    if (context.includes('team')) return 'Led';
    if (context.includes('project')) return 'Managed';
    if (context.includes('development')) return 'Developed';
  }
  
  return 'Accomplished';
}

function selectQuantifier(text: string): string | null {
  if (text.includes('team')) return 'team of 5+ members';
  if (text.includes('project')) return '10+ projects';
  if (text.includes('revenue') || text.includes('sales')) return '20%+';
  if (text.includes('time') || text.includes('efficiency')) return '30%+';
  
  return null;
}

/**
 * Suggest improvements for resume content
 */
export function suggestContentImprovements(resumeData: any, targetJob?: string): string[] {
  const suggestions: string[] = [];
  
  // Check summary length
  if (resumeData.summary && resumeData.summary.length < 100) {
    suggestions.push('Expand your professional summary to 100-200 words for better impact');
  }
  
  // Check for quantified achievements
  const allText = JSON.stringify(resumeData);
  const hasNumbers = /\d+/.test(allText);
  if (!hasNumbers) {
    suggestions.push('Add specific numbers and percentages to quantify your achievements (e.g., "Increased sales by 25%")');
  }
  
  // Check keyword density for target job
  if (targetJob) {
    const jobKeywords = extractKeyTerms(targetJob);
    let matchingKeywords = 0;
    
    jobKeywords.forEach(keyword => {
      if (allText.toLowerCase().includes(keyword.toLowerCase())) {
        matchingKeywords++;
      }
    });
    
    if (matchingKeywords < jobKeywords.length / 2) {
      suggestions.push(`Incorporate more keywords from the job description (${targetJob}) to improve ATS match`);
    }
  }
  
  // Check for consistency in date formats
  const hasInconsistentDates = resumeData.experience?.some((exp: any) => {
    return exp.startDate && !exp.startDate.match(/^\d{4}-\d{2}$/);
  });
  
  if (hasInconsistentDates) {
    suggestions.push('Use consistent date format (YYYY-MM) throughout your resume');
  }
  
  return suggestions;
}

function extractKeyTerms(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/);
  return words.filter(word => word.length > 4); // Filter out short words
}

