'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { ResumeData } from '@/lib/ai/gemini';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
}

export function ResumePreview({ resumeData, template }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  const renderModernTemplate = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-secondary-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} className="text-primary-600 hover:text-primary-700">
              LinkedIn
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} className="text-primary-600 hover:text-primary-700">
              Website
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-3 border-b-2 border-primary-600 pb-1">
            Professional Summary
          </h2>
          <p className="text-secondary-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 border-b-2 border-primary-600 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">{exp.position}</h3>
                    <p className="text-primary-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-secondary-600">
                    <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-secondary-700 mb-3">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-secondary-700 space-y-1">
                    {exp.achievements.filter(ach => ach.trim()).map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 border-b-2 border-primary-600 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-primary-600 font-medium">{edu.institution}</p>
                  {edu.gpa && <p className="text-secondary-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-right text-secondary-600">
                  <p>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 border-b-2 border-primary-600 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.filter(skill => skill.trim()).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-secondary-300 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-secondary-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-secondary-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-3 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-primary-600 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-secondary-900">{exp.position}</h3>
                  <span className="text-secondary-600 text-sm">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-primary-600 font-medium mb-2">{exp.company}</p>
                {exp.description && (
                  <p className="text-secondary-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-secondary-700 space-y-1">
                    {exp.achievements.filter(ach => ach.trim()).map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index} className="border-l-4 border-primary-600 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-primary-600 font-medium">{edu.institution}</p>
                    {edu.gpa && <p className="text-secondary-600">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-secondary-600 text-sm">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-secondary-900 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.filter(skill => skill.trim()).map((skill, index) => (
              <div key={index} className="text-secondary-700">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-secondary-100 p-6 rounded-lg">
      <div className="max-h-[800px] overflow-y-auto">
        {template === 'modern' ? renderModernTemplate() : renderClassicTemplate()}
      </div>
    </div>
  );
}
