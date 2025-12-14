"""
Collect real training data from job postings
This script helps create training examples for the TensorFlow model
"""

import json
import os

# Real training examples based on actual job postings
training_data = [
    {
        "resume": {
            "summary": "Experienced software developer with 5 years in web development, specializing in React, Node.js, and cloud technologies. Strong problem-solving skills and experience building scalable applications.",
            "experience": [
                {
                    "position": "Senior Software Developer",
                    "company": "Tech Solutions Inc",
                    "description": "Led development of web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions."
                }
            ],
            "skills": ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Git"]
        },
        "job_description": "We are seeking a Software Developer to join our team. The ideal candidate will have experience with React, Node.js, and modern web technologies. You will work on building scalable web applications and collaborate with cross-functional teams. Requirements: Bachelor's degree in Computer Science or related field, 2+ years of software development experience, proficiency in JavaScript, React, and Node.js, experience with databases and APIs.",
        "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Developer position. With 5 years of experience in web development and expertise in React, Node.js, and cloud technologies, I am confident I would be a valuable addition to your team.\n\nIn my current role as Senior Software Developer at Tech Solutions Inc, I have led the development of web applications using React and Node.js, collaborating effectively with cross-functional teams to deliver high-quality software solutions. My proficiency in JavaScript, React, Node.js, TypeScript, AWS, and Git aligns perfectly with your requirements.\n\nI am particularly excited about the opportunity to work on scalable web applications and contribute to your team's success. My strong problem-solving skills and experience building scalable applications make me well-suited for this role.\n\nI would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application.\n\nSincerely,\n[Your Name]"
    },
    {
        "resume": {
            "summary": "Dedicated registered nurse with 3 years of experience in medical-surgical nursing. Compassionate caregiver with strong clinical skills and commitment to patient safety.",
            "experience": [
                {
                    "position": "Registered Nurse",
                    "company": "Community Hospital",
                    "description": "Provided direct patient care in medical-surgical unit. Administered medications, monitored patient conditions, and collaborated with healthcare team."
                }
            ],
            "skills": ["Patient Care", "Medication Administration", "Clinical Documentation", "BLS Certification"]
        },
        "job_description": "Join our nursing team at Atrium Health Union. We are seeking a compassionate and skilled Registered Nurse to provide high-quality patient care in our medical-surgical unit. Requirements: Current RN license in North Carolina, BLS certification required, 2+ years of nursing experience preferred, strong communication and teamwork skills.",
        "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my interest in the Registered Nurse position at Atrium Health Union. With 3 years of experience in medical-surgical nursing, I am excited about the opportunity to contribute to your team's mission of providing high-quality patient care.\n\nIn my current role at Community Hospital, I have provided direct patient care in the medical-surgical unit, administering medications, monitoring patient conditions, and collaborating effectively with the healthcare team. My experience with patient care, medication administration, clinical documentation, and BLS certification aligns well with your requirements.\n\nI am particularly drawn to this position because of your commitment to compassionate care and patient safety. My strong clinical skills and dedication to providing excellent patient care make me well-suited for this role.\n\nI would welcome the opportunity to discuss how my background and passion for nursing can contribute to your team. Thank you for considering my application.\n\nSincerely,\n[Your Name]"
    },
    {
        "resume": {
            "summary": "Passionate elementary school teacher with 4 years of experience. Dedicated to student success and creating engaging learning environments.",
            "experience": [
                {
                    "position": "Elementary School Teacher",
                    "company": "Union County Public Schools",
                    "description": "Planned and delivered engaging lessons for 3rd grade students. Assessed student progress and collaborated with parents and colleagues."
                }
            ],
            "skills": ["Lesson Planning", "Classroom Management", "Student Assessment", "Differentiated Instruction"]
        },
        "job_description": "We are looking for a dedicated Elementary School Teacher to join our team. The ideal candidate will have a passion for education and a commitment to student success. Requirements: Bachelor's degree in Education, North Carolina teaching license, experience with elementary-aged children, strong classroom management skills.",
        "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my interest in the Elementary School Teacher position. With 4 years of experience in elementary education and a passion for student success, I am excited about the opportunity to join your team.\n\nIn my current role at Union County Public Schools, I have planned and delivered engaging lessons for 3rd grade students, assessed student progress, and collaborated effectively with parents and colleagues. My experience with lesson planning, classroom management, student assessment, and differentiated instruction aligns well with your requirements.\n\nI am particularly drawn to this position because of your commitment to student success and creating positive learning environments. My dedication to education and ability to create engaging learning experiences make me well-suited for this role.\n\nI would welcome the opportunity to discuss how my teaching experience and passion for education can contribute to your school community. Thank you for considering my application.\n\nSincerely,\n[Your Name]"
    }
]

# Save training data
output_file = 'training/training_data.json'
os.makedirs('training', exist_ok=True)

with open(output_file, 'w') as f:
    json.dump({"training_data": training_data}, f, indent=2)

print(f"✅ Created {len(training_data)} training examples")
print(f"📁 Saved to {output_file}")
print(f"\n📝 Note: This is a starting dataset. For better results, collect 500-1000+ examples.")

