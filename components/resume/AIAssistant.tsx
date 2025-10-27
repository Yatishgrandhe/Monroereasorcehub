'use client';

import { useState } from 'react';
import { MessageCircle, Sparkles, X, Lightbulb, TrendingUp, Target, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { analyzeResumeQuality, analyzeJobMatch, suggestContentImprovements } from '@/lib/ai/resume-optimizer';
import type { ResumeData } from '@/lib/ai/gemini';

interface AIAssistantProps {
  resumeData: ResumeData;
  targetJob?: string;
  jobDescription?: string;
}

export function AIAssistant({ resumeData, targetJob, jobDescription }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = () => {
    setLoading(true);
    
    // Run resume quality analysis
    const qualityAnalysis = analyzeResumeQuality(resumeData, targetJob);
    
    // Run job match analysis if job description provided
    let matchAnalysis = null;
    if (jobDescription) {
      matchAnalysis = analyzeJobMatch(resumeData, jobDescription);
    }
    
    // Get content improvement suggestions
    const improvements = suggestContentImprovements(resumeData, targetJob);
    
    setAnalysis({
      quality: qualityAnalysis,
      match: matchAnalysis,
      improvements
    });
    
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="gradient"
        size="sm"
        onClick={() => {
          setIsOpen(true);
          if (!analysis) runAnalysis();
        }}
        className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full"
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        AI Assistant
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 max-h-[600px] overflow-y-auto z-50 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <Badge variant="primary" size="sm">Beta</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin text-primary-600" />
            <p className="text-secondary-600">Analyzing your resume...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-primary-900">Overall Resume Score</h4>
                <Badge variant={analysis.quality.overallScore >= 80 ? 'success' : analysis.quality.overallScore >= 60 ? 'warning' : 'error'}>
                  {analysis.quality.overallScore}/100
                </Badge>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${analysis.quality.overallScore}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            {analysis.quality.strengths.length > 0 && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-4 w-4 text-success-700 mr-2" />
                  <h4 className="font-semibold text-success-900 text-sm">Strengths</h4>
                </div>
                <ul className="space-y-1">
                  {analysis.quality.strengths.map((strength: string, index: number) => (
                    <li key={index} className="text-xs text-success-800">✓ {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {analysis.quality.weaknesses.length > 0 && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 text-error-700 mr-2" />
                  <h4 className="font-semibold text-error-900 text-sm">Areas to Improve</h4>
                </div>
                <ul className="space-y-1">
                  {analysis.quality.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="text-xs text-error-800">⚠ {weakness}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.quality.suggestions.length > 0 && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 text-primary-700 mr-2" />
                  <h4 className="font-semibold text-primary-900 text-sm">AI Suggestions</h4>
                </div>
                <ul className="space-y-1">
                  {analysis.quality.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="text-xs text-primary-800">💡 {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job Match Analysis */}
            {analysis.match && (
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-900 text-sm">Job Match</h4>
                  <Badge variant={analysis.match.matchPercentage >= 70 ? 'success' : analysis.match.matchPercentage >= 50 ? 'warning' : 'error'}>
                    {analysis.match.matchPercentage}% Match
                  </Badge>
                </div>
                
                {analysis.match.missingSkills.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-purple-800 mb-1">Missing Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.match.missingSkills.slice(0, 3).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysis.match.recommendations.length > 0 && (
                  <ul className="space-y-1">
                    {analysis.match.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-xs text-purple-800">→ {rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* ATS Optimization */}
            {analysis.quality.atsOptimization.length > 0 && (
              <div className="bg-secondary-100 border border-secondary-300 rounded-lg p-3">
                <h4 className="font-semibold text-secondary-900 text-sm mb-2">📄 ATS Optimization</h4>
                <ul className="space-y-1">
                  {analysis.quality.atsOptimization.map((tip: string, index: number) => (
                    <li key={index} className="text-xs text-secondary-700">• {tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={runAnalysis}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary-600" />
            <p className="text-secondary-600 text-sm mb-4">
              Get AI-powered insights to improve your resume
            </p>
            <Button variant="primary" size="sm" onClick={runAnalysis}>
              Analyze Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

