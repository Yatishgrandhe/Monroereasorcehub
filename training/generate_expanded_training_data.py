"""
Generate expanded training dataset using real job patterns
This creates a comprehensive dataset for training
"""

import json
import os

# Expanded training data based on real job postings and patterns
training_data = []

# Software Developer examples
for i in range(10):
    training_data.append({
        "resume": {
            "summary": f"Experienced software developer with {2+i} years in web development, specializing in React, Node.js, and cloud technologies. Strong problem-solving skills and experience building scalable applications.",
            "experience": [
                {
                    "position": "Software Developer" if i < 5 else "Senior Software Developer",
                    "company": f"Tech Company {i+1}",
                    "description": f"Developed web applications using React and Node.js. Collaborated with teams to deliver high-quality software solutions. {'Led development of scalable systems.' if i >= 5 else 'Contributed to team projects.'}"
                }
            ],
            "skills": ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Git", "SQL", "REST APIs"]
        },
        "job_description": "We are seeking a Software Developer to join our team. The ideal candidate will have experience with React, Node.js, and modern web technologies. You will work on building scalable web applications and collaborate with cross-functional teams. Requirements: Bachelor's degree in Computer Science or related field, 2+ years of software development experience, proficiency in JavaScript, React, and Node.js, experience with databases and APIs, strong problem-solving skills.",
        "cover_letter": f"Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Developer position. With {2+i} years of experience in web development and expertise in React, Node.js, and cloud technologies, I am confident I would be a valuable addition to your team.\n\nIn my current role as {'Senior ' if i >= 5 else ''}Software Developer, I have {'led development of' if i >= 5 else 'contributed to'} web applications using React and Node.js, collaborating effectively with cross-functional teams to deliver high-quality software solutions. My proficiency in JavaScript, React, Node.js, TypeScript, AWS, Git, SQL, and REST APIs aligns perfectly with your requirements.\n\nI am particularly excited about the opportunity to work on scalable web applications and contribute to your team's success. My strong problem-solving skills and experience building scalable applications make me well-suited for this role.\n\nI would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application.\n\nSincerely,\n[Your Name]"
    })

# Healthcare examples
for i in range(8):
    training_data.append({
        "resume": {
            "summary": f"Compassionate registered nurse with {2+i} years of experience in medical-surgical nursing. Dedicated to providing high-quality patient care and ensuring patient safety.",
            "experience": [
                {
                    "position": "Registered Nurse",
                    "company": f"Healthcare Facility {i+1}",
                    "description": f"Provided direct patient care in medical-surgical unit. Administered medications, monitored patient conditions, and collaborated with healthcare team. {'Mentored new nurses and participated in quality improvement initiatives.' if i >= 4 else 'Maintained accurate patient records.'}"
                }
            ],
            "skills": ["Patient Care", "Medication Administration", "Clinical Documentation", "BLS Certification", "IV Therapy", "Patient Assessment"]
        },
        "job_description": "Join our nursing team. We are seeking a compassionate and skilled Registered Nurse to provide high-quality patient care in our medical-surgical unit. Requirements: Current RN license in North Carolina, BLS certification required, 2+ years of nursing experience preferred, strong communication and teamwork skills, ability to work in fast-paced environment.",
        "cover_letter": f"Dear Hiring Manager,\n\nI am writing to express my interest in the Registered Nurse position. With {2+i} years of experience in medical-surgical nursing, I am excited about the opportunity to contribute to your team's mission of providing high-quality patient care.\n\nIn my current role, I have provided direct patient care in the medical-surgical unit, administering medications, monitoring patient conditions, and collaborating effectively with the healthcare team. {'I have also mentored new nurses and participated in quality improvement initiatives.' if i >= 4 else 'I maintain accurate patient records and ensure compliance with healthcare protocols.'} My experience with patient care, medication administration, clinical documentation, BLS certification, IV therapy, and patient assessment aligns well with your requirements.\n\nI am particularly drawn to this position because of your commitment to compassionate care and patient safety. My strong clinical skills and dedication to providing excellent patient care make me well-suited for this role.\n\nI would welcome the opportunity to discuss how my background and passion for nursing can contribute to your team. Thank you for considering my application.\n\nSincerely,\n[Your Name]"
    })

# Education examples
for i in range(7):
    training_data.append({
        "resume": {
            "summary": f"Passionate elementary school teacher with {1+i} years of experience. Dedicated to student success and creating engaging, inclusive learning environments.",
            "experience": [
                {
                    "position": "Elementary School Teacher",
                    "company": f"School District {i+1}",
                    "description": f"Planned and delivered engaging lessons for elementary students. Assessed student progress and collaborated with parents and colleagues. {'Led after-school programs and participated in curriculum development.' if i >= 3 else 'Differentiated instruction to meet diverse learning needs.'}"
                }
            ],
            "skills": ["Lesson Planning", "Classroom Management", "Student Assessment", "Differentiated Instruction", "Parent Communication", "Technology Integration"]
        },
        "job_description": "We are looking for a dedicated Elementary School Teacher to join our team. The ideal candidate will have a passion for education and a commitment to student success. Requirements: Bachelor's degree in Education, North Carolina teaching license, experience with elementary-aged children, strong classroom management skills, ability to differentiate instruction.",
        "cover_letter": f"Dear Hiring Manager,\n\nI am writing to express my interest in the Elementary School Teacher position. With {1+i} years of experience in elementary education and a passion for student success, I am excited about the opportunity to join your team.\n\nIn my current role, I have planned and delivered engaging lessons for elementary students, assessed student progress, and collaborated effectively with parents and colleagues. {'I have also led after-school programs and participated in curriculum development.' if i >= 3 else 'I differentiate instruction to meet diverse learning needs.'} My experience with lesson planning, classroom management, student assessment, differentiated instruction, parent communication, and technology integration aligns well with your requirements.\n\nI am particularly drawn to this position because of your commitment to student success and creating positive learning environments. My dedication to education and ability to create engaging learning experiences make me well-suited for this role.\n\nI would welcome the opportunity to discuss how my teaching experience and passion for education can contribute to your school community. Thank you for considering my application.\n\nSincerely,\n[Your Name]"
    })

# Save expanded training data
output_file = 'training/training_data.json'
os.makedirs('training', exist_ok=True)

with open(output_file, 'w') as f:
    json.dump({"training_data": training_data}, f, indent=2)

print(f"✅ Created {len(training_data)} training examples")
print(f"📁 Saved to {output_file}")
print(f"\n📊 Breakdown:")
print(f"   - Software Developer: 10 examples")
print(f"   - Healthcare/RN: 8 examples")
print(f"   - Education: 7 examples")
print(f"   - Total: {len(training_data)} examples")

