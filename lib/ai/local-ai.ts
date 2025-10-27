/**
 * Local AI System - Fallback when Gemini is not available
 * Uses rule-based and template-based approaches for resume enhancement
 */

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: ResumeExperience[];
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
}

/**
 * Generate professional summary using local AI
 */
export function generateProfessionalSummaryLocal(experience: ResumeExperience[]): string {
  if (experience.length === 0) {
    return 'Experienced professional seeking to leverage expertise in a challenging new role.';
  }

  // Extract key information from experience
  const totalYears = calculateTotalYears(experience);
  const industries = extractUniqueValues(experience, 'company');
  const positions = experience.map(exp => exp.position);
  const topPosition = experience[0]?.position || 'professional';
  
  // Generate summary based on experience
  const templates = [
    `Results-driven ${topPosition} with ${totalYears}+ years of experience delivering impactful solutions across ${industries.length} different ${industries.length === 1 ? 'industry' : 'industries'}. Proven track record in ${extractSkills(experience).slice(0, 3).join(', ')}.`,
    
    `Experienced ${topPosition} with ${totalYears}+ years of progressive experience in ${getTopIndustry(experience)}. Specialized in ${getSpecializations(experience)} with demonstrated success in driving growth and innovation.`,
    
    `Dynamic ${topPosition} with ${totalYears}+ years of experience building high-performing teams and delivering exceptional results. Expertise in ${getCoreCompetencies(experience)} with a passion for continuous improvement.`
  ];

  // Return a template based on experience diversity
  const index = industries.length > 2 ? 0 : Math.floor(Math.random() * templates.length);
  return templates[index];
}

/**
 * Enhance bullet point using local AI rules
 */
export function enhanceBulletPointLocal(originalText: string, context?: string): string {
  if (!originalText.trim()) return originalText;

  let enhanced = originalText.trim();

  // Add action verbs if not present
  const actionVerbs = [
    'Developed', 'Implemented', 'Created', 'Managed', 'Led', 'Achieved',
    'Optimized', 'Designed', 'Executed', 'Delivered', 'Improved', 'Established',
    'Built', 'Streamlined', 'Increased', 'Reduced', 'Enhanced', 'Collaborated',
    'Coordinated', 'Maintained', 'Produced', 'Analyzed', 'Resolved', 'Supervised'
  ];

  // Check if starts with lowercase
  if (enhanced[0] && enhanced[0] === enhanced[0].toLowerCase()) {
    const matchingVerb = actionVerbs.find(verb => 
      enhanced.toLowerCase().startsWith(verb.toLowerCase().slice(0, -1))
    );
    if (!matchingVerb) {
      enhanced = actionVerbs[Math.floor(Math.random() * actionVerbs.length)] + ' ' + enhanced.charAt(0).toLowerCase() + enhanced.slice(1);
    } else {
      enhanced = matchingVerb.charAt(0).toUpperCase() + matchingVerb.slice(1) + enhanced.slice(enhanced.toLowerCase().indexOf('ed') + 2);
    }
  }

  // Capitalize first letter if not already
  if (enhanced[0] && enhanced[0] !== enhanced[0].toUpperCase()) {
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  }

  // Add quantifiers if context suggests it
  if (context && !/\d+/.test(enhanced)) {
    const quantifiers = ['numerous', 'multiple', 'various', 'several'];
    enhanced = enhanced.replace(/many/g, quantifiers[Math.floor(Math.random() * quantifiers.length)]);
  }

  return enhanced;
}

/**
 * Suggest skills based on job description using keyword extraction
 */
export function suggestSkillsLocal(jobDescription: string, currentSkills: string[] = []): string[] {
  // Common skill keywords
  const skillKeywords = [
    // Technical
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
    'TypeScript', 'Angular', 'Vue', 'Git', 'AWS', 'Docker', 'Kubernetes',
    
    // Business
    'Project Management', 'Agile', 'Scrum', 'Leadership', 'Team Management',
    'Strategic Planning', 'Business Development', 'Client Relations',
    
    // Soft Skills
    'Communication', 'Problem Solving', 'Critical Thinking', 'Time Management',
    'Analytical Skills', 'Collaboration', 'Adaptability', 'Creative Thinking'
  ];

  const lowerDesc = jobDescription.toLowerCase();
  const suggested: string[] = [];

  // Extract keywords from job description
  skillKeywords.forEach(skill => {
    if (lowerDesc.includes(skill.toLowerCase().substring(0, 5)) && !currentSkills.includes(skill)) {
      suggested.push(skill);
    }
  });

  // Also extract common phrases
  const phrases = jobDescription.match(/\b\w+\s+\w+\b/g) || [];
  phrases.forEach(phrase => {
    if (phrase.length > 8 && !currentSkills.includes(phrase) && suggested.length < 8) {
      suggested.push(phrase);
    }
  });

  return suggested.slice(0, 8);
}

// Helper functions

function calculateTotalYears(experience: ResumeExperience[]): number {
  let totalMonths = 0;
  experience.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.current ? new Date() : new Date(exp.endDate);
    const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    totalMonths += Math.max(0, months);
  });
  return Math.floor(totalMonths / 12);
}

function extractUniqueValues(array: any[], field: string): string[] {
  return [...new Set(array.map(item => item[field]))];
}

function extractSkills(experience: ResumeExperience[]): string[] {
  const skills: string[] = [];
  experience.forEach(exp => {
    if (exp.description) {
      const words = exp.description.toLowerCase().split(/\W+/);
      if (words.includes('team')) skills.push('Team Management');
      if (words.includes('budget')) skills.push('Budget Management');
      if (words.includes('sales')) skills.push('Sales');
      if (words.includes('marketing')) skills.push('Marketing');
      if (words.includes('development')) skills.push('Development');
    }
  });
  return [...new Set(skills)];
}

function getTopIndustry(experience: ResumeExperience[]): string {
  if (experience.length === 0) return 'various industries';
  return 'technology and business development';
}

function getSpecializations(experience: ResumeExperience[]): string {
  const specializations = extractSkills(experience).slice(0, 2);
  return specializations.length > 0 ? specializations.join(' and ') : 'strategic planning and execution';
}

function getCoreCompetencies(experience: ResumeExperience[]): string {
  const competencies = extractSkills(experience).slice(0, 3);
  return competencies.length > 0 ? competencies.join(', ') : 'operations and management';
}

/**
 * Check if we should use local AI (fallback mode)
 */
export function shouldUseLocalAI(): boolean {
  return !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '';
}

