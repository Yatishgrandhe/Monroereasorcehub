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
 * Rewrite experience bullet points for maximum impact
 */
export function rewriteBulletPointForImpact(originalText: string, context?: string): string {
  if (!originalText.trim()) return originalText;

  let rewritten = originalText.trim();

  // Remove weak language
  const weakPhrases = ['responsible for', 'worked on', 'helped with', 'was involved in', 'assisted in'];
  weakPhrases.forEach(phrase => {
    rewritten = rewritten.replace(new RegExp(phrase, 'gi'), '');
  });

  // Add strong action verb
  if (!/^[A-Z][a-z]+ed\s/.test(rewritten)) {
    const actionVerb = selectOptimalActionVerb(rewritten.toLowerCase(), context);
    rewritten = actionVerb + ' ' + rewritten;
  }

  // Add impact statements
  if (!/\d+|percent|%/.test(rewritten)) {
    rewritten = rewritten.replace(/(improved|increased|decreased|reduced)/gi, (match) => {
      return match + ' significantly';
    });
  }

  return rewritten.charAt(0).toUpperCase() + rewritten.slice(1);
}

/**
 * Generate multiple bullet point variations
 */
export function generateBulletVariations(originalText: string, context?: string): string[] {
  const variations: string[] = [];
  
  // Original enhanced version
  variations.push(enhanceBulletPointLocal(originalText, context));
  
  // Quantified version (if no numbers exist)
  if (!/\d+/.test(originalText)) {
    const quantified = originalText.replace(/many/g, '15+').replace(/multiple/g, '10+').replace(/various/g, 'several');
    variations.push(enhanceBulletPointLocal(quantified, context));
  }
  
  // Result-focused version
  const resultFocused = originalText.replace(/work|task|project/gi, 'achievements');
  variations.push(enhanceBulletPointLocal(resultFocused, context));
  
  // Leadership version (if context suggests it)
  if (context && /team|manage|lead/i.test(context)) {
    const leadership = 'Led cross-functional teams to ' + originalText.toLowerCase();
    variations.push(enhanceBulletPointLocal(leadership, context));
  }
  
  return [...new Set(variations)].slice(0, 3);
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
  // Always use local AI as primary method - it's fast, reliable, and works offline
  // Gemini can be used as enhancement if API key is available
  const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== '';
  // For now, prefer local AI for consistency and reliability
  // Set to false if you want to prefer Gemini when available
  return true; // Always use local AI as primary
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

/**
 * Generate cover letter using offline template-based approach
 */
export function generateCoverLetterLocal(
  resumeData: ResumeData,
  jobPosting: { title: string; company: string; description: string; location?: string }
): string {
  const { personalInfo, experience = [], skills = [], education = [] } = resumeData;
  const { title, company, description, location } = jobPosting;
  
  // Ensure personalInfo has defaults
  const firstName = personalInfo?.firstName || 'Your';
  const lastName = personalInfo?.lastName || 'Name';
  const email = personalInfo?.email || 'your.email@example.com';
  const phone = personalInfo?.phone || '(555) 555-5555';
  
  // Extract key information
  const topExperience = experience.slice(0, 3);
  const relevantSkills = matchSkillsToJob(skills, description);
  const yearsOfExperience = calculateTotalYears(experience);
  const highestEducation = education.length > 0 ? education[0] : null;
  
  // Generate personalized greeting
  const greeting = `Dear Hiring Manager,`;
  
  // Opening paragraph
  const opening = generateOpeningParagraph(
    firstName,
    lastName,
    title,
    company,
    yearsOfExperience,
    highestEducation
  );
  
  // Body paragraphs highlighting experience
  const experienceParagraph = generateExperienceParagraph(
    topExperience,
    title,
    description
  );
  
  // Skills and qualifications paragraph
  const skillsParagraph = generateSkillsParagraph(
    relevantSkills,
    description
  );
  
  // Closing paragraph
  const closing = generateClosingParagraph(company, title);
  
  // Signature
  const signature = `Sincerely,\n${firstName} ${lastName}\n${email}\n${phone}`;
  
  return `${greeting}\n\n${opening}\n\n${experienceParagraph}\n\n${skillsParagraph}\n\n${closing}\n\n${signature}`;
}

/**
 * Generate interview questions based on job posting
 */
export function generateInterviewQuestionsLocal(
  jobPosting: { title: string; company: string; description: string; requirements?: string[] }
): string[] {
  const { title, company, description, requirements = [] } = jobPosting;
  const questions: string[] = [];
  
  // Opening questions - tailored to the role
  questions.push(`Tell me about yourself and why you're interested in the ${title} position at ${company}.`);
  questions.push(`What attracted you to this specific role and our company?`);
  
  // Role-specific questions based on job description (these are more detailed now)
  const roleQuestions = extractRoleSpecificQuestions(title, description, requirements);
  questions.push(...roleQuestions);
  
  // Standard behavioral questions (only if we don't have enough role-specific)
  if (questions.length < 8) {
    questions.push('Describe a challenging situation you faced at work and how you handled it.');
    questions.push('What are your greatest strengths and how do they apply to this role?');
    questions.push('Tell me about a time you had to learn something new quickly. How did you approach it?');
  }
  
  // Technical questions if applicable (avoid duplicates)
  if (isTechnicalRole(title, description) && !questions.some(q => q.toLowerCase().includes('technical') || q.toLowerCase().includes('code'))) {
    questions.push('Can you walk me through your approach to solving complex technical problems?');
    questions.push('How do you stay current with industry trends and best practices in your field?');
  }
  
  // Leadership questions if applicable (avoid duplicates)
  if (isLeadershipRole(title, description) && !questions.some(q => q.toLowerCase().includes('lead') || q.toLowerCase().includes('team'))) {
    questions.push('Describe your leadership style and how you motivate your team.');
    questions.push('How do you handle conflicts within your team?');
  }
  
  // Company and culture questions
  questions.push(`What do you know about ${company}, and why do you want to work here?`);
  questions.push('What questions do you have about our company culture, team, or the role?');
  
  // Return 12-15 questions for comprehensive preparation
  return questions.slice(0, 15);
}

/**
 * Analyze job description locally
 */
export function analyzeJobDescriptionLocal(jobDescription: string): {
  keyRequirements: string[];
  preferredSkills: string[];
  experienceLevel: string;
  salaryRange?: string;
  benefits?: string[];
} {
  const lowerDesc = jobDescription.toLowerCase();
  
  // Extract requirements
  const keyRequirements = extractRequirements(jobDescription);
  
  // Extract skills
  const preferredSkills = extractSkillsFromDescription(jobDescription);
  
  // Determine experience level
  const experienceLevel = determineExperienceLevel(lowerDesc);
  
  // Extract salary if mentioned
  const salaryRange = extractSalaryRange(jobDescription);
  
  // Extract benefits if mentioned
  const benefits = extractBenefits(jobDescription);
  
  return {
    keyRequirements,
    preferredSkills,
    experienceLevel,
    salaryRange,
    benefits
  };
}

// Helper functions for cover letter generation

function generateOpeningParagraph(
  firstName: string,
  lastName: string,
  jobTitle: string,
  company: string,
  years: number,
  education: { degree: string; field: string; institution: string } | null
): string {
  const educationText = education 
    ? ` with a ${education.degree} in ${education.field} from ${education.institution}`
    : '';
  const educationText2 = education
    ? ` My ${education.degree} in ${education.field} from ${education.institution} has prepared me well for this role.`
    : '';
  const experienceText = years > 0 
    ? `With ${years}+ years of experience${educationText}, I am excited to apply for the ${jobTitle} position at ${company}.`
    : `I am writing to express my strong interest in the ${jobTitle} position at ${company}.${educationText2}`;
  
  return experienceText;
}

function generateExperienceParagraph(
  experience: ResumeExperience[],
  jobTitle: string,
  jobDescription: string
): string {
  if (experience.length === 0) {
    // Generate a paragraph based on job requirements when no experience
    const jobLower = jobDescription.toLowerCase();
    let relevantText = 'I am confident that my background and skills make me a strong candidate for this position.';
    
    if (jobLower.includes('team') || jobLower.includes('collaborat')) {
      relevantText = 'I am a collaborative team player with strong communication skills and a commitment to working effectively with others to achieve common goals.';
    } else if (jobLower.includes('problem') || jobLower.includes('solve')) {
      relevantText = 'I am a proactive problem-solver with strong analytical skills and the ability to think critically to find effective solutions.';
    } else if (jobLower.includes('customer') || jobLower.includes('client')) {
      relevantText = 'I am dedicated to providing excellent customer service and building strong relationships with clients and stakeholders.';
    }
    
    return relevantText;
  }
  
  const topExp = experience[0];
  const relevantAspects = findRelevantAspects(topExp.description, jobDescription);
  const achievements = topExp.achievements || [];
  const hasQuantifiedResults = achievements.some(ach => /\d+/.test(ach));
  
  // Build more detailed experience paragraph
  let paragraph = `In my role as ${topExp.position} at ${topExp.company}, I ${relevantAspects}`;
  
  // Add specific achievement if available
  if (achievements.length > 0 && hasQuantifiedResults) {
    const topAchievement = achievements.find(ach => /\d+/.test(ach)) || achievements[0];
    paragraph += `. Notably, I ${topAchievement.toLowerCase()}`;
  } else if (topExp.description) {
    // Extract key action from description
    const keyAction = extractKeyAction(topExp.description);
    if (keyAction) {
      paragraph += `. I ${keyAction}`;
    }
  }
  
  paragraph += `. This experience has equipped me with the skills and knowledge necessary to excel in the ${jobTitle} position.`;
  
  return paragraph;
}

function generateSkillsParagraph(
  skills: string[],
  jobDescription: string
): string {
  if (skills.length === 0) {
    return `I am eager to bring my dedication and work ethic to your team.`;
  }
  
  const topSkills = skills.slice(0, 4);
  const skillList = topSkills.length > 2 
    ? `${topSkills.slice(0, -1).join(', ')}, and ${topSkills[topSkills.length - 1]}`
    : topSkills.join(' and ');
  
  // Extract company name or use generic
  const companyName = extractCompanyName(jobDescription) || 'your organization';
  
  // Add context about how skills apply
  const jobLower = jobDescription.toLowerCase();
  let skillContext = '';
  if (jobLower.includes('team') || jobLower.includes('collaborat')) {
    skillContext = ' I am particularly excited about the opportunity to collaborate with your team and contribute to your continued success.';
  } else if (jobLower.includes('innov') || jobLower.includes('develop')) {
    skillContext = ' I am eager to apply these skills to drive innovation and contribute to your organization\'s growth.';
  }
  
  return `My proficiency in ${skillList} aligns perfectly with the requirements of this role. I am confident that these skills, combined with my passion for excellence and commitment to delivering results, will enable me to make a significant contribution to ${companyName}.${skillContext}`;
}

function generateClosingParagraph(company: string, title: string): string {
  return `I am excited about the opportunity to contribute to ${company}'s continued success and would welcome the chance to discuss how my background, skills, and enthusiasm align with the ${title} position. Thank you for considering my application.`;
}

function matchSkillsToJob(skills: string[], jobDescription: string): string[] {
  const lowerDesc = jobDescription.toLowerCase();
  return skills.filter(skill => 
    lowerDesc.includes(skill.toLowerCase()) || 
    skill.toLowerCase().includes('management') ||
    skill.toLowerCase().includes('communication')
  ).slice(0, 6);
}

function findRelevantAspects(experience: string, jobDescription: string): string {
  const expLower = experience.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // More sophisticated matching
  if (jobLower.includes('team') && expLower.includes('team')) {
    return 'successfully managed cross-functional teams and collaborated effectively with stakeholders';
  }
  if (jobLower.includes('project') && expLower.includes('project')) {
    return 'led multiple projects from conception to completion, consistently delivering on time and within budget';
  }
  if (jobLower.includes('client') && expLower.includes('client')) {
    return 'built strong relationships with clients and stakeholders, resulting in increased satisfaction and retention';
  }
  if (jobLower.includes('develop') && expLower.includes('develop')) {
    return 'developed innovative solutions and improved processes, driving efficiency and productivity';
  }
  if (jobLower.includes('manage') && expLower.includes('manage')) {
    return 'managed complex operations and streamlined workflows to optimize performance';
  }
  if (jobLower.includes('analyze') || jobLower.includes('data')) {
    return 'analyzed data and metrics to inform strategic decisions and drive business growth';
  }
  if (jobLower.includes('sales') || jobLower.includes('revenue')) {
    return 'drove sales growth and revenue generation through strategic initiatives and relationship building';
  }
  
  return 'gained valuable experience and achieved measurable results that directly contributed to organizational success';
}

function extractCompanyName(jobDescription: string): string | null {
  // Try to extract company name from common patterns
  const patterns = [
    /at\s+([A-Z][a-zA-Z\s&]+?)(?:\s+is|,|\s+we|$)/i,
    /join\s+([A-Z][a-zA-Z\s&]+?)(?:\s+as|,|\s+we|$)/i,
    /([A-Z][a-zA-Z\s&]+?)\s+is\s+seeking/i
  ];
  
  for (const pattern of patterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      const company = match[1].trim();
      // Filter out common false positives
      if (!company.match(/^(We|Our|The|This|Position|Role|Job)/i) && company.length > 2 && company.length < 50) {
        return company;
      }
    }
  }
  
  return null;
}

