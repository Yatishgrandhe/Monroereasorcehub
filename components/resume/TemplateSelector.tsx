'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with bold headers and organized sections',
    preview: 'Modern layout with centered header and structured content blocks'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume format with left-aligned content and clear hierarchy',
    preview: 'Classic format with traditional styling and professional appearance'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching design perfect for creative and design roles',
    preview: 'Creative layout with unique styling and visual elements'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, clean design focusing on content over decoration',
    preview: 'Minimal design with clean lines and plenty of white space'
  }
];

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onTemplateChange(template.id)}
          className="cursor-pointer group"
        >
          <Card className={cn(
            "p-6 transition-all duration-300 border-white/10 overflow-hidden relative",
            selectedTemplate === template.id
              ? "bg-primary-500/10 border-primary-500/40 shadow-xl shadow-primary-500/10"
              : "bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
          )}>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-black text-white uppercase tracking-tighter text-lg">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <Badge variant="glass" className="bg-primary-500 text-white border-none font-black text-[10px] tracking-widest uppercase">Active</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-2 leading-relaxed">{template.description}</p>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">{template.preview}</p>
              </div>
              <div className="ml-6 shrink-0">
                <div className={cn(
                  "w-16 h-20 border-2 rounded-xl transition-all duration-500 group-hover:scale-110",
                  selectedTemplate === template.id
                    ? "border-primary-500 bg-primary-500/20"
                    : "border-white/10 bg-white/5"
                )}>
                  <div className="p-3 h-full flex flex-col justify-center">
                    <div className={cn("h-1.5 rounded mb-1", selectedTemplate === template.id ? "bg-primary-400" : "bg-slate-600")}></div>
                    <div className={cn("h-1 rounded mb-2 w-2/3", selectedTemplate === template.id ? "bg-primary-500/50" : "bg-slate-700")}></div>
                    <div className={cn("h-1 rounded mb-1", selectedTemplate === template.id ? "bg-primary-500/30" : "bg-slate-800")}></div>
                    <div className={cn("h-1 rounded mb-1", selectedTemplate === template.id ? "bg-primary-500/30" : "bg-slate-800")}></div>
                    <div className={cn("h-1 rounded mb-1", selectedTemplate === template.id ? "bg-primary-500/30" : "bg-slate-800")}></div>
                  </div>
                </div>
              </div>
            </div>
            {selectedTemplate === template.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}
