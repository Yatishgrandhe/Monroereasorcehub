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
 * Generate professional summary using enhanced local AI
 * Analyzes experience context, industry, and key achievements
 */
export function generateProfessionalSummaryLocal(experience: ResumeExperience[], targetJob?: string): string {
  if (experience.length === 0) {
    return 'Experienced professional seeking to leverage expertise in a challenging new role.';
  }

  // Extract key information from experience
  const totalYears = calculateTotalYears(experience);
  const industries = extractUniqueValues(experience, 'company');
  const positions = experience.map(exp => exp.position);
  const topPosition = experience[0]?.position || 'professional';
  
  // Analyze achievements and impact
  const achievements = extractAchievements(experience);
  const hasQuantifiedResults = achievements.some(ach => /\d+/.test(ach));
  const keySkills = extractAdvancedSkills(experience, targetJob);
  const industry = analyzeIndustry(experience);
  
  // Generate context-aware summary
  const impactLevel = assessImpactLevel(experience);
  const leadershipExperience = hasLeadershipExperience(experience);
  
  // Build personalized summary based on profile
  let summary = '';
  
  if (targetJob) {
    summary = generateTargetedSummary(topPosition, totalYears, experience, keySkills, targetJob);
  } else if (hasQuantifiedResults && impactLevel === 'high') {
    summary = generateImpactDrivenSummary(topPosition, totalYears, achievements, keySkills, industry);
  } else if (leadershipExperience) {
    summary = generateLeadershipSummary(topPosition, totalYears, experience, keySkills);
  } else {
    summary = generateStandardSummary(topPosition, totalYears, experience, keySkills, industry);
  }
  
  return summary;
}

function generateTargetedSummary(position: string, years: number, experience: ResumeExperience[], skills: string[], targetJob: string): string {
  const relevantSkills = skills.slice(0, 4).join(', ');
  return `Results-driven ${position} with ${years}+ years of experience in ${analyzeIndustry(experience)}. Proven expertise in ${relevantSkills} with a track record of delivering measurable impact. Seeking to contribute expertise in ${targetJob.toLowerCase()} role.`;
}

function generateImpactDrivenSummary(position: string, years: number, achievements: string[], skills: string[], industry: string): string {
  const topSkills = skills.slice(0, 3).join(', ');
  return `Accomplished ${position} with ${years}+ years of ${industry} experience. Specialized in ${topSkills} with demonstrated success in driving results and optimizing performance. Strong background in strategic planning and execution.`;
}

function generateLeadershipSummary(position: string, years: number, experience: ResumeExperience[], skills: string[]): string {
  const teamSize = estimateTeamSize(experience);
  const keySkills = skills.slice(0, 3).join(', ');
  return `Leadership-focused ${position} with ${years}+ years of experience managing teams and delivering operational excellence. Expertise in ${keySkills} with a proven ability to drive organizational growth and team development.`;
}

function generateStandardSummary(position: string, years: number, experience: ResumeExperience[], skills: string[], industry: string): string {
  const keySkills = skills.slice(0, 3).join(', ');
  return `Dedicated ${position} with ${years}+ years of experience in ${industry}. Proficient in ${keySkills} with a commitment to quality and innovation. Seeking opportunities to leverage expertise in challenging new environment.`;
}

/**
 * Enhanced skill suggestion using intelligent keyword extraction
 */