function extractKeyAction(description: string): string {
  // Extract the main action verb and context
  const actionVerbs = ['developed', 'managed', 'led', 'created', 'implemented', 'improved', 'achieved', 'delivered'];
  const lowerDesc = description.toLowerCase();
  
  for (const verb of actionVerbs) {
    if (lowerDesc.includes(verb)) {
      // Extract the phrase after the verb
      const verbIndex = lowerDesc.indexOf(verb);
      const afterVerb = description.substring(verbIndex + verb.length).trim();
      const phrase = afterVerb.split(/[.,;]/)[0].trim();
      if (phrase.length > 10 && phrase.length < 80) {
        return verb + ' ' + phrase.toLowerCase();
      }
    }
  }
  
  return description.split(/[.,;]/)[0].toLowerCase().trim();
}

// Helper functions for interview questions

function extractRoleSpecificQuestions(
  title: string,
  description: string,
  requirements: string[]
): string[] {
  const questions: string[] = [];
  const lowerDesc = description.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const combined = (title + ' ' + description).toLowerCase();
  
  // Management & Leadership Roles
  if (lowerTitle.includes('manager') || lowerTitle.includes('director') || lowerTitle.includes('lead') || 
      lowerTitle.includes('supervisor') || lowerTitle.includes('head') || lowerTitle.includes('chief')) {
    questions.push('How do you prioritize tasks when managing multiple projects with competing deadlines?');
    questions.push('Describe a time when you had to make a difficult decision that affected your team. What was your process?');
    questions.push('How do you motivate and develop team members to achieve their best performance?');
    questions.push('Tell me about a time you had to handle a conflict between team members. How did you resolve it?');
    questions.push('What strategies do you use to ensure your team meets goals and deadlines?');
  }
  
  // Customer Service & Sales Roles
  if (lowerDesc.includes('customer') || lowerDesc.includes('client') || lowerDesc.includes('sales') || 
      lowerTitle.includes('sales') || lowerTitle.includes('customer service') || lowerTitle.includes('account')) {
    questions.push('How do you handle difficult or upset customers? Walk me through a specific example.');
    questions.push('Describe a time when you went above and beyond for a customer. What was the outcome?');
    questions.push('How do you build and maintain relationships with clients or customers?');
    questions.push('Tell me about a time you successfully closed a sale or secured a new client.');
    questions.push('How do you handle rejection or objections in a sales or customer service context?');
  }
  
  // Technical & Engineering Roles
  if (isTechnicalRole(title, description)) {
    questions.push('Can you walk me through your approach to solving a complex technical problem?');
    questions.push('Describe a challenging project you worked on. What technologies did you use and what was the outcome?');
    questions.push('How do you stay current with industry trends and new technologies?');
    questions.push('Tell me about a time you had to debug a difficult issue. What was your process?');
    questions.push('How do you ensure code quality and best practices in your work?');
    if (lowerDesc.includes('team') || lowerDesc.includes('collaborat')) {
      questions.push('Describe your experience working in an agile or collaborative development environment.');
    }
  }
  
  // Healthcare Roles
  if (lowerTitle.includes('nurse') || lowerTitle.includes('doctor') || lowerTitle.includes('therapist') || 
      lowerTitle.includes('healthcare') || lowerDesc.includes('patient care') || lowerDesc.includes('medical')) {
    questions.push('Describe a challenging patient situation you handled. How did you ensure quality care?');
    questions.push('How do you handle stress and maintain composure in high-pressure medical situations?');
    questions.push('Tell me about a time you had to communicate difficult information to a patient or their family.');
    questions.push('How do you stay current with medical best practices and continuing education?');
  }
  
  // Education Roles
  if (lowerTitle.includes('teacher') || lowerTitle.includes('educator') || lowerTitle.includes('instructor') || 
      lowerDesc.includes('classroom') || lowerDesc.includes('curriculum') || lowerDesc.includes('student')) {
    questions.push('Describe your teaching philosophy and how you adapt it to different learning styles.');
    questions.push('Tell me about a time you had to handle a challenging student situation. How did you resolve it?');
    questions.push('How do you engage students and maintain their interest in the subject matter?');
    questions.push('Describe how you differentiate instruction to meet diverse student needs.');
  }
  
  // Finance & Accounting Roles
  if (lowerDesc.includes('budget') || lowerDesc.includes('financial') || lowerDesc.includes('accounting') || 
      lowerTitle.includes('accountant') || lowerTitle.includes('financial') || lowerTitle.includes('analyst')) {
    questions.push('How do you manage budgets and ensure cost-effectiveness? Provide a specific example.');
    questions.push('Describe a time you identified a financial discrepancy or issue. How did you address it?');
    questions.push('How do you ensure accuracy and attention to detail in financial work?');
    questions.push('Tell me about your experience with financial reporting and analysis.');
  }
  
  // Marketing & Communications Roles
  if (lowerTitle.includes('marketing') || lowerTitle.includes('communication') || lowerTitle.includes('social media') || 
      lowerDesc.includes('campaign') || lowerDesc.includes('brand') || lowerDesc.includes('content')) {
    questions.push('Describe a successful marketing campaign you developed or contributed to. What made it successful?');
    questions.push('How do you measure the success of marketing initiatives?');
    questions.push('Tell me about your experience with different marketing channels and platforms.');
    questions.push('How do you stay current with marketing trends and consumer behavior?');
  }
  
  // Project Management
  if (lowerDesc.includes('project management') || lowerDesc.includes('agile') || lowerDesc.includes('scrum') || 
      lowerTitle.includes('project manager') || lowerTitle.includes('pm')) {
    questions.push('Describe a complex project you managed from start to finish. What challenges did you face?');
    questions.push('How do you handle scope creep or changing project requirements?');
    questions.push('Tell me about your experience with project management methodologies (Agile, Scrum, Waterfall, etc.).');
    questions.push('How do you ensure projects stay on time and within budget?');
  }
  
  // Data & Analytics Roles
  if (lowerTitle.includes('analyst') || lowerTitle.includes('data') || lowerDesc.includes('analytics') || 
      lowerDesc.includes('data analysis') || lowerDesc.includes('reporting')) {
    questions.push('Describe a time you used data analysis to solve a business problem or make a recommendation.');
    questions.push('What tools and techniques do you use for data analysis and visualization?');
    questions.push('How do you ensure data accuracy and quality in your work?');
    questions.push('Tell me about a time you presented complex data findings to non-technical stakeholders.');
  }
  
  // Requirements-based questions
  if (requirements.length > 0) {
    const keyRequirements = requirements.slice(0, 3);
    keyRequirements.forEach(req => {
      if (req.length > 10 && req.length < 150) {
        questions.push(`This role requires ${req.toLowerCase()}. Can you tell me about your experience with this?`);
      }
    });
  }
  
  // Skills-based questions from description
  const skills = extractSkillsFromDescription(description);
  if (skills.length > 0) {
    const topSkills = skills.slice(0, 2);
    topSkills.forEach(skill => {
      questions.push(`How would you rate your proficiency with ${skill}, and can you provide an example of how you've used it?`);
    });
  }
  
  return questions;
}

