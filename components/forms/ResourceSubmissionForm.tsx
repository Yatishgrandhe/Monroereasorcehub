'use client';

import { useState, useEffect } from 'react';
import { Upload, MapPin, Phone, Mail, Globe, Clock, Users, FileText, CheckCircle, AlertCircle, LayoutGrid, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDate, cn } from '@/lib/utils';

interface FormData {
  // Basic Information
  name: string;
  description: string;
  category: string;
  website: string;
  email: string;
  phone: string;
  address: string;

  // Services and Population
  services_offered: string[];
  population_served: string[];

  // Hours of Operation
  hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };

  // Additional Information
  additional_info: string;
  contact_person: string;
  contact_title: string;

  // Files
  files: File[];
}

const initialFormData: FormData = {
  name: '',
  description: '',
  category: '',
  website: '',
  email: '',
  phone: '',
  address: '',
  services_offered: [],
  population_served: [],
  hours: {
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '17:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: false }
  },
  additional_info: '',
  contact_person: '',
  contact_title: '',
  files: []
};

const categories = [
  'Healthcare',
  'Education',
  'Food Assistance',
  'Housing',
  'Employment',
  'Mental Health',
  'Legal Services',
  'Transportation',
  'Childcare',
  'Senior Services',
  'Government Services',
  'Recreation',
  'Animal Services',
  'Social Services',
  'Veterans Services',
  'Emergency Services'
];

const commonServices = [
  'Emergency Services',
  'Counseling',
  'Education Programs',
  'Food Distribution',
  'Housing Assistance',
  'Job Training',
  'Legal Aid',
  'Medical Care',
  'Mental Health Services',
  'Transportation',
  'Childcare',
  'Senior Programs',
  'Veteran Services',
  'Volunteer Opportunities',
  'Community Events',
  'Recreational Activities'
];

const populationOptions = [
  'All Ages',
  'Children',
  'Teens',
  'Adults',
  'Seniors',
  'Families',
  'Veterans',
  'Disabled',
  'Low Income',
  'Homeless',
  'Immigrants',
  'LGBTQ+',
  'Women',
  'Men'
];

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

