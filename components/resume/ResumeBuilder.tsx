'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Sparkles, User, Briefcase, GraduationCap, Award, Globe, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResumePreview } from './ResumePreview';
import { TemplateSelector } from './TemplateSelector';
import { supabase } from '@/lib/supabase/client';
import { generateSummaryAction, enhanceBulletPointAction, suggestSkillsAction } from '@/app/actions/ai';
import { generateId } from '@/lib/utils';
import { exportResumeToPDF } from '@/lib/utils/pdf-export';
import type { ResumeData } from '@/lib/ai/gemini';

const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: []
};

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Summary', icon: Briefcase },
    { id: 3, name: 'Experience', icon: Briefcase },
    { id: 4, name: 'Education', icon: GraduationCap },
    { id: 5, name: 'Skills', icon: Award },
    { id: 6, name: 'Preview', icon: Globe }
  ];

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const generateSummary = async () => {
    if (resumeData.experience.length === 0) {
      alert('Please add at least one work experience before generating a summary.');
      return;
    }

    setAiLoading(true);
    try {
      const result = await generateSummaryAction(resumeData.experience);
      if (result.success && result.summary) {
        setResumeData(prev => ({ ...prev, summary: result.summary }));
      } else {
        alert('Failed to generate summary. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while generating the summary.');
    } finally {
      setAiLoading(false);
    }
  };

  const enhanceBulletPoint = async (experienceId: string, achievementIndex: number) => {
    const experience = resumeData.experience.find(exp => exp.id === experienceId);
    if (!experience || !experience.achievements[achievementIndex]) return;

    setAiLoading(true);
    try {
      const result = await enhanceBulletPointAction(
        experience.achievements[achievementIndex],
        `${experience.position} at ${experience.company}`
      );
      if (result.success && result.enhanced) {
        const updatedAchievements = [...experience.achievements];
        updatedAchievements[achievementIndex] = result.enhanced;
        updateExperience(experienceId, 'achievements', updatedAchievements);
      }
    } catch (error) {
      alert('An error occurred while enhancing the bullet point.');
    } finally {
      setAiLoading(false);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be signed in to save your resume.');
        return;
      }

      const { error } = await supabase
        .from('resumes')
        .upsert({
          user_id: user.id,
          resume_data: resumeData,
          title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} - Resume`,
          updated_at: new Date().toISOString()
        });

      if (error) {
        alert('Failed to save resume. Please try again.');
      } else {
        alert('Resume saved successfully!');
      }
    } catch (error) {
      alert('An error occurred while saving the resume.');
    } finally {
      setSaving(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      await exportResumeToPDF(resumeData, selectedTemplate);
      alert('Resume exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={resumeData.personalInfo.firstName}
                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                placeholder="John"
              />
              <Input
                label="Last Name"
                value={resumeData.personalInfo.lastName}
                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                placeholder="Doe"
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john.doe@email.com"
            />
            <Input
              label="Phone"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="(704) 123-4567"
            />
            <Input
              label="Address"
              value={resumeData.personalInfo.address}
              onChange={(e) => updatePersonalInfo('address', e.target.value)}
              placeholder="Monroe, NC 28112"
            />
            <Input
              label="LinkedIn (Optional)"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
            <Input
              label="Website (Optional)"
              value={resumeData.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="https://johndoe.com"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Professional Summary</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateSummary}
                loading={aiLoading}
                disabled={resumeData.experience.length === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </div>
            <textarea
              className="textarea"
              rows={6}
              value={resumeData.summary}
              onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            {resumeData.experience.map((exp, index) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Job Title"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Software Engineer"
                    />
                    <Input
                      label="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Tech Company Inc."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Start Date"
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    />
                    <Input
                      label="End Date"
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                    />
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-sm text-secondary-700">
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Job Description
                    </label>
                    <textarea
                      className="textarea"
                      rows={3}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Brief description of your role and responsibilities..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Key Achievements
                    </label>
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex gap-2 mb-2">
                        <textarea
                          className="textarea flex-1"
                          rows={2}
                          value={achievement}
                          onChange={(e) => {
                            const updated = [...exp.achievements];
                            updated[achIndex] = e.target.value;
                            updateExperience(exp.id, 'achievements', updated);
                          }}
                          placeholder="Describe a key achievement or responsibility..."
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => enhanceBulletPoint(exp.id, achIndex)}
                          loading={aiLoading}
                          disabled={!achievement.trim()}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = [...exp.achievements, ''];
                        updateExperience(exp.id, 'achievements', updated);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            {resumeData.education.map((edu, index) => (
              <Card key={edu.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Education {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="University of North Carolina"
                    />
                    <Input
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <Input
                    label="Field of Study"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Start Date"
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    />
                    <Input
                      label="End Date"
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    />
                    <Input
                      label="GPA (Optional)"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Skills</h3>
              <Button variant="outline" size="sm" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
            
            <div className="space-y-3">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder="e.g., JavaScript, Project Management, Public Speaking"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Resume Preview</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={saveResume} loading={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Resume
                </Button>
                <Button variant="primary" size="sm" onClick={exportToPDF} loading={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
            <ResumePreview resumeData={resumeData} template={selectedTemplate} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <h1 className="title-section mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl font-sans">
            Create a professional resume with the help of AI. Our intelligent assistant will help you craft compelling summaries, enhance bullet points, and suggest relevant skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>
                  Complete each step to build your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {steps.map((step) => {
                    const IconComponent = step.icon;
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          currentStep === step.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-secondary-100 text-secondary-700'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{step.name}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {currentStep === 6 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Template</CardTitle>
                  <CardDescription>
                    Choose a resume template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{steps[currentStep - 1]?.name}</CardTitle>
                    <CardDescription>
                      Step {currentStep} of {steps.length}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < steps.length && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
