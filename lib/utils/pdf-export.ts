import jsPDF from 'jspdf';
import type { ResumeData } from '@/lib/ai/gemini';

export async function exportResumeToPDF(resumeData: ResumeData, template: string = 'modern'): Promise<void> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Helper to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    // Helper to add title
    const addTitle = (text: string, fontSize: number = 14) => {
      checkPageBreak(10);
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'bold');
      doc.text(text, margin, yPos);
      yPos += 8;
    };

    // Helper to add text
    const addText = (text: string, fontSize: number = 10) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
      lines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin, yPos);
        yPos += 6;
      });
    };

    // Helper to add bullet list
    const addBulletList = (items: string[]) => {
      items.forEach(item => {
        checkPageBreak(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('• ' + item, margin + 5, yPos);
        const lines = doc.splitTextToSize(item, pageWidth - (margin * 2) - 10);
        yPos += lines.length * 6;
      });
    };

    // Header
    const { firstName, lastName, email, phone, address, linkedin, website } = resumeData.personalInfo;
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${firstName} ${lastName}`, margin, yPos);
    yPos += 10;

    // Contact info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [email, phone, address].filter(Boolean).join(' | ');
    doc.text(contactInfo, margin, yPos);
    yPos += 5;

    if (linkedin || website) {
      const links = [linkedin, website].filter(Boolean).join(' | ');
      doc.text(links, margin, yPos);
      yPos += 5;
    }

    yPos += 5;

    // Professional Summary
    if (resumeData.summary) {
      addTitle('PROFESSIONAL SUMMARY');
      addText(resumeData.summary);
      yPos += 5;
    }

    // Professional Experience
    if (resumeData.experience.length > 0) {
      addTitle('PROFESSIONAL EXPERIENCE');
      
      resumeData.experience.forEach((exp, index) => {
        checkPageBreak(20);
        yPos += 5;

        // Position and Company
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.position, margin, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.company, margin + 2, yPos);
        
        // Dates
        const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
        doc.setFont('helvetica', 'normal');
        doc.text(dateText, pageWidth - margin - 30, yPos);
        yPos += 6;

        // Description
        if (exp.description) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          const descLines = doc.splitTextToSize(exp.description, pageWidth - (margin * 2));
          descLines.forEach((line: string) => {
            checkPageBreak(6);
            doc.text(line, margin + 2, yPos);
            yPos += 6;
          });
        }

        // Achievements
        if (exp.achievements && exp.achievements.length > 0) {
          yPos += 2;
          exp.achievements.filter(ach => ach.trim()).forEach(achievement => {
            checkPageBreak(6);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const achievementLines = doc.splitTextToSize(achievement, pageWidth - (margin * 2) - 5);
            doc.text('• ' + achievementLines[0], margin + 2, yPos);
            yPos += 6;
            
            // Handle wrapped lines
            for (let i = 1; i < achievementLines.length; i++) {
              checkPageBreak(6);
              doc.text(achievementLines[i], margin + 5, yPos);
              yPos += 6;
            }
          });
        }

        yPos += 3;
      });
    }

    // Education
    if (resumeData.education.length > 0) {
      yPos += 5;
      addTitle('EDUCATION');
      
      resumeData.education.forEach(edu => {
        checkPageBreak(15);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${edu.degree} in ${edu.field}`, margin, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(edu.institution, margin + 2, yPos);
        yPos += 5;

        const dateText = `${edu.startDate} - ${edu.endDate}`;
        doc.text(dateText, margin + 2, yPos);
        
        if (edu.gpa) {
          yPos += 5;
          doc.text(`GPA: ${edu.gpa}`, margin + 2, yPos);
        }
        
        yPos += 5;
      });
    }

    // Skills
    if (resumeData.skills.length > 0) {
      yPos += 5;
      addTitle('SKILLS');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const skillsText = resumeData.skills.filter(skill => skill.trim()).join(', ');
      const skillsLines = doc.splitTextToSize(skillsText, pageWidth - (margin * 2));
      skillsLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin, yPos);
        yPos += 6;
      });
    }

    // Save the PDF
    const fileName = `${firstName}_${lastName}_Resume_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Failed to export PDF');
  }
}

