import { createClient } from '@supabase/supabase-js';

// Create service client for updating data
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

// Comprehensive real data collected from web scraping
const comprehensiveResources = [
  // Healthcare
  {
    name: 'Atrium Health Union',
    description: 'Atrium Health Union is a 182-bed hospital in Monroe, NC, providing comprehensive emergency services and specialty medical care. The campus offers a variety of medical services, including surgery, emergency care with a pediatric emergency department, cancer treatment, long-term care, behavioral health, specialty care clinics, a women and children\'s center, community wellness and outreach, an interventional heart program, and physician practices.',
    contact_info: {
      phone: '980-993-3100',
      email: 'info@atriumhealth.org',
      address: '600 Hospital Drive, Monroe, NC 28112'
    },
    website: 'https://atriumhealth.org/locations/detail/atrium-health-union',
    address: '600 Hospital Drive, Monroe, NC 28112',
    services_offered: [
      'Emergency Care',
      'Surgery',
      'Cancer Treatment',
      'Long-term Care',
      'Behavioral Health',
      'Specialty Care Clinics',
      'Women and Children\'s Center',
      'Community Wellness',
      'Interventional Heart Program',
      'Physician Practices',
      'Pediatric Emergency Department'
    ],
    population_served: ['All Ages', 'Families', 'Seniors', 'Children'],
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
    spotlight_story: 'Monroe\'s premier healthcare facility, serving the community with state-of-the-art medical technology and compassionate care. Our 24/7 emergency department ensures help is always available, and our specialized services including cancer treatment, behavioral health, and women\'s services make us a comprehensive healthcare destination for Union County.'
  },

  // Education
  {
    name: 'Union County Public Schools',
    description: 'Union County Public Schools serves Monroe and surrounding areas with comprehensive K-12 education programs. The district is committed to providing quality education and innovative programs to prepare students for success.',
    contact_info: {
      phone: '(704) 283-4000',
      email: 'info@ucps.k12.nc.us',
      address: '400 N. Church Street, Monroe, NC 28112'
    },
    website: 'https://www.ucpsnc.org',
    address: '400 N. Church Street, Monroe, NC 28112',
    services_offered: [
      'K-12 Education',
      'Special Education',
      'Adult Education',
      'ESL Programs',
      'Career and Technical Education',
      'Advanced Placement Courses',
      'Athletics',
      'Arts Programs'
    ],
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
    spotlight_story: 'Empowering over 40,000 students across 53 schools with quality education, innovative programs, and dedicated teachers. Building the future leaders of Monroe and Union County through comprehensive educational opportunities and community partnerships.'
  },

  // Food Assistance
  {
    name: 'Second Harvest Food Bank of Metrolina',
    description: 'Second Harvest Food Bank of Metrolina strives through education, advocacy and partnerships to eliminate hunger by the solicitation and distribution of food. Serving the Metrolina region including Monroe, NC, since 1981.',
    contact_info: {
      phone: '(704) 376-1785',
      email: 'info@secondharvestmetrolina.org',
      address: '500-B Spratt Street, Charlotte, NC 28206'
    },
    website: 'https://www.secondharvestmetrolina.org',
    address: '500-B Spratt Street, Charlotte, NC 28206',
    services_offered: [
      'Food Distribution',
      'Emergency Food Assistance',
      'Child Hunger Programs',
      'Senior Nutrition',
      'Mobile Food Pantries',
      'Community Gardens',
      'Nutrition Education',
      'Volunteer Opportunities'
    ],
    population_served: ['Families', 'Seniors', 'Children', 'Veterans', 'Low Income'],
    hours_of_operation: {
      monday: { open: '07:30', close: '17:00' },
      tuesday: { open: '07:30', close: '17:00' },
      wednesday: { open: '07:30', close: '17:00' },
      thursday: { open: '07:30', close: '17:00' },
      friday: { open: '07:30', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Government Services
  {
    name: 'Union County Government',
    description: 'Union County Government provides essential services to residents including emergency services, public health, social services, parks and recreation, library services, and more.',
    contact_info: {
      phone: '(704) 283-3500',
      email: 'info@unioncountync.gov',
      address: '500 North Main Street, Monroe, NC 28112'
    },
    website: 'https://www.unioncountync.gov',
    address: '500 North Main Street, Monroe, NC 28112',
    services_offered: [
      'Emergency Services',
      'Public Health',
      'Social Services',
      'Parks & Recreation',
      'Library Services',
      'Animal Services',
      'Environmental Health',
      'Building Permits',
      'Tax Services',
      'Veterans Services'
    ],
    population_served: ['All Residents', 'Families', 'Seniors', 'Veterans'],
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

  // Parks & Recreation
  {
    name: 'Union County Parks & Recreation',
    description: 'Union County Parks & Recreation manages three major parks: Cane Creek Park, Fred Kirby Park, and Jesse Helms Park, offering camping, hiking, fishing, and recreational programs for all ages.',
    contact_info: {
      phone: '(704) 283-3885',
      email: 'parkreservations@unioncountync.gov',
      address: '500 North Main Street, Monroe, NC 28112'
    },
    website: 'https://www.unioncountync.gov/government/departments-f-p/parks-recreation',
    address: '500 North Main Street, Monroe, NC 28112',
    services_offered: [
      'Camping Reservations',
      'Hiking Trails',
      'Fishing',
      'Recreational Programs',
      'Shelter Rentals',
      'Educational Programs',
      'Volunteer Opportunities',
      'Park Maintenance'
    ],
    population_served: ['All Ages', 'Families', 'Children', 'Seniors'],
    hours_of_operation: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '08:00', close: '17:00' },
      sunday: { open: '08:00', close: '17:00' }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Library Services
  {
    name: 'Union County Public Library',
    description: 'Union County Public Library system provides free access to books, digital resources, educational programs, and community services across multiple locations in Monroe and surrounding areas.',
    contact_info: {
      phone: '(704) 283-8184',
      email: 'library@unioncountync.gov',
      address: '316 E. Windsor Street, Monroe, NC 28112'
    },
    website: 'https://www.uclnc.org',
    address: '316 E. Windsor Street, Monroe, NC 28112',
    services_offered: [
      'Book Lending',
      'Digital Resources',
      'Computer Access',
      'Educational Programs',
      'Children\'s Programs',
      'Adult Literacy',
      'Meeting Rooms',
      'Research Assistance'
    ],
    population_served: ['All Ages', 'Children', 'Adults', 'Seniors'],
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

  // Animal Services
  {
    name: 'Union County Animal Services',
    description: 'Union County Animal Services provides animal control, adoption services, and pet care resources for the community.',
    contact_info: {
      phone: '(704) 283-2308',
      email: 'animalservices@unioncountync.gov',
      address: '3340 Presson Road, Monroe, NC 28112'
    },
    website: 'https://www.unioncountync.gov/government/departments-a-e/animal-services',
    address: '3340 Presson Road, Monroe, NC 28112',
    services_offered: [
      'Animal Adoption',
      'Animal Control',
      'Pet Licensing',
      'Lost & Found Pets',
      'Spay/Neuter Programs',
      'Volunteer Opportunities',
      'Pet Care Education'
    ],
    population_served: ['Pet Owners', 'Families', 'All Residents'],
    hours_of_operation: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '10:00', close: '14:00' },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false
  },

  // Social Services
  {
    name: 'Union County Social Services',
    description: 'Union County Social Services provides assistance programs including food stamps, Medicaid, child protective services, and adult protective services.',
    contact_info: {
      phone: '(704) 296-4300',
      email: 'socialservices@unioncountync.gov',
      address: '2330 Concord Avenue, Monroe, NC 28110'
    },
    website: 'https://www.unioncountync.gov/government/departments-r-z/social-services',
    address: '2330 Concord Avenue, Monroe, NC 28110',
    services_offered: [
      'Food Assistance (SNAP)',
      'Medicaid',
      'Child Protective Services',
      'Adult Protective Services',
      'Child Care Assistance',
      'Energy Assistance',
      'Crisis Intervention',
      'Case Management'
    ],
    population_served: ['Low Income', 'Families', 'Children', 'Seniors', 'Disabled'],
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

  // Veterans Services
  {
    name: 'Union County Veterans Services',
    description: 'Union County Veterans Services provides assistance to veterans and their families with benefits, claims, and support services.',
    contact_info: {
      phone: '(704) 283-3806',
      email: 'veterans@unioncountync.gov',
      address: '500 North Main Street, Monroe, NC 28112'
    },
    website: 'https://www.unioncountync.gov/government/departments-r-z/veterans-services',
    address: '500 North Main Street, Monroe, NC 28112',
    services_offered: [
      'VA Benefits Assistance',
      'Claims Processing',
      'Discharge Upgrades',
      'Burial Benefits',
      'Education Benefits',
      'Healthcare Enrollment',
      'Housing Assistance',
      'Employment Services'
    ],
    population_served: ['Veterans', 'Military Families', 'Survivors'],
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

  // Emergency Services
  {
    name: 'Union County Emergency Services',
    description: 'Union County Emergency Services provides 911 dispatch, emergency medical services, fire protection, and emergency management for the county.',
    contact_info: {
      phone: '911 (Emergency)',
      email: 'emergency@unioncountync.gov',
      address: '500 North Main Street, Monroe, NC 28112'
    },
    website: 'https://www.unioncountync.gov/government/departments-a-e/emergency-services',
    address: '500 North Main Street, Monroe, NC 28112',
    services_offered: [
      '911 Emergency Dispatch',
      'Emergency Medical Services',
      'Fire Protection',
      'Emergency Management',
      'Hazardous Materials Response',
      'Search and Rescue',
      'Emergency Preparedness',
      'Public Safety Education'
    ],
    population_served: ['All Residents', 'Emergency Responders'],
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
  }
];

// Real events data from Union County
const realEvents = [
  {
    title: 'TeenTober',
    description: 'A month-long celebration for teens with special programs, activities, and events at the library.',
    start_date: '2024-10-01T00:00:00Z',
    end_date: '2024-10-31T23:59:59Z',
    location: 'Union County Public Library',
    organizer: 'Union County Public Library',
    category: 'Education',
    is_approved: true
  },
  {
    title: 'Welcome to Fall',
    description: 'Celebrate the arrival of autumn with seasonal activities and crafts.',
    start_date: '2024-10-02T09:00:00Z',
    end_date: '2024-10-02T11:00:00Z',
    location: 'Union County Public Library',
    organizer: 'Union County Public Library',
    category: 'Community',
    is_approved: true
  },
  {
    title: 'World Space Week',
    description: 'Explore the wonders of space with educational programs and activities.',
    start_date: '2024-10-04T14:00:00Z',
    end_date: '2024-10-10T16:00:00Z',
    location: 'Union County Public Library',
    organizer: 'Union County Public Library',
    category: 'Education',
    is_approved: true
  },
  {
    title: 'Advance Directive Workshop',
    description: 'Learn about advance directives and end-of-life planning.',
    start_date: '2024-10-06T10:00:00Z',
    end_date: '2024-10-06T12:00:00Z',
    location: 'Union County Public Library',
    organizer: 'Union County Public Library',
    category: 'Health & Wellness',
    is_approved: true
  },
  {
    title: 'Board of County Commissioners Regular Meeting',
    description: 'Monthly meeting of the Union County Board of Commissioners.',
    start_date: '2024-10-06T18:00:00Z',
    end_date: '2024-10-06T20:00:00Z',
    location: 'Union County Government Center',
    organizer: 'Union County Government',
    category: 'Government',
    is_approved: true
  },
  {
    title: 'Movie Night @ Cane Creek Park',
    description: 'Enjoy a family-friendly movie under the stars at Cane Creek Park.',
    start_date: '2024-10-18T18:00:00Z',
    end_date: '2024-10-18T22:00:00Z',
    location: 'Cane Creek Park, Waxhaw, NC',
    organizer: 'Union County Parks & Recreation',
    category: 'Arts & Culture',
    is_approved: true
  },
  {
    title: 'UCSO Trunk or Treat',
    description: 'Safe trick-or-treating event hosted by the Union County Sheriff\'s Office.',
    start_date: '2024-10-18T18:00:00Z',
    end_date: '2024-10-18T20:00:00Z',
    location: 'Union County Sheriff\'s Office',
    organizer: 'Union County Sheriff\'s Office',
    category: 'Community',
    is_approved: true
  },
  {
    title: 'Career Fair 2025',
    description: 'Connect with local employers and explore career opportunities in Union County.',
    start_date: '2024-10-29T09:30:00Z',
    end_date: '2024-10-29T15:00:00Z',
    location: 'Union County Agricultural Center',
    organizer: 'Union County Economic Development',
    category: 'Employment',
    is_approved: true
  }
];

export async function updateComprehensiveData() {
  const supabase = createServiceClient();
  
  try {
    console.log('Starting comprehensive data update...');
    
    // Get category IDs
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');
    
    if (!categories) {
      console.error('No categories found');
      return;
    }
    
    const categoryMap: { [key: string]: string } = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    // Update resources with comprehensive real data
    for (const resource of comprehensiveResources) {
      let categoryId = '';
      
      // Map to appropriate category
      if (resource.name.includes('Atrium Health') || resource.name.includes('Hospital')) {
        categoryId = categoryMap['Healthcare'];
      } else if (resource.name.includes('School') || resource.name.includes('Education') || resource.name.includes('Library')) {
        categoryId = categoryMap['Education'];
      } else if (resource.name.includes('Food Bank') || resource.name.includes('Food')) {
        categoryId = categoryMap['Food Assistance'];
      } else if (resource.name.includes('Government') || resource.name.includes('County')) {
        categoryId = categoryMap['Government Services'];
      } else if (resource.name.includes('Parks') || resource.name.includes('Recreation')) {
        categoryId = categoryMap['Recreation'];
      } else if (resource.name.includes('Animal')) {
        categoryId = categoryMap['Animal Services'];
      } else if (resource.name.includes('Social Services')) {
        categoryId = categoryMap['Social Services'];
      } else if (resource.name.includes('Veterans')) {
        categoryId = categoryMap['Veterans Services'];
      } else if (resource.name.includes('Emergency')) {
        categoryId = categoryMap['Emergency Services'];
      }
      
      if (categoryId) {
        // Check if resource already exists
        const { data: existing } = await supabase
          .from('resources')
          .select('id')
          .eq('name', resource.name)
          .single();
        
        if (existing) {
          // Update existing resource
          const { error } = await supabase
            .from('resources')
            .update({
              ...resource,
              category_id: categoryId,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
          
          if (error) {
            console.error(`Error updating ${resource.name}:`, error);
          } else {
            console.log(`Updated ${resource.name}`);
          }
        } else {
          // Insert new resource
          const { error } = await supabase
            .from('resources')
            .insert({
              ...resource,
              category_id: categoryId
            });
          
          if (error) {
            console.error(`Error inserting ${resource.name}:`, error);
          } else {
            console.log(`Inserted ${resource.name}`);
          }
        }
      }
    }
    
    // Update events with real data
    for (const event of realEvents) {
      // Check if event already exists
      const { data: existing } = await supabase
        .from('events')
        .select('id')
        .eq('title', event.title)
        .single();
      
      if (existing) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            ...event,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
        
        if (error) {
          console.error(`Error updating event ${event.title}:`, error);
        } else {
          console.log(`Updated event ${event.title}`);
        }
      } else {
        // Insert new event
        const { error } = await supabase
          .from('events')
          .insert(event);
        
        if (error) {
          console.error(`Error inserting event ${event.title}:`, error);
        } else {
          console.log(`Inserted event ${event.title}`);
        }
      }
    }
    
    console.log('Comprehensive data update completed!');
    
  } catch (error) {
    console.error('Error during comprehensive data update:', error);
  }
}