function isTechnicalRole(title: string, description: string): boolean {
  const techKeywords = ['developer', 'engineer', 'programmer', 'software', 'technical', 'it', 'technology'];
  const combined = (title + ' ' + description).toLowerCase();
  return techKeywords.some(keyword => combined.includes(keyword));
}

function isLeadershipRole(title: string, description: string): boolean {
  const leadershipKeywords = ['manager', 'director', 'lead', 'supervisor', 'head', 'chief', 'executive'];
  const combined = (title + ' ' + description).toLowerCase();
  return leadershipKeywords.some(keyword => combined.includes(keyword));
}

// Helper functions for job analysis

function extractRequirements(jobDescription: string): string[] {
  const requirements: string[] = [];
  const lines = jobDescription.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 10 && trimmed.length < 200) {
      if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+[.)]\s/) || 
          trimmed.toLowerCase().includes('required') ||
          trimmed.toLowerCase().includes('must have')) {
        requirements.push(trimmed.replace(/^[-•*\d.)]\s*/, '').trim());
      }
    }
  }
  
  // If no bullet points found, extract key sentences
  if (requirements.length === 0) {
    const sentences = jobDescription.split(/[.!?]+/).filter(s => s.trim().length > 20);
    requirements.push(...sentences.slice(0, 5).map(s => s.trim()));
  }
  
  return requirements.slice(0, 8);
}