export function suggestSkillsLocal(jobDescription: string, currentSkills: string[] = []): string[] {
  const skillsMap: { [key: string]: string[] } = {
    // Technical
    'javascript': ['JavaScript', 'ES6+', 'React', 'Node.js'],
    'python': ['Python', 'Django', 'Flask', 'Pandas'],
    'java': ['Java', 'Spring', 'Hibernate', 'Maven'],
    'react': ['React', 'Redux', 'TypeScript', 'JSX'],
    'sql': ['SQL', 'Database Design', 'MySQL', 'PostgreSQL'],
    'html': ['HTML', 'CSS', 'Frontend Development'],
    'node': ['Node.js', 'Express', 'REST APIs', 'Backend Development'],
    'aws': ['AWS', 'Cloud Computing', 'S3', 'EC2'],
    'docker': ['Docker', 'Containerization', 'Kubernetes'],
    
    // Business
    'project manage': ['Project Management', 'Agile', 'Scrum', 'Kanban'],
    'leadership': ['Leadership', 'Team Management', 'Mentoring'],
    'budget': ['Budget Management', 'Financial Planning', 'Cost Control'],
    'client': ['Client Relations', 'Account Management', 'Customer Success'],
    'sales': ['Sales', 'Business Development', 'Revenue Generation'],
    'market': ['Marketing', 'SEO', 'Digital Marketing', 'Social Media'],
    
    // Soft Skills
    'communicat': ['Communication', 'Presentation', 'Public Speaking'],
    'problem': ['Problem Solving', 'Critical Thinking', 'Analytical Skills'],
    'adapt': ['Adaptability', 'Flexibility', 'Change Management'],
    'collaborat': ['Collaboration', 'Teamwork', 'Cross-functional'],
  };
  
  const lowerDesc = jobDescription.toLowerCase();
  const suggested = new Set<string>();
  
  // Extract specific skills mentioned
  for (const [keyword, skills] of Object.entries(skillsMap)) {
    if (lowerDesc.includes(keyword)) {
      skills.forEach(skill => {
        if (!currentSkills.includes(skill) && suggested.size < 8) {
          suggested.add(skill);
        }
      });
    }
  }
  
  // Extract capitalized tech terms
  const techMatches = jobDescription.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
  techMatches.forEach(term => {
    const techSkills = ['React', 'Python', 'Java', 'JavaScript', 'TypeScript', 'Angular', 'Vue'];
    if (techSkills.includes(term) && !currentSkills.includes(term)) {
      if (suggested.size < 8) suggested.add(term);
    }
  });
  
  return Array.from(suggested).slice(0, 8);
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
 * Enhanced bullet point enhancement with AI-level intelligence
 */
export function enhanceBulletPointLocal(originalText: string, context?: string): string {
  if (!originalText.trim()) return originalText;

  let enhanced = originalText.trim();
  const words = enhanced.split(' ');

  // Detect if it's already well-formatted
  const hasActionVerb = /^[A-Z][a-z]+ed\s/.test(enhanced) || /^[A-Z][a-z]+ing\s/.test(enhanced);
  const hasQuantifier = /\d+/.test(enhanced);
  
  if (hasActionVerb && hasQuantifier && enhanced.length > 30) {
    return enhanced; // Already well-formatted
  }

  // Get appropriate action verb based on context
  const actionVerb = selectOptimalActionVerb(enhanced.toLowerCase(), context);
  
  // Capitalize and format
  if (!hasActionVerb) {
    enhanced = actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1) + ' ' + 
                enhanced.toLowerCase().replace(/^(implemented|managed|created|developed|led|achieved)\s+/i, '');
  } else {
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  }

  // Add quantifiers if missing
  if (!hasQuantifier && enhanced.length < 50) {
    const quantifiers = ['multiple', 'various', 'numerous', 'several'];
    enhanced = enhanced.replace(/\b(many|a lot of)\b/g, quantifiers[Math.floor(Math.random() * quantifiers.length)]);
  }

  return enhanced;
}

/**
 * Check if we should use local AI (fallback mode)
 */
export function shouldUseLocalAI(): boolean {
  return !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '';
}

// Advanced helper functions

function extractAchievements(experience: ResumeExperience[]): string[] {
  return experience.flatMap(exp => exp.achievements || []).filter(Boolean);
}

function assessImpactLevel(experience: ResumeExperience[]): 'high' | 'medium' | 'low' {
  const achievements = extractAchievements(experience);
  const hasNumbers = achievements.some(ach => /\d+/.test(ach));
  const leadershipWords = experience.some(exp => 
    /manage|lead|supervis|direct|coordinate|oversee/i.test(exp.description || '')
  );
  
  if (hasNumbers && leadershipWords) return 'high';
  if (hasNumbers || leadershipWords) return 'medium';
  return 'low';
}

function hasLeadershipExperience(experience: ResumeExperience[]): boolean {
  return experience.some(exp => {
    const desc = (exp.description || '').toLowerCase();
    const position = exp.position.toLowerCase();
    return /manage|lead|supervis|direct|head|chief|executive/i.test(desc) || 
           /manager|director|lead|supervisor|head|chief|executive/i.test(position);
  });
}

