import { createClient } from '@supabase/supabase-js';

// Create service client for seeding
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export const categories = [
  {
    name: 'Food Assistance',
    icon: '🍽️',
    description: 'Food banks, pantries, and meal programs'
  },
  {
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical services, clinics, and health programs'
  },
  {
    name: 'Education',
    icon: '📚',
    description: 'Schools, tutoring, and educational programs'
  },
  {
    name: 'Housing',
    icon: '🏠',
    description: 'Housing assistance, shelters, and rental help'
  },
  {
    name: 'Family Support',
    icon: '👨‍👩‍👧‍👦',
    description: 'Family services, childcare, and support programs'
  },
  {
    name: 'Senior Services',
    icon: '👴',
    description: 'Services for seniors and elderly care'
  },
  {
    name: 'Mental Health',
    icon: '🧠',
    description: 'Counseling, therapy, and mental health support'
  },
  {
    name: 'Legal Aid',
    icon: '⚖️',
    description: 'Legal assistance and advocacy services'
  },
  {
    name: 'Employment',
    icon: '💼',
    description: 'Job training, placement, and career services'
  },
  {
    name: 'Transportation',
    icon: '🚌',
    description: 'Public transit and transportation assistance'
  }
];

export const resources = [
  // Food Assistance
  {
    name: 'Monroe Community Food Pantry',
    description: 'Provides emergency food assistance to families in need. Open Monday through Friday with evening hours available.',
    category_id: '', // Will be set after categories are created
    contact_info: {
      phone: '(704) 283-5555',
      email: 'info@monroefoodpantry.org',
      address: '123 Main Street, Monroe, NC 28112'
    },
    website: 'https://monroefoodpantry.org',
    address: '123 Main Street, Monroe, NC 28112',
    services_offered: ['Emergency Food', 'Nutrition Education', 'Holiday Meals'],
    population_served: ['Families', 'Seniors', 'Children'],
    hours_of_operation: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: true,
    spotlight_story: 'Serving over 500 families monthly with fresh produce, canned goods, and essential items. Our dedicated volunteers work tirelessly to ensure no family goes hungry in Monroe.'
  },
  {
    name: 'Union County Meals on Wheels',
    description: 'Delivers nutritious meals to homebound seniors and individuals with disabilities.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-1234',
      email: 'volunteer@unionmealsonwheels.org',
      address: '456 Oak Avenue, Monroe, NC 28112'
    },
    website: 'https://unionmealsonwheels.org',
    address: '456 Oak Avenue, Monroe, NC 28112',
    services_offered: ['Meal Delivery', 'Nutrition Counseling', 'Wellness Checks'],
    population_served: ['Seniors', 'Disabled Adults'],
    hours_of_operation: {
      monday: { open: '08:00', close: '16:00' },
      tuesday: { open: '08:00', close: '16:00' },
      wednesday: { open: '08:00', close: '16:00' },
      thursday: { open: '08:00', close: '16:00' },
      friday: { open: '08:00', close: '16:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Healthcare
  {
    name: 'Atrium Health Union',
    description: 'Full-service hospital providing comprehensive medical care including emergency services, surgery, and specialized treatments.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-2000',
      email: 'info@atriumhealth.org',
      address: '600 Hospital Drive, Monroe, NC 28112'
    },
    website: 'https://atriumhealth.org/locations/atrium-health-union',
    address: '600 Hospital Drive, Monroe, NC 28112',
    services_offered: ['Emergency Care', 'Surgery', 'Maternity', 'Cardiology', 'Oncology'],
    population_served: ['All Ages', 'Families', 'Seniors'],
    hours_of_operation: {
      monday: { open: '00:00', close: '23:59' },
      tuesday: { open: '00:00', close: '23:59' },
      wednesday: { open: '00:00', close: '23:59' },
      thursday: { open: '00:00', close: '23:59' },
      friday: { open: '00:00', close: '23:59' },
      saturday: { open: '00:00', close: '23:59' },
      sunday: { open: '00:00', close: '23:59' }
    },
    is_approved: true,
    is_spotlighted: true,
    spotlight_story: 'Monroe\'s premier healthcare facility, serving the community with state-of-the-art medical technology and compassionate care. Our 24/7 emergency department ensures help is always available.'
  },
  {
    name: 'Monroe Community Health Center',
    description: 'Federally qualified health center providing primary care, dental, and behavioral health services on a sliding fee scale.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-3000',
      email: 'appointments@monroehealthcenter.org',
      address: '789 Health Way, Monroe, NC 28112'
    },
    website: 'https://monroehealthcenter.org',
    address: '789 Health Way, Monroe, NC 28112',
    services_offered: ['Primary Care', 'Dental Services', 'Behavioral Health', 'Pharmacy'],
    population_served: ['All Ages', 'Low Income', 'Uninsured'],
    hours_of_operation: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Education
  {
    name: 'Union County Public Schools',
    description: 'Public school system serving Monroe and surrounding areas with comprehensive K-12 education programs.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-4000',
      email: 'info@ucps.k12.nc.us',
      address: '400 N. Church Street, Monroe, NC 28112'
    },
    website: 'https://ucps.k12.nc.us',
    address: '400 N. Church Street, Monroe, NC 28112',
    services_offered: ['K-12 Education', 'Special Education', 'Adult Education', 'ESL Programs'],
    population_served: ['Children', 'Teens', 'Adults'],
    hours_of_operation: {
      monday: { open: '07:30', close: '16:00' },
      tuesday: { open: '07:30', close: '16:00' },
      wednesday: { open: '07:30', close: '16:00' },
      thursday: { open: '07:30', close: '16:00' },
      friday: { open: '07:30', close: '16:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: true,
    spotlight_story: 'Empowering over 40,000 students across 53 schools with quality education, innovative programs, and dedicated teachers. Building the future leaders of Monroe and Union County.'
  },
  {
    name: 'Monroe Public Library',
    description: 'Community library offering books, digital resources, computer access, and educational programs for all ages.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-5000',
      email: 'info@monroelibrary.org',
      address: '316 E. Windsor Street, Monroe, NC 28112'
    },
    website: 'https://monroelibrary.org',
    address: '316 E. Windsor Street, Monroe, NC 28112',
    services_offered: ['Book Lending', 'Computer Access', 'Educational Programs', 'Research Assistance'],
    population_served: ['All Ages', 'Students', 'Seniors'],
    hours_of_operation: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Housing
  {
    name: 'Monroe Housing Authority',
    description: 'Provides affordable housing options and rental assistance programs for low-income families and individuals.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-6000',
      email: 'info@monroeha.org',
      address: '1000 E. Franklin Street, Monroe, NC 28112'
    },
    website: 'https://monroeha.org',
    address: '1000 E. Franklin Street, Monroe, NC 28112',
    services_offered: ['Public Housing', 'Section 8 Vouchers', 'Housing Counseling', 'Emergency Shelter'],
    population_served: ['Low Income', 'Families', 'Seniors', 'Disabled'],
    hours_of_operation: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },
  {
    name: 'Union County Homeless Shelter',
    description: 'Emergency shelter providing temporary housing, meals, and case management services for individuals and families experiencing homelessness.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-7000',
      email: 'help@unioncountyshelter.org',
      address: '200 Shelter Lane, Monroe, NC 28112'
    },
    website: 'https://unioncountyshelter.org',
    address: '200 Shelter Lane, Monroe, NC 28112',
    services_offered: ['Emergency Shelter', 'Meals', 'Case Management', 'Job Placement'],
    population_served: ['Homeless', 'Families', 'Single Adults'],
    hours_of_operation: {
      monday: { open: '00:00', close: '23:59' },
      tuesday: { open: '00:00', close: '23:59' },
      wednesday: { open: '00:00', close: '23:59' },
      thursday: { open: '00:00', close: '23:59' },
      friday: { open: '00:00', close: '23:59' },
      saturday: { open: '00:00', close: '23:59' },
      sunday: { open: '00:00', close: '23:59' }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Family Support
  {
    name: 'Monroe Family Resource Center',
    description: 'Comprehensive family support services including parenting classes, childcare resources, and family counseling.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-8000',
      email: 'info@monroefamilycenter.org',
      address: '555 Family Circle, Monroe, NC 28112'
    },
    website: 'https://monroefamilycenter.org',
    address: '555 Family Circle, Monroe, NC 28112',
    services_offered: ['Parenting Classes', 'Childcare Resources', 'Family Counseling', 'Support Groups'],
    population_served: ['Families', 'Parents', 'Children'],
    hours_of_operation: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '14:00' },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },
  {
    name: 'Union County Childcare Network',
    description: 'Connects families with quality childcare providers and offers financial assistance for childcare costs.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-9000',
      email: 'childcare@unioncounty.org',
      address: '777 Childcare Drive, Monroe, NC 28112'
    },
    website: 'https://unioncountychildcare.org',
    address: '777 Childcare Drive, Monroe, NC 28112',
    services_offered: ['Childcare Referrals', 'Financial Assistance', 'Provider Training', 'Quality Ratings'],
    population_served: ['Families', 'Children', 'Childcare Providers'],
    hours_of_operation: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Senior Services
  {
    name: 'Monroe Senior Center',
    description: 'Comprehensive services for seniors including social activities, health programs, and educational workshops.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-1000',
      email: 'info@monroeseniorcenter.org',
      address: '888 Senior Way, Monroe, NC 28112'
    },
    website: 'https://monroeseniorcenter.org',
    address: '888 Senior Way, Monroe, NC 28112',
    services_offered: ['Social Activities', 'Health Screenings', 'Educational Workshops', 'Transportation'],
    population_served: ['Seniors', 'Elderly'],
    hours_of_operation: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Mental Health
  {
    name: 'Monroe Mental Health Services',
    description: 'Professional counseling and mental health services for individuals, families, and groups.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-1100',
      email: 'counseling@monroementalhealth.org',
      address: '999 Wellness Boulevard, Monroe, NC 28112'
    },
    website: 'https://monroementalhealth.org',
    address: '999 Wellness Boulevard, Monroe, NC 28112',
    services_offered: ['Individual Counseling', 'Family Therapy', 'Group Therapy', 'Crisis Intervention'],
    population_served: ['All Ages', 'Families', 'Adults', 'Children'],
    hours_of_operation: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '15:00' },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Legal Aid
  {
    name: 'Union County Legal Aid',
    description: 'Free legal services for low-income residents including family law, housing, and consumer protection.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-1200',
      email: 'help@unionlegalaid.org',
      address: '111 Justice Street, Monroe, NC 28112'
    },
    website: 'https://unionlegalaid.org',
    address: '111 Justice Street, Monroe, NC 28112',
    services_offered: ['Family Law', 'Housing Law', 'Consumer Protection', 'Estate Planning'],
    population_served: ['Low Income', 'Families', 'Seniors'],
    hours_of_operation: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Employment
  {
    name: 'Monroe Career Center',
    description: 'Job training, placement services, and career counseling for job seekers and career changers.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-1300',
      email: 'careers@monroecareercenter.org',
      address: '222 Career Path, Monroe, NC 28112'
    },
    website: 'https://monroecareercenter.org',
    address: '222 Career Path, Monroe, NC 28112',
    services_offered: ['Job Training', 'Resume Writing', 'Interview Preparation', 'Job Placement'],
    population_served: ['Job Seekers', 'Unemployed', 'Career Changers'],
    hours_of_operation: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Transportation
  {
    name: 'Union County Transit',
    description: 'Public transportation services connecting Monroe with surrounding communities and major destinations.',
    category_id: '',
    contact_info: {
      phone: '(704) 283-1400',
      email: 'transit@unioncounty.org',
      address: '333 Transit Center, Monroe, NC 28112'
    },
    website: 'https://unioncountytransit.org',
    address: '333 Transit Center, Monroe, NC 28112',
    services_offered: ['Fixed Route Service', 'Paratransit', 'Senior Transportation', 'Medical Transportation'],
    population_served: ['All Ages', 'Seniors', 'Disabled', 'Low Income'],
    hours_of_operation: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '07:00', close: '20:00' },
      sunday: { open: '08:00', close: '18:00' }
    },
    is_approved: true,
    is_spotlighted: false
  }
];

