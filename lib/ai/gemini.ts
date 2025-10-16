import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
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
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
}

export interface JobPosting {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
}

/**
 * Generate a professional summary based on experience
 */
export async function generateProfessionalSummary(experience: ResumeData['experience']): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const experienceText = experience.map(exp => 
      `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`
    ).join('\n');

    const prompt = `Generate a professional summary for a resume based on the following work experience. 
    Make it 2-3 sentences, professional, and highlight key achievements and skills. Focus on quantifiable results when possible.

    Work Experience:
    ${experienceText}

    Generate only the summary text, no additional formatting or labels.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating professional summary:', error);
    return 'Experienced professional with a proven track record of success in various roles.';
  }
}

/**
 * Enhance bullet points for work experience
 */
export async function enhanceBulletPoint(originalText: string, context?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Improve this resume bullet point to be more impactful and professional. 
    Use action verbs, quantify results when possible, and make it more specific.
    
    Original bullet point: "${originalText}"
    ${context ? `Context: ${context}` : ''}
    
    Return only the improved bullet point, no additional text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error enhancing bullet point:', error);
    return originalText;
  }
}

/**
 * Suggest relevant skills based on job description
 */
export async function suggestSkills(jobDescription: string, currentSkills: string[] = []): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Based on this job description, suggest 5-8 relevant skills that would be valuable for this position.
    Focus on technical skills, software, and competencies mentioned or implied in the job description.
    
    Job Description:
    ${jobDescription}
    
    Current Skills: ${currentSkills.join(', ')}
    
    Return only a comma-separated list of skills, no additional text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const skillsText = response.text().trim();
    
    return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return [];
  }
}

/**
 * Generate a cover letter based on resume and job posting
 */
export async function generateCoverLetter(
  resumeData: ResumeData, 
  jobPosting: JobPosting,
  companyName?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const experienceSummary = resumeData.experience
      .slice(0, 3) // Use top 3 most relevant experiences
      .map(exp => `${exp.position} at ${exp.company}: ${exp.description}`)
      .join('\n');

    const prompt = `Write a professional cover letter for the following job application.
    
    Job Title: ${jobPosting.title}
    Company: ${jobPosting.company}
    Job Description: ${jobPosting.description}
    
    Applicant Information:
    Name: ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}
    Email: ${resumeData.personalInfo.email}
    Phone: ${resumeData.personalInfo.phone}
    
    Relevant Experience:
    ${experienceSummary}
    
    Key Skills: ${resumeData.skills.join(', ')}
    
    Write a compelling cover letter that:
    1. Addresses the hiring manager professionally
    2. Highlights relevant experience and skills
    3. Shows enthusiasm for the role and company
    4. Includes a strong call to action
    5. Is 3-4 paragraphs long
    6. Uses professional business letter format
    
    Include proper greeting, body paragraphs, and closing with signature.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return `Dear Hiring Manager,

I am writing to express my interest in the ${jobPosting.title} position at ${jobPosting.company}. 

Based on my experience and skills, I believe I would be a valuable addition to your team.

I look forward to discussing how my background aligns with your needs.

Sincerely,
${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`;
  }
}

/**
 * Analyze job description and provide insights
 */
export async function analyzeJobDescription(jobDescription: string): Promise<{
  keyRequirements: string[];
  preferredSkills: string[];
  experienceLevel: string;
  salaryRange?: string;
  benefits?: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze this job description and extract key information in JSON format:
    
    Job Description:
    ${jobDescription}
    
    Return a JSON object with the following structure:
    {
      "keyRequirements": ["requirement1", "requirement2", ...],
      "preferredSkills": ["skill1", "skill2", ...],
      "experienceLevel": "entry/mid/senior level",
      "salaryRange": "estimated range if mentioned",
      "benefits": ["benefit1", "benefit2", ...]
    }
    
    Only return the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().trim();
    
    // Try to parse the JSON response
    try {
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing job analysis JSON:', parseError);
      return {
        keyRequirements: [],
        preferredSkills: [],
        experienceLevel: 'mid level',
        benefits: []
      };
    }
  } catch (error) {
    console.error('Error analyzing job description:', error);
    return {
      keyRequirements: [],
      preferredSkills: [],
      experienceLevel: 'mid level',
      benefits: []
    };
  }
}

/**
 * Generate interview questions based on job description
 */
export async function generateInterviewQuestions(jobPosting: JobPosting): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate 8-10 relevant interview questions for this job position.
    
    Job Title: ${jobPosting.title}
    Company: ${jobPosting.company}
    Job Description: ${jobPosting.description}
    
    Include a mix of:
    - Behavioral questions
    - Technical questions (if applicable)
    - Role-specific questions
    - Company culture questions
    
    Return only the questions, one per line, no numbering or additional formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionsText = response.text().trim();
    
    return questionsText.split('\n').filter(q => q.trim().length > 0);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return [
      'Tell me about yourself.',
      'Why are you interested in this position?',
      'What are your strengths and weaknesses?',
      'Where do you see yourself in 5 years?',
      'Why do you want to work for our company?'
    ];
  }
}