function extractSkillsFromDescription(jobDescription: string): string[] {
  const skills: string[] = [];
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
    'project management', 'agile', 'scrum', 'leadership', 'communication',
    'sales', 'marketing', 'customer service', 'analytics', 'data analysis'
  ];
  
  const lowerDesc = jobDescription.toLowerCase();
  skillKeywords.forEach(skill => {
    if (lowerDesc.includes(skill)) {
      skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
  
  return [...new Set(skills)].slice(0, 8);
}

function determineExperienceLevel(description: string): string {
  if (description.includes('entry') || description.includes('junior') || description.includes('0-2 years')) {
    return 'entry level';
  }
  if (description.includes('senior') || description.includes('5+ years') || description.includes('10+ years')) {
    return 'senior level';
  }
  if (description.includes('mid') || description.includes('3-5 years')) {
    return 'mid level';
  }
  return 'mid level'; // default
}

function extractSalaryRange(jobDescription: string): string | undefined {
  const salaryMatch = jobDescription.match(/\$[\d,]+(?:-\$[\d,]+)?(?:\s*(?:per year|annually|hourly))?/i);
  if (salaryMatch) {
    return salaryMatch[0];
  }
  return undefined;
}

function extractBenefits(jobDescription: string): string[] {
  const benefits: string[] = [];
  const benefitKeywords = {
    'health insurance': /health\s*(?:insurance|care|benefits)/i,
    'dental': /dental/i,
    'vision': /vision/i,
    '401k': /401k|retirement/i,
    'pto': /pto|paid\s*time\s*off|vacation/i,
    'remote': /remote|work\s*from\s*home|flexible\s*work/i,
    'flexible schedule': /flexible\s*schedule/i
  };
  
  for (const [benefit, pattern] of Object.entries(benefitKeywords)) {
    if (pattern.test(jobDescription)) {
      benefits.push(benefit);
    }
  }
  
  return benefits;
}

/**
 * Auto-fix common resume issues
 */
export function autoFixResume(resumeData: ResumeData): ResumeData {
  const fixed = { ...resumeData };
  
  // Fix email format if missing @
  if (fixed.personalInfo.email && !fixed.personalInfo.email.includes('@')) {
    // Try to add common domain
    fixed.personalInfo.email = fixed.personalInfo.email + '@gmail.com';
  }
  
  // Fix phone format
  if (fixed.personalInfo.phone) {
    // Remove non-digit characters and format
    const digitsOnly = fixed.personalInfo.phone.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      fixed.personalInfo.phone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    }
  }
  
  // Capitalize first letter of all skills
  fixed.skills = fixed.skills.map(skill => 
    skill.charAt(0).toUpperCase() + skill.slice(1)
  );
  
  // Fix experience dates
  fixed.experience = fixed.experience.map(exp => {
    const fixedExp = { ...exp };
    
    // Ensure end date is after start date
    if (fixedExp.startDate && fixedExp.endDate && !exp.current) {
      const start = new Date(fixedExp.startDate);
      const end = new Date(fixedExp.endDate);
      if (start > end) {
        [fixedExp.startDate, fixedExp.endDate] = [fixedExp.endDate, fixedExp.startDate];
      }
    }
    
    // Capitalize company and position
    fixedExp.company = fixedExp.company.charAt(0).toUpperCase() + fixedExp.company.slice(1);
    fixedExp.position = fixedExp.position.charAt(0).toUpperCase() + fixedExp.position.slice(1);
    
    // Fix achievements
    fixedExp.achievements = fixedExp.achievements
      .filter(ach => ach.trim().length > 0)
      .map(ach => {
        // Ensure each achievement starts with capital and has proper punctuation
        ach = ach.trim();
        if (!ach.endsWith('.') && !ach.endsWith('!')) {
          ach += '.';
        }
        return ach.charAt(0).toUpperCase() + ach.slice(1);
      });
    
    return fixedExp;
  });
  
  // Fix education
  fixed.education = fixed.education.map(edu => {
    const fixedEdu = { ...edu };
    fixedEdu.institution = fixedEdu.institution.charAt(0).toUpperCase() + fixedEdu.institution.slice(1);
    fixedEdu.degree = fixedEdu.degree.charAt(0).toUpperCase() + fixedEdu.degree.slice(1);
    fixedEdu.field = fixedEdu.field.charAt(0).toUpperCase() + fixedEdu.field.slice(1);
    return fixedEdu;
  });
  
  return fixed;
}

/**
 * Generate performance indicators for achievements
 */
export function suggestPerformanceMetrics(achievement: string): string[] {
  const metrics: string[] = [];
  const lower = achievement.toLowerCase();
  
  if (lower.includes('increase') || lower.includes('grow') || lower.includes('improve')) {
    metrics.push('by 20-50%');
    metrics.push('by $X amount');
  }
  
  if (lower.includes('reduce') || lower.includes('decrease') || lower.includes('cut')) {
    metrics.push('by 15-30%');
    metrics.push('costs by $X');
  }
  
  if (lower.includes('team')) {
    metrics.push('of 5-10 members');
    metrics.push('across 3+ departments');
  }
  
  if (lower.includes('project')) {
    metrics.push('delivered on time and under budget');
    metrics.push('reducing timelines by 25%');
  }
  
  return [...new Set(metrics)].slice(0, 2);
}

