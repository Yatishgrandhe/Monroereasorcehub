'use client';

import { useState, useEffect } from 'react';
import { Upload, MapPin, Phone, Mail, Globe, Clock, Users, FileText, CheckCircle, AlertCircle, LayoutGrid, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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

      // Prepare submission data
      const submissionData = {
        name: formData.name,
        description: formData.description,
        category_id: category.id,
        website: formData.website || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        services_offered: formData.services_offered,
        population_served: formData.population_served,
        hours_of_operation: formData.hours,
        additional_info: formData.additional_info || null,
        contact_person: formData.contact_person || null,
        contact_title: formData.contact_title || null,
        is_approved: false, // Requires admin approval
        submitted_at: new Date().toISOString()
      };

      // Insert submission
      const { error } = await supabase
        .from('resources')
        .insert(submissionData);

      if (error) {
        throw error;
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">The Basics</h3>
              <div className="space-y-4">
                <Input
                  label="Organization Name *"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="What's the name of the organization?"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="textarea"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Tell us a bit about what they do and how they help the community..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    className="input"
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    required
                  >
                    <option value="">What kind of resource is this?</option>
                    {categoriesData.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://www.example.com"
                  icon={<Globe className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Services & People</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    What services do they offer? *
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.services_offered.map((service, index) => (
                        <Badge key={index} variant="primary" className="flex items-center gap-1">
                          {service}
                          <button
                            type="button"
                            onClick={() => removeService(service)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {commonServices.map(service => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => addService(service)}
                          disabled={formData.services_offered.includes(service)}
                          className="text-left p-2 text-sm border border-slate-600 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder="Type to add another service..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            addService(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Who is this for? *
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.population_served.map((population, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {population}
                          <button
                            type="button"
                            onClick={() => removePopulation(population)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {populationOptions.map(population => (
                        <button
                          key={population}
                          type="button"
                          onClick={() => addPopulation(population)}
                          disabled={formData.population_served.includes(population)}
                          className="text-left p-2 text-sm border border-slate-600 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {population}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Info & Hours</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="contact@organization.com"
                    icon={<Mail className="h-4 w-4" />}
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="(704) 123-4567"
                    icon={<Phone className="h-4 w-4" />}
                  />
                </div>

                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street, Monroe, NC 28112"
                  icon={<MapPin className="h-4 w-4" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Person (Optional)"
                    value={formData.contact_person}
                    onChange={(e) => updateFormData('contact_person', e.target.value)}
                    placeholder="Who should we ask for?"
                  />
                  <Input
                    label="Title (Optional)"
                    value={formData.contact_title}
                    onChange={(e) => updateFormData('contact_title', e.target.value)}
                    placeholder="e.g. Director"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    When are they open?
                  </label>
                  <div className="space-y-3">
                    {daysOfWeek.map(day => (
                      <div key={day.key} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-slate-300">
                          {day.label}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.hours[day.key as keyof typeof formData.hours].closed}
                            onChange={(e) => updateHours(day.key, 'closed', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-400">Closed</span>
                        </div>
                        {!formData.hours[day.key as keyof typeof formData.hours].closed && (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={formData.hours[day.key as keyof typeof formData.hours].open}
                              onChange={(e) => updateHours(day.key, 'open', e.target.value)}
                              className="input w-32"
                            />
                            <span className="text-slate-400">to</span>
                            <input
                              type="time"
                              value={formData.hours[day.key as keyof typeof formData.hours].close}
                              onChange={(e) => updateHours(day.key, 'close', e.target.value)}
                              className="input w-32"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Anything else we should know?
                  </label>
                  <textarea
                    className="textarea"
                    rows={4}
                    value={formData.additional_info}
                    onChange={(e) => updateFormData('additional_info', e.target.value)}
                    placeholder="Parking info, specific requirements, etc..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Does this look right?</h3>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>The Basics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Description:</strong> {formData.description}</p>
                    {formData.website && <p><strong>Website:</strong> {formData.website}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Services & People</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <strong>Services Offered:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.services_offered.map((service, index) => (
                          <Badge key={index} variant="outline" size="sm">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Who it's for:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.population_served.map((population, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {population}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
                    {formData.phone && <p><strong>Phone:</strong> {formData.phone}</p>}
                    {formData.address && <p><strong>Address:</strong> {formData.address}</p>}
                    {formData.contact_person && <p><strong>Contact Person:</strong> {formData.contact_person}</p>}
                    {formData.contact_title && <p><strong>Title:</strong> {formData.contact_title}</p>}
                  </CardContent>
                </Card>

                {formData.files.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Attached Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {formData.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                            <span className="text-sm">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary-900 mb-1">What happens next?</h4>
                      <p className="text-sm text-primary-800">
                        Our team will take a look at your submission to make sure everything is accurate.
                        We'll send you an email as soon as it's approved and live on the site!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
        <div className="container-custom section-padding pt-32">
          <Card className="max-w-2xl mx-auto glass-card border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/20">
                <CheckCircle className="h-12 w-12 text-emerald-400" />
              </div>
              <h1 className="text-4xl font-black text-white mb-6 tracking-tight uppercase">
                Resource <span className="text-emerald-400">Captured</span>
              </h1>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium">
                We've received your submission. Our team will review the details to ensure community standards are met before publishing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gradient" className="h-14 px-10 rounded-2xl font-bold" asChild href="/resources">
                  <span className="flex items-center">
                    <LayoutGrid className="mr-2 h-5 w-5" />
                    Browse Directory
                  </span>
                </Button>
                <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold" asChild href="/">
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
      <div className="container-custom section-padding">
        <div className="mb-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="glass" className="mb-6 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3.5 h-3.5 mr-2" /> Community Growth
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Share a <span className="text-gradient-logo">Resource</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
              Help us expand the Monroe Resource Hub. Every entry empowers your neighbors to find the support they need.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
              <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Progress</CardTitle>
                <CardDescription className="text-slate-500 font-bold">
                  Stage {currentStep} OF {steps.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
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
                            ? "bg-primary-500 text-white shadow-xl shadow-primary-500/20 font-black scale-[1.02] border border-primary-400/20"
                            : isCompleted
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "text-slate-500 border border-transparent"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          isActive ? "bg-white/20" : isCompleted ? "bg-emerald-500/20" : "bg-white/5"
                        )}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="text-sm tracking-tight">{step.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl">
              <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-3xl font-black text-white tracking-tight uppercase mb-1">{steps[currentStep - 1]?.name}</CardTitle>
                    <CardDescription className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">
                      Operational Module {currentStep} OF {steps.length}
                    </CardDescription>
                  </div>
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="h-12 rounded-xl border-white/10 text-white hover:bg-white/5"
                      >
                        Back
                      </Button>
                    )}
                    {currentStep < steps.length ? (
                      <Button
                        variant="gradient"
                        size="lg"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!validateStep(currentStep)}
                        className="h-12 rounded-xl px-10 shadow-lg shadow-primary-500/20"
                      >
                        Proceed
                      </Button>
                    ) : (
                      <Button
                        variant="gradient"
                        size="lg"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!validateStep(currentStep)}
                        className="h-12 rounded-xl px-10 shadow-lg shadow-primary-500/20"
                      >
                        Submit Mission
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10">
                {error && (
                  <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                    <div className="flex items-center gap-2 text-error-700">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Something went wrong</span>
                    </div>
                    <p className="mt-1 text-error-600">{error}</p>
                  </div>
                )}

                {renderStepContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
