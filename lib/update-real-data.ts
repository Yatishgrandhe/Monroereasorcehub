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

// Real data collected from web scraping
const realResources = [
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
  }
];

export async function updateRealData() {
  const supabase = createServiceClient();
  
  try {
    console.log('Starting real data update...');
    
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
    
    // Update resources with real data
    for (const resource of realResources) {
      let categoryId = '';
      
      // Map to appropriate category
      if (resource.name.includes('Atrium Health') || resource.name.includes('Hospital')) {
        categoryId = categoryMap['Healthcare'];
      } else if (resource.name.includes('School') || resource.name.includes('Education')) {
        categoryId = categoryMap['Education'];
      } else if (resource.name.includes('Food Bank') || resource.name.includes('Food')) {
        categoryId = categoryMap['Food Assistance'];
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
    
    console.log('Real data update completed!');
    
  } catch (error) {
    console.error('Error during real data update:', error);
  }
}
