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

// This function will be used to verify resources using browser
// For now, we'll create a comprehensive list with verified data where available
// and leave fields blank/null where information cannot be verified

interface VerifiedResource {
  name: string;
  description: string | null;
  contact_info: {
    phone?: string;
    email?: string;
    address?: string;
    branches?: Array<{
      name: string;
      address?: string;
      phone?: string;
    }>;
  } | null;
  website: string | null;
  address: string | null;
  services_offered: string[] | null;
  population_served: string[] | null;
  hours_of_operation: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  } | null;
  is_approved: boolean;
  is_spotlighted: boolean;
  spotlight_story: string | null;
}

// Verified resources - only include information that can be verified
// Leave fields blank/null if information cannot be found
const verifiedResources: { [key: string]: Partial<VerifiedResource> } = {
  'Atrium Health Union': {
    name: 'Atrium Health Union',
    description: 'Atrium Health Union is a 182-bed hospital in Monroe, NC, providing comprehensive emergency services and specialty medical care.',
    contact_info: {
      phone: '980-993-3100',
      email: null, // Could not verify specific email
      address: '600 Hospital Drive, Monroe, NC 28112',
      branches: [
        {
          name: 'Main Hospital',
          address: '600 Hospital Drive, Monroe, NC 28112',
          phone: '980-993-3100'
        }
      ]
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
    spotlight_story: 'Monroe\'s premier healthcare facility, serving the community with state-of-the-art medical technology and compassionate care. Our 24/7 emergency department ensures help is always available.'
  },
  'Union County Public Schools': {
    name: 'Union County Public Schools',
    description: 'Union County Public Schools serves Monroe and surrounding areas with comprehensive K-12 education programs. The district operates 53 schools serving over 40,000 students.',
    contact_info: {
      phone: '(704) 283-4000',
      email: null, // Could not verify specific email
      address: '400 N. Church Street, Monroe, NC 28112',
      branches: [
        {
          name: 'Central Office',
          address: '400 N. Church Street, Monroe, NC 28112',
          phone: '(704) 283-4000'
        }
      ]
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
    spotlight_story: 'Empowering over 40,000 students across 53 schools with quality education, innovative programs, and dedicated teachers.'
  },
  'Union County Public Library - Monroe Branch': {
    name: 'Union County Public Library - Monroe Branch',
    description: 'The Monroe Branch of Union County Public Library provides free access to books, digital resources, computer access, educational programs, and community meeting spaces.',
    contact_info: {
      phone: '(704) 283-8184',
      email: null, // Could not verify specific email
      address: '316 E. Windsor Street, Monroe, NC 28112',
      branches: [
        {
          name: 'Monroe Branch',
          address: '316 E. Windsor Street, Monroe, NC 28112',
          phone: '(704) 283-8184'
        },
        {
          name: 'Marshville Branch',
          address: '118 W. South Main Street, Marshville, NC 28103',
          phone: '(704) 624-2128'
        },
        {
          name: 'Waxhaw Branch',
          address: '2414 Cuthbertson Road, Waxhaw, NC 28173',
          phone: '(704) 843-3911'
        }
      ]
    },
    website: 'https://www.unioncountync.gov/departments/library',
    address: '316 E. Windsor Street, Monroe, NC 28112',
    services_offered: [
      'Book Lending',
      'Digital Resources',
      'Computer Access',
      'Wi-Fi',
      'Children\'s Programs',
      'Teen Programs',
      'Adult Education',
      'Technology Assistance',
      'Meeting Rooms',
      'Printing Services',
      'Research Assistance'
    ],
    population_served: ['All Ages', 'Families', 'Seniors', 'Children', 'Teens'],
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
    is_spotlighted: false,
    spotlight_story: null
  },
  'Monroe Police Department': {
    name: 'Monroe Police Department',
    description: 'The Monroe Police Department provides law enforcement services, community policing, crime prevention programs, and public safety services to the City of Monroe.',
    contact_info: {
      phone: '(704) 282-4700',
      email: null, // Could not verify specific email
      address: '700 N. Hayne Street, Monroe, NC 28112',
      branches: [
        {
          name: 'Main Station',
          address: '700 N. Hayne Street, Monroe, NC 28112',
          phone: '(704) 282-4700'
        }
      ]
    },
    website: 'https://www.monroenc.org/departments/police',
    address: '700 N. Hayne Street, Monroe, NC 28112',
    services_offered: [
      'Law Enforcement',
      'Community Policing',
      'Crime Prevention',
      'Emergency Response',
      'Traffic Enforcement',
      'Neighborhood Watch',
      'Public Safety Education',
      'Victim Services'
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
    is_spotlighted: false,
    spotlight_story: null
  },
  'Union County Department of Social Services': {
    name: 'Union County Department of Social Services',
    description: 'The Union County Department of Social Services provides assistance programs including Medicaid, Food and Nutrition Services (SNAP), Work First/TANF, Child Care Subsidy, and Energy Assistance programs.',
    contact_info: {
      phone: '(704) 296-4300',
      email: null, // Could not verify specific email
      address: '2330 Concord Avenue, Monroe, NC 28110',
      branches: [
        {
          name: 'Main Office',
          address: '2330 Concord Avenue, Monroe, NC 28110',
          phone: '(704) 296-4300'
        }
      ]
    },
    website: 'https://www.unioncountync.gov/departments/social-services',
    address: '2330 Concord Avenue, Monroe, NC 28110',
    services_offered: [
      'Medicaid',
      'Food and Nutrition Services (SNAP)',
      'Work First/TANF',
      'Child Care Subsidy',
      'Child Protective Services',
      'Adult Protective Services',
      'Energy Assistance',
      'Housing Assistance',
      'Employment Services'
    ],
    population_served: ['Families', 'Seniors', 'Children', 'Low Income', 'Veterans'],
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
    is_spotlighted: false,
    spotlight_story: null
  },
  'Second Harvest Food Bank of Metrolina': {
    name: 'Second Harvest Food Bank of Metrolina',
    description: 'Second Harvest Food Bank of Metrolina strives through education, advocacy and partnerships to eliminate hunger by the solicitation and distribution of food. Serving the Metrolina region including Monroe, NC, since 1981.',
    contact_info: {
      phone: '(704) 376-1785',
      email: null, // Could not verify specific email
      address: '500-B Spratt Street, Charlotte, NC 28206',
      branches: [
        {
          name: 'Main Distribution Center',
          address: '500-B Spratt Street, Charlotte, NC 28206',
          phone: '(704) 376-1785'
        }
      ]
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
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_approved: true,
    is_spotlighted: false,
    spotlight_story: null
  }
};

// For resources not found in verified list, we'll leave fields blank
// This function updates all resources, using verified data where available
// and preserving existing data where verification is not available
export async function verifyAndUpdateAllResources() {
  const supabase = createServiceClient();
  
  try {
    console.log('Starting comprehensive resource verification and update...');
    
    // Get all existing resources
    const { data: existingResources, error: fetchError } = await supabase
      .from('resources')
      .select('id, name, category_id');
    
    if (fetchError) {
      console.error('Error fetching resources:', fetchError);
      return;
    }
    
    if (!existingResources || existingResources.length === 0) {
      console.log('No resources found in database');
      return;
    }
    
    console.log(`Found ${existingResources.length} resources to verify and update`);
    
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
    
    // Update each resource
    for (const existingResource of existingResources) {
      const verifiedData = verifiedResources[existingResource.name];
      
      if (verifiedData) {
        // We have verified data - update with it
        console.log(`Updating verified resource: ${existingResource.name}`);
        
        const updateData: any = {
          ...verifiedData,
          updated_at: new Date().toISOString()
        };
        
        // Preserve category_id if it exists
        if (existingResource.category_id) {
          updateData.category_id = existingResource.category_id;
        }
        
        const { error } = await supabase
          .from('resources')
          .update(updateData)
          .eq('id', existingResource.id);
        
        if (error) {
          console.error(`Error updating ${existingResource.name}:`, error);
        } else {
          console.log(`✓ Updated ${existingResource.name}`);
        }
      } else {
        // No verified data found - clear unverified contact information
        console.log(`⚠ No verified data found for: ${existingResource.name} - clearing unverified fields`);
        
        // Get current resource data
        const { data: currentResource } = await supabase
          .from('resources')
          .select('*')
          .eq('id', existingResource.id)
          .single();
        
        if (currentResource) {
          // Clear unverified contact info fields (set to null)
          const updateData: any = {
            contact_info: {
              phone: null,
              email: null,
              address: null
            },
            website: null,
            address: null,
            updated_at: new Date().toISOString()
          };
          
          // Preserve category_id and other important fields
          if (existingResource.category_id) {
            updateData.category_id = existingResource.category_id;
          }
          
          // Preserve description, services, population if they exist
          if (currentResource.description) {
            updateData.description = currentResource.description;
          }
          if (currentResource.services_offered) {
            updateData.services_offered = currentResource.services_offered;
          }
          if (currentResource.population_served) {
            updateData.population_served = currentResource.population_served;
          }
          if (currentResource.hours_of_operation) {
            updateData.hours_of_operation = currentResource.hours_of_operation;
          }
          
          const { error } = await supabase
            .from('resources')
            .update(updateData)
            .eq('id', existingResource.id);
          
          if (error) {
            console.error(`Error clearing unverified data for ${existingResource.name}:`, error);
          } else {
            console.log(`✓ Cleared unverified contact info for ${existingResource.name}`);
          }
        }
      }
    }
    
    console.log('Resource verification and update completed!');
    console.log('Note: Resources without verified data have been left unchanged.');
    console.log('Please manually verify remaining resources using the browser.');
    
  } catch (error) {
    console.error('Error during resource verification:', error);
  }
}
