'use client';

import { useState } from 'react';
import { MessageCircle, Sparkles, X, Lightbulb, TrendingUp, Target, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { analyzeResumeQuality, analyzeJobMatch, suggestContentImprovements } from '@/lib/ai/resume-optimizer';
import type { ResumeData } from '@/lib/ai/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    const qualityAnalysis = analyzeResumeQuality(resumeData, targetJob);
    let matchAnalysis = null;
    if (jobDescription) {
      matchAnalysis = analyzeJobMatch(resumeData, jobDescription);
    }
    const improvements = suggestContentImprovements(resumeData, targetJob);
    setAnalysis({
      quality: qualityAnalysis,
      match: matchAnalysis,
      improvements
    });
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              variant="gradient"
              onClick={() => {
                setIsOpen(true);
                if (!analysis) runAnalysis();
              }}
              className="h-14 w-14 rounded-full shadow-2xl shadow-primary-500/40 p-0 flex items-center justify-center group"
            >
              <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-[400px] z-50"
          >
            <Card className="glass-card border-white/10 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                    <Sparkles className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold leading-none mb-1">AI Assistant</h3>
                    <Badge variant="glass" size="sm" className="bg-primary-500/10 border-primary-500/20 text-primary-400 text-[10px]">PREMIUM INSIGHTS</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <CardContent className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-900/40">
                {loading ? (
                  <div className="py-12 flex flex-col items-center">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin" />
                      <Sparkles className="h-5 w-5 text-primary-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <p className="mt-4 text-slate-400 font-medium">Analyzing architecture...</p>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    {/* Score Wheel Mockup */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Score</div>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - analysis.quality.overallScore / 100)} className="text-primary-500 transition-all duration-1000" />
                        </svg>
                        <span className="absolute text-2xl font-black text-white">{analysis.quality.overallScore}</span>
                      </div>
                    </div>

                    {/* Suggestions Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-primary-400" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Improvements</h4>
                      </div>
                      {analysis.quality.suggestions.slice(0, 3).map((sug: string, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-3 group hover:border-primary-500/30 transition-colors">
                          <div className="h-6 w-6 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 border border-primary-500/20">
                            <span className="text-[10px] font-bold text-primary-400">{i + 1}</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{sug}</p>
                        </div>
                      ))}
                    </div>

                    {/* Job Match if available */}
                    {analysis.match && (
                      <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl p-5 border border-primary-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Target Match</h4>
                          <span className="text-xl font-black text-primary-400">{analysis.match.matchPercentage}%</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.match.missingSkills.slice(0, 4).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="glass" className="bg-white/5 border-white/10 text-[10px]">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="h-16 w-16 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-8 w-8 text-primary-400" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">Ready to Optimize?</h4>
                    <p className="text-slate-400 text-sm mb-8 px-8">Get enterprise-grade feedback on your resume using our advanced AI analysis engine.</p>
                    <Button variant="gradient" className="w-full rounded-2xl" onClick={runAnalysis}>
                      Run Deep Analysis
                    </Button>
                  </div>
                )}
              </CardContent>

              <div className="p-4 bg-white/5 border-t border-white/5">
                <Button variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white rounded-xl" onClick={runAnalysis}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Recalculate Insights
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