export const events = [
  {
    title: 'Monroe Community Health Fair',
    description: 'Free health screenings, flu shots, and wellness information for the whole family.',
    start_date: '2024-03-15T09:00:00Z',
    end_date: '2024-03-15T15:00:00Z',
    location: 'Monroe Community Park, 100 Park Drive, Monroe, NC 28112',
    organizer: 'Monroe Health Department',
    contact_info: {
      phone: '(704) 283-3000',
      email: 'healthfair@monroe.gov',
      website: 'https://monroe.gov/healthfair'
    },
    category: 'Health & Wellness',
    is_approved: true
  },
  {
    title: 'Union County Job Fair',
    description: 'Connect with local employers and explore career opportunities in Union County.',
    start_date: '2024-03-22T10:00:00Z',
    end_date: '2024-03-22T16:00:00Z',
    location: 'Union County Convention Center, 500 Convention Way, Monroe, NC 28112',
    organizer: 'Monroe Career Center',
    contact_info: {
      phone: '(704) 283-1300',
      email: 'jobfair@monroecareercenter.org',
      website: 'https://monroecareercenter.org/jobfair'
    },
    category: 'Employment',
    is_approved: true
  },
  {
    title: 'Monroe Farmers Market Opening Day',
    description: 'Celebrate the start of the growing season with fresh local produce, crafts, and live music.',
    start_date: '2024-04-06T08:00:00Z',
    end_date: '2024-04-06T13:00:00Z',
    location: 'Downtown Monroe, Main Street, Monroe, NC 28112',
    organizer: 'Monroe Downtown Association',
    contact_info: {
      phone: '(704) 283-1500',
      email: 'info@monroedowntown.org',
      website: 'https://monroedowntown.org'
    },
    category: 'Community',
    is_approved: true
  },
  {
    title: 'Senior Technology Workshop',
    description: 'Learn to use smartphones, tablets, and computers. Free workshop for seniors.',
    start_date: '2024-04-10T14:00:00Z',
    end_date: '2024-04-10T16:00:00Z',
    location: 'Monroe Senior Center, 888 Senior Way, Monroe, NC 28112',
    organizer: 'Monroe Senior Center',
    contact_info: {
      phone: '(704) 283-1000',
      email: 'workshops@monroeseniorcenter.org',
      website: 'https://monroeseniorcenter.org'
    },
    category: 'Education',
    is_approved: true
  },
  {
    title: 'Monroe Spring Festival',
    description: 'Annual community festival featuring local vendors, food trucks, live entertainment, and family activities.',
    start_date: '2024-04-20T10:00:00Z',
    end_date: '2024-04-20T18:00:00Z',
    location: 'Monroe Community Park, 100 Park Drive, Monroe, NC 28112',
    organizer: 'Monroe Parks and Recreation',
    contact_info: {
      phone: '(704) 283-1600',
      email: 'festival@monroe.gov',
      website: 'https://monroe.gov/springfestival'
    },
    category: 'Community',
    is_approved: true
  }
];

