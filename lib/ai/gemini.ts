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
export async function generateProfessionalSummary(
  experience: ResumeData['experience'],
  targetJob?: string,
  industry?: string,
  experienceLevel?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const experienceText = experience.length > 0
      ? experience.map(exp => `${exp.position} at ${exp.company}: ${exp.achievements.join('; ')}`).join('\n')
      : 'Entry level with focus on high-performance learning and immediate impact.';

    const prompt = `Act as an elite executive recruiter. Generate a professional summary consisting of EXACTLY 3 powerful sentences.
    
    Context:
    - Target Role: ${targetJob || 'Professional'}
    - Industry: ${industry || 'General Business'}
    - Experience Level: ${experienceLevel || 'Mid-Career'}
    - Experience History: ${experienceText}
    
    Structure Requirements (Strict):
    1. Sentence 1: A high-impact opening that fuses identity, total years of expertise, and core industry background.
    2. Sentence 2: A narrative of historical professional impact, highlighting quantifiable wins or scaled projects.
    3. Sentence 3: A definitive value proposition explaining exactly how the candidate's expertise solves pain points in the ${targetJob || 'target'} role.
    
    Rules:
    - Exactly 3 sentences. No more, no less.
    - No markdown formatting. No bolding. No labels like "Summary:".
    - Avoid generic words like "passionate" or "hardworking". Use "orchestrated", "architected", "spearheaded".
    - If experience is limited, focus on potential, technical acumen, and career trajectory.
    
    Return ONLY the 3 sentences of raw text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Safety cleanup: remove any labels or markdown Gemini might have added
    text = text.replace(/^(Summary|Professional Summary|Narrative):\s*/i, '');
    text = text.replace(/\*\*/g, ''); // Remove bolding

    return text;
  } catch (error) {
    console.error('Error generating professional summary:', error);
    return `Results-driven ${targetJob || 'professional'} with a proven record of excellence in ${industry || 'the field'}. Committed to contributing strategic value and driving organizational success through high-level expertise. Seeking to leverage specialized skills for immediate impact in a ${experienceLevel || 'dynamic'} environment.`;
  }
}

/**
 * Enhance bullet points for work experience
 */
export async function enhanceBulletPoint(originalText: string, context?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Act as an elite career strategist. Transform the following basic resume bullet point into a high-impact, results-driven achievement statement.
    
    Current Statement: "${originalText}"
    ${context ? `Role/Context: ${context}` : ''}
    
    Execution Requirements:
    1. Apply the STAR Method (Situation, Task, Action, Result) seamlessly.
    2. Quantify results where implied (e.g., efficiency gains, revenue growth, team scale).
    3. Use aggressive, sophisticated action verbs (e.g., Orchestrated, Spearheaded, Catalyzed, Architected).
    4. Focus on the "So What?" – emphasize the business value and organizational impact.
    5. Keep it concise but pack it with deep professional weight.
    
    Return ONLY the enhanced bullet point string.`;

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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Act as a technical recruiter analyzing a high-stakes job description.
    
    Job Description:
    ${jobDescription}
    
    Current Candidate Skills: ${currentSkills.join(', ')}
    
    Instructions:
    1. Identify the 10 most critical skills (Hard Tech, Soft Skills, and Domain Expertise) required to win this role.
    2. Prioritize skills that are high-leverage and distinguish an elite candidate.
    3. Categorize them into Core Technical, Strategic Leadership, and Industry Knowledge.
    
    Return ONLY a single comma-separated list of these 10 skills. No explanations.`;

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
  jobPosting: JobPosting
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const experienceSummary = resumeData.experience
      .slice(0, 3)
      .map(exp => `${exp.position} at ${exp.company}: ${exp.achievements.join(' ')}`)
      .join('\n\n');

    const prompt = `Architect a persuasive, elite-level cover letter that positions the candidate as the "Only Logical Choice" for this role.
    
    Target Organization & Role: ${jobPosting.company} | ${jobPosting.title}
    Job Landscape: ${jobPosting.description}
    
    Candidate Identity: ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}
    Signature Skills: ${resumeData.skills.join(', ')}
    Historical Impact:
    ${experienceSummary}
    
    Letter Architecture:
    1. Opening: Disruptive and high-impact hook. Immediately address the company's pain point or mission.
    2. The "Why Me": Connect historical wins directly to the job requirements. Use strong, assertive language.
    3. The "Why Them": Demonstrate deep alignment with company values and future growth.
    4. Closing: Confident call to action.
    
    Tone: Sophisticated, bold, professional, and slightly aggressive in its competence.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobPosting.title} position...`;
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Deep-dive analysis of the provided job description. Act as a headhunter.
    
    Context:
    ${jobDescription}
    
    Extract and synthesize the following into a JSON schema:
    1. Key Requirements: The non-negotiable hard requirements.
    2. Preferred Skills: The "nice to have" edge-drivers.
    3. Experience Level: Precise classification.
    4. Strategic Insights: Undisclosed benefits or salary signals.
    
    JSON Template:
    {
      "keyRequirements": [],
      "preferredSkills": [],
      "experienceLevel": "",
      "salaryRange": "",
      "benefits": []
    }
    
    Return ONLY the JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().trim();

    try {
      return JSON.parse(jsonText.replace(/```json|```/g, ''));
    } catch (parseError) {
      console.error('Error parsing job analysis JSON:', parseError);
      return {
        keyRequirements: [],
        preferredSkills: [],
        experienceLevel: 'Mid-Level',
        benefits: []
      };
    }
  } catch (error) {
    console.error('Error analyzing job description:', error);
    return {
      keyRequirements: [],
      preferredSkills: [],
      experienceLevel: 'Mid-Level',
      benefits: []
    };
  }
}

/**
 * Generate interview questions based on job description
 */
export async function generateInterviewQuestions(jobPosting: JobPosting): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Act as an elite interviewer for ${jobPosting.company}. Generate 10 high-caliber interview questions for the ${jobPosting.title} role.
    
    Job Context: ${jobPosting.description}
    
    Question Strategy:
    - 3 Behavioral/Situational (STORM/STAR based)
    - 4 Deep Technical/Role-Specific Competencies
    - 2 Strategic/Cultural Alignment
    - 1 "Curveball" creative question to test adaptability.
    
    Return questions as a simple list, one per line. No numbering.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionsText = response.text().trim();

    return questionsText.split('\n').filter(q => q.trim().length > 0);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return ['Tell me about your most significant professional achievement.'];
  }
}