function estimateTeamSize(experience: ResumeExperience[]): number {
  let maxTeamSize = 0;
  experience.forEach(exp => {
    const teamMatch = (exp.description || '').match(/team of (\d+)|managed (\d+)|supervised (\d+)/i);
    if (teamMatch) {
      const size = parseInt(teamMatch[1] || teamMatch[2] || teamMatch[3] || '0');
      maxTeamSize = Math.max(maxTeamSize, size);
    }
  });
  return maxTeamSize || 3; // Default to 3 if not found
}

function analyzeIndustry(experience: ResumeExperience[]): string {
  if (experience.length === 0) return 'various industries';
  
  const industries = {
    tech: /software|technology|tech|it|computer|programming|developer|engineer/i,
    finance: /finance|financial|banking|investment|accounting|trading/i,
    healthcare: /health|medical|hospital|clinic|pharmacy|patient care/i,
    retail: /retail|sales|store|merchandise|customer service/i,
    education: /education|school|teaching|university|college|student/i,
    manufacturing: /manufacturing|production|factory|assembly|industrial/i
  };
  
  for (const [industry, pattern] of Object.entries(industries)) {
    if (experience.some(exp => pattern.test(exp.company || exp.position || exp.description || ''))) {
      return industry;
    }
  }
  
  return 'professional services';
}

function extractAdvancedSkills(experience: ResumeExperience[], targetJob?: string): string[] {
  const skillMap: { [key: string]: string } = {
    // Technical
    software: 'Software Development', code: 'Programming', program: 'Software Engineering',
    design: 'UI/UX Design', web: 'Web Development', app: 'Application Development',
    database: 'Database Management', sql: 'SQL', api: 'API Development',
    
    // Business
    manage: 'Project Management', team: 'Team Leadership', lead: 'Leadership',
    budget: 'Budget Management', strategy: 'Strategic Planning', sales: 'Sales',
    market: 'Marketing', client: 'Client Relations', business: 'Business Development',
    
    // Soft Skills
    communicate: 'Communication', collaborate: 'Collaboration', adapt: 'Adaptability',
    problem: 'Problem Solving', analyze: 'Analytical Thinking', creative: 'Creative Thinking'
  };
  
  const foundSkills = new Set<string>();
  
  experience.forEach(exp => {
    const fullText = `${exp.description} ${exp.position} ${targetJob || ''}`.toLowerCase();
    
    for (const [keyword, skill] of Object.entries(skillMap)) {
      if (fullText.includes(keyword) && !foundSkills.has(skill)) {
        foundSkills.add(skill);
      }
    }
  });
  
  // Add specific technical skills if technology-related
  if (experience.some(exp => 
    (exp.position + exp.description).toLowerCase().includes('engineer') ||
    (exp.position + exp.description).toLowerCase().includes('developer')
  )) {
    foundSkills.add('Full-Stack Development');
    foundSkills.add('Version Control (Git)');
  }
  
  return Array.from(foundSkills).slice(0, 8);
}

function selectOptimalActionVerb(text: string, context?: string): string {
  const verbGroups = {
    development: ['Developed', 'Implemented', 'Built', 'Created', 'Designed'],
    management: ['Managed', 'Led', 'Directed', 'Supervised', 'Coordinated'],
    improvement: ['Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Refined'],
    achievement: ['Achieved', 'Delivered', 'Generated', 'Completed', 'Accomplished'],
    analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Reviewed', 'Studied'],
    collaboration: ['Collaborated', 'Partnered', 'Worked with', 'Team member', 'Participated']
  };
  
  // Determine best verb group based on context
  if (context) {
    const lowerContext = context.toLowerCase();
    if (lowerContext.includes('team') || lowerContext.includes('manage')) return 'Managed';
    if (lowerContext.includes('develop') || lowerContext.includes('build')) return 'Developed';
    if (lowerContext.includes('improve') || lowerContext.includes('optimize')) return 'Improved';
    if (lowerContext.includes('achieve') || lowerContext.includes('deliver')) return 'Achieved';
  }
  
  // Default based on text content
  if (/\d+%/.test(text) || /increase|grow|improve/i.test(text)) return 'Improved';
  if (/team|manage|lead/i.test(text)) return 'Managed';
  if (/develop|build|create|design/i.test(text)) return 'Developed';
  
  return 'Executed';
}