export async function seedDatabase() {
  const supabase = await createServiceClient();
  
  try {
    console.log('Starting database seeding...');
    
    // Insert categories first
    console.log('Inserting categories...');
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select();
    
    if (categoryError) {
      console.error('Error inserting categories:', categoryError);
      return;
    }
    
    console.log(`Inserted ${categoryData.length} categories`);
    
    // Create category mapping
    const categoryMap: { [key: string]: string } = {};
    categoryData.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    // Update resources with category IDs
    const resourcesWithCategories = resources.map(resource => ({
      ...resource,
      category_id: categoryMap[resource.name.split(' ')[0] === 'Monroe' ? 
        (resource.name.includes('Food') ? 'Food Assistance' :
         resource.name.includes('Health') ? 'Healthcare' :
         resource.name.includes('School') ? 'Education' :
         resource.name.includes('Housing') ? 'Housing' :
         resource.name.includes('Family') ? 'Family Support' :
         resource.name.includes('Senior') ? 'Senior Services' :
         resource.name.includes('Mental') ? 'Mental Health' :
         resource.name.includes('Legal') ? 'Legal Aid' :
         resource.name.includes('Career') ? 'Employment' :
         resource.name.includes('Transit') ? 'Transportation' : 'Healthcare') :
        (resource.name.includes('Union') ? 
         (resource.name.includes('Meals') ? 'Senior Services' :
          resource.name.includes('School') ? 'Education' :
          resource.name.includes('Homeless') ? 'Housing' :
          resource.name.includes('Childcare') ? 'Family Support' :
          resource.name.includes('Legal') ? 'Legal Aid' :
          resource.name.includes('Transit') ? 'Transportation' : 'Healthcare') :
         'Healthcare')]
    }));
    
    // Insert resources
    console.log('Inserting resources...');
    const { data: resourceData, error: resourceError } = await supabase
      .from('resources')
      .insert(resourcesWithCategories)
      .select();
    
    if (resourceError) {
      console.error('Error inserting resources:', resourceError);
      return;
    }
    
    console.log(`Inserted ${resourceData.length} resources`);
    
    // Insert events
    console.log('Inserting events...');
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert(events)
      .select();
    
    if (eventError) {
      console.error('Error inserting events:', eventError);
      return;
    }
    
    console.log(`Inserted ${eventData.length} events`);
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}
