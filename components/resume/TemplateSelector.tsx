'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
    <div className="space-y-3">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onTemplateChange(template.id)}
          className={`cursor-pointer transition-all duration-200 ${
            selectedTemplate === template.id
              ? 'ring-2 ring-primary-500 ring-offset-2'
              : 'hover:shadow-md'
          }`}
        >
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-secondary-900">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <Badge variant="primary" size="sm">Selected</Badge>
                  )}
                </div>
                <p className="text-sm text-secondary-600 mb-2">{template.description}</p>
                <p className="text-xs text-secondary-500">{template.preview}</p>
              </div>
              <div className="ml-4">
                <div className={`w-16 h-20 border-2 rounded ${
                  selectedTemplate === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-300 bg-white'
                }`}>
                  {/* Template preview placeholder */}
                  <div className="p-2 h-full flex flex-col">
                    <div className="h-2 bg-secondary-300 rounded mb-1"></div>
                    <div className="h-1 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-1 bg-secondary-200 rounded mb-1"></div>
                    <div className="h-1 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-1 bg-secondary-200 rounded mb-1"></div>
                    <div className="h-1 bg-secondary-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