export function ResourceSubmissionForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedResourceId, setSubmittedResourceId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [categoriesData, setCategoriesData] = useState<{ id: string; name: string }[]>([]);

  const steps = [
    { id: 1, name: 'Tell us about it', icon: FileText },
    { id: 2, name: 'Who do they help?', icon: Users },
    { id: 3, name: 'How to reach them', icon: Clock },
    { id: 4, name: 'Review & Share', icon: CheckCircle }
  ];

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');

        if (data) {
          setCategoriesData(data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateHours = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day as keyof typeof prev.hours],
          [field]: value
        }
      }
    }));
  };

  const addService = (service: string) => {
    if (!formData.services_offered.includes(service)) {
      updateFormData('services_offered', [...formData.services_offered, service]);
    }
  };

  const removeService = (service: string) => {
    updateFormData('services_offered', formData.services_offered.filter(s => s !== service));
  };

  const addPopulation = (population: string) => {
    if (!formData.population_served.includes(population)) {
      updateFormData('population_served', [...formData.population_served, population]);
    }
  };

  const removePopulation = (population: string) => {
    updateFormData('population_served', formData.population_served.filter(p => p !== population));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateFormData('files', [...formData.files, ...files]);
  };

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    updateFormData('files', newFiles);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.description && formData.category);
      case 2:
        return formData.services_offered.length > 0 && formData.population_served.length > 0;
      case 3:
        return !!(formData.email || formData.phone);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // Find category ID
      const category = categoriesData.find(cat => cat.name === formData.category);
      if (!category) {
        throw new Error('Invalid category selected');
      }

      const contactInfo =
        formData.email || formData.phone || formData.address
          ? {
            ...(formData.email && { email: formData.email }),
            ...(formData.phone && { phone: formData.phone }),
            ...(formData.address && { address: formData.address }),
          }
          : null;

      const submissionData = {
        name: formData.name,
        description: formData.description,
        category_id: category.id,
        website: formData.website || null,
        address: formData.address || null,
        contact_info: contactInfo,
        services_offered: formData.services_offered.length ? formData.services_offered : null,
        population_served: formData.population_served.length ? formData.population_served : null,
        hours_of_operation: formData.hours,
        is_approved: true, // Show on resources page immediately so share + resources page work together
      };

      const { data: inserted, error } = await supabase
        .from('resources')
        .insert(submissionData)
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      if (inserted?.id) {
        setSubmittedResourceId(inserted.id);
      }

      // Handle file uploads if any
      if (formData.files.length > 0) {
        // TODO: Implement file upload to Supabase Storage
        console.log('Files to upload:', formData.files);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContentWrapper = () => {
    return renderStepContent(
      currentStep,
      formData,
      updateFormData,
      updateHours,
      addService,
      removeService,
      addPopulation,
      removePopulation,
      removeFile,
      categoriesData
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-custom section-padding pt-32">
          <div className="max-w-2xl mx-auto bg-white border border-emerald-100 rounded-[3rem] shadow-soft overflow-hidden">
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm border border-emerald-100">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h1 className="text-4xl font-bold text-primary-950 mb-6 tracking-tight font-serif">
                Resource <span className="text-emerald-600">Captured</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
                Your resource has been added and is now visible on the resources page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {submittedResourceId && (
                  <Button asChild href={`/resources/${submittedResourceId}`} className="h-14 px-10 rounded-2xl font-bold bg-primary-950 text-white hover:bg-primary-900">
                    <span className="flex items-center">
                      <LayoutGrid className="mr-2 h-5 w-5" />
                      View your resource
                    </span>
                  </Button>
                )}
                <Button asChild href="/resources" variant="outline" className="h-14 px-10 rounded-2xl font-bold border-primary-100 text-primary-700">
                  <span>Browse all resources</span>
                </Button>
                <Button asChild href="/" variant="outline" className="h-14 px-10 rounded-2xl border-gray-100 text-gray-400 hover:bg-gray-50 font-bold">
                  <span>Return home</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="container-custom section-padding relative z-10">
        <div className="mb-16">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Growth & Registration
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-primary-950 tracking-tighter leading-none italic mb-4">
                Share Resource<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-gray-500 max-w-3xl leading-relaxed italic font-medium">
                Help us expand the Monroe Resource Hub archive. Every entry empowers your neighbors to find the support they need.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-soft">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-primary-950 text-sm font-bold uppercase tracking-widest">Progress</h3>
                <p className="text-gray-400 font-bold text-[10px] uppercase mt-1">
                  Stage {currentStep} OF {steps.length}
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {steps.map((step) => {
                    const IconComponent = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                          isActive
                            ? "bg-primary-950 text-white shadow-xl shadow-primary-950/20 font-bold scale-[1.02]"
                            : isCompleted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "text-gray-400 border border-transparent"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          isActive ? "bg-white/20" : isCompleted ? "bg-white shadow-sm" : "bg-gray-100"
                        )}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-tight">{step.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-soft relative">
              <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-primary-950 tracking-tight font-serif uppercase mb-1">{steps[currentStep - 1]?.name}</h2>
                    <p className="text-gray-400 font-bold tracking-widest text-[10px] uppercase">
                      Operational Module {currentStep} OF {steps.length}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="h-12 rounded-xl text-gray-500 font-bold"
                      >
                        Back
                      </Button>
                    )}
                    {currentStep < steps.length ? (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!validateStep(currentStep)}
                        className="h-12 rounded-xl px-10 shadow-lg shadow-primary-950/10 font-bold bg-primary-950 hover:bg-black text-white"
                      >
                        Proceed
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!validateStep(currentStep)}
                        className="h-12 rounded-xl px-10 shadow-lg shadow-emerald-900/10 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Submit resource
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContentWrapper()}
                  </motion.div>
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm"
                  >
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </motion.div>
                )}
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Update the renderStepContent helper to use the white theme
const renderStepContent = (currentStep: number, formData: FormData, updateFormData: any, updateHours: any, addService: any, removeService: any, addPopulation: any, removePopulation: any, removeFile: any, categoriesData: any) => {
  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Organization Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="What's the name of the organization?"
                className="h-14 bg-gray-50 border-gray-100 rounded-2xl px-6 focus:ring-primary-950/10 focus:border-primary-950 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mission Description *</label>
              <textarea
                className="w-full min-h-[160px] p-6 text-base bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-primary-950/10 focus:border-primary-950 outline-none transition-all font-medium text-primary-950 resize-none"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Tell us a bit about what they do and how they help the community..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Resource Category *</label>
                <select
                  className="w-full h-14 px-6 text-base bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-950/10 focus:border-primary-950 outline-none transition-all font-bold text-primary-950 appearance-none"
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value)}
                  required
                >
                  <option value="">What kind of resource is this?</option>
                  {categoriesData.map((category: any) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Official Website</label>
                <div className="relative">
                  <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://www.example.com"
                    className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary-950/10 focus:border-primary-950 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-primary-950 uppercase tracking-widest ml-1 px-4 py-1.5 bg-primary-50 rounded-full inline-block">Service Capabilities</h3>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                {formData.services_offered.length === 0 && <span className="text-xs text-gray-400 p-2 italic">Select services below or add custom ones...</span>}
                {formData.services_offered.map((service, index) => (
                  <Badge key={index} variant="secondary" className="bg-white border-gray-100 text-primary-950 py-1.5 px-4 rounded-xl shadow-sm group">
                    {service}
                    <button type="button" onClick={() => removeService(service)} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonServices.map(service => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => addService(service)}
                    disabled={formData.services_offered.includes(service)}
                    className="text-left px-4 py-3 text-xs font-bold border border-gray-100 rounded-xl hover:bg-primary-50 hover:border-primary-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:opacity-50 transition-all"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-primary-950 uppercase tracking-widest ml-1 px-4 py-1.5 bg-primary-50 rounded-full inline-block">Impact Population</h3>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                {formData.population_served.map((population, index) => (
                  <Badge key={index} variant="secondary" className="bg-white border-gray-100 text-primary-950 py-1.5 px-4 rounded-xl shadow-sm group">
                    {population}
                    <button type="button" onClick={() => removePopulation(population)} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {populationOptions.map(population => (
                  <button
                    key={population}
                    type="button"
                    onClick={() => addPopulation(population)}
                    disabled={formData.population_served.includes(population)}
                    className="text-left px-4 py-3 text-xs font-bold border border-gray-100 rounded-xl hover:bg-primary-50 hover:border-primary-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:opacity-50 transition-all"
                  >
                    {population}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="contact@organization.com"
                  className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary-950/10 focus:border-primary-950 font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="(704) 123-4567"
                  className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary-950/10 focus:border-primary-950 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Physical Location</label>
            <div className="relative">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="123 Main Street, Monroe, NC 28112"
                className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary-950/10 focus:border-primary-950 font-medium"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-primary-950 uppercase tracking-widest ml-1 px-4 py-1.5 bg-primary-50 rounded-full inline-block">Hours of Operation</h3>
            <div className="space-y-3 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
              {daysOfWeek.map(day => (
                <div key={day.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-24 text-xs font-bold text-primary-950 uppercase tracking-tight">{day.label}</div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hours[day.key as keyof typeof formData.hours].closed}
                        onChange={(e) => updateHours(day.key, 'closed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-200 text-primary-950 focus:ring-primary-950/10"
                      />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Closed</span>
                    </label>
                    {!formData.hours[day.key as keyof typeof formData.hours].closed && (
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          value={formData.hours[day.key as keyof typeof formData.hours].open}
                          onChange={(e) => updateHours(day.key, 'open', e.target.value)}
                          className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary-950/10 shadow-sm"
                        />
                        <span className="text-[10px] font-bold text-gray-300 uppercase">to</span>
                        <input
                          type="time"
                          value={formData.hours[day.key as keyof typeof formData.hours].close}
                          onChange={(e) => updateHours(day.key, 'close', e.target.value)}
                          className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary-950/10 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Basics</h4>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Name</div>
                  <div className="text-sm font-bold text-primary-950">{formData.name}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</div>
                  <div className="text-sm font-bold text-primary-950">{formData.category}</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact</h4>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email / Phone</div>
                  <div className="text-sm font-bold text-primary-950">{formData.email || 'N/A'} • {formData.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Address</div>
                  <div className="text-sm font-bold text-primary-950">{formData.address || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 p-8 rounded-[2.5rem] border border-primary-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-primary-100 shrink-0">
                <AlertCircle className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-primary-950 mb-2 font-serif">Submission Integrity</h4>
                <p className="text-sm text-primary-800 leading-relaxed font-medium">
                  By submitting this mission, you confirm that the organization details provided are accurate to the best of your knowledge. Your resource will appear on the hub immediately after submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
  }
};
