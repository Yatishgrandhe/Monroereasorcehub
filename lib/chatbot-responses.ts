/**
 * Rule-based local chatbot for Monroe Resource Hub.
 * No API calls — keyword/intent matching only.
 */

const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ');

export function getBotResponse(userMessage: string): string {
  const msg = normalize(userMessage);

  // --- Navigation ---
  if (/\b(food|pantry|meal|eat|hungry|snap|food help)\b/.test(msg)) {
    return 'Find food resources under **Resources** in the top nav, then filter by "Food Assistance." You can also use the search bar (⌘K) to search. We list pantries, SNAP help, and free meals across Union County.';
  }
  if (/\b(healthcare|health|clinic|doctor|dental|medical)\b/.test(msg)) {
    return 'Go to **Resources** in the navbar and filter by "Healthcare" for clinics, dental, and mental health services. Union County Community Care Clinic and others are listed there.';
  }
  if (/\b(submit|add|share)\s*(a\s*)?resource\b|\b(submit|add)\s*(org|organization)\b/.test(msg)) {
    return 'Click **Share Resource** in the top navbar (or go to the Submit a Resource page) to add a new organization. You can submit even without an account.';
  }
  if (/\b(job|jobs|resume|career|employment|work)\b/.test(msg)) {
    return 'Use **Career** in the navbar for the job board and the free AI Resume Builder. You can save resumes there too.';
  }
  if (/\b(event|events|calendar)\b/.test(msg)) {
    return '**Events** in the top nav shows upcoming community events in Monroe and Union County.';
  }
  if (/\b(volunteer|volunteering)\b/.test(msg)) {
    return '**Volunteer** in the navbar lists volunteer opportunities with local organizations.';
  }
  if (/\b(about|who built|who runs)\b/.test(msg)) {
    return '**About** in the nav explains how Monroe Resource Hub is built and maintained by Union County volunteers.';
  }
  if (/\b(info|faq|guide|how to use)\b/.test(msg)) {
    return '**Information** in the navbar has FAQs, guides, and how to use this site.';
  }
  if (/\b(navigate|navigation|where is|find.*page)\b/.test(msg)) {
    return 'Use the top navbar: **Resources** for services, **Events** for events, **Career** for jobs and resume builder, **Volunteer** for opportunities, **About** and **Information** for more info. **Share Resource** to add an organization.';
  }

  // --- Organizations ---
  if (/\b(community care|union.*clinic|clinic)\b/.test(msg)) {
    return '**Union County Community Care Clinic** offers affordable primary and dental care for uninsured and underinsured residents. Phone: (704) 292-1220. Website: unionclinic.org.';
  }
  if (/\b(second harvest|food bank|meals?)\b/.test(msg)) {
    return '**Second Harvest Food Bank** distributes meals across the Charlotte region with partner sites in Union County. Phone: (704) 376-1785.';
  }
  if (/\b(communities in schools|cis|student)\b/.test(msg)) {
    return '**Communities In Schools of Union County** provides wraparound support for students. Phone: (704) 296-9430. Website: cisunion.org.';
  }
  if (/\b(dss|snap|medicaid|emergency aid|welfare)\b/.test(msg)) {
    return '**Union County DSS** handles SNAP, Medicaid, and emergency aid. Address: 1212 W Roosevelt Blvd. Phone: (704) 296-4300.';
  }
  if (/\b(new hope|church|food pantry)\b/.test(msg)) {
    return '**New Hope Community Church** runs a food pantry. Contact and details are on the Resources page — search for "New Hope" or filter by Food Assistance.';
  }

  // --- Resources by category ---
  if (/\b(how many|listings?|categories?|food assistance|healthcare|education|housing|family support|career help)\b/.test(msg)) {
    return 'We list community-verified resources by category: **Food Assistance** (18), **Healthcare** (24), **Education** (15), **Housing** (11), **Family Support** (9), **Career Help** (20). Use **Resources** in the nav to browse or filter.';
  }

  // --- Timings & hours ---
  if (/\b(hours?|open|close|when|timing|schedule)\b/.test(msg)) {
    return 'Hours vary by organization. Check each listing on the **Resources** page for contact info and hours, or call the organization directly. The directory is updated weekly. Last updated March 2026.';
  }

  // --- General ---
  if (/\b(what is this|what.*site|monroe resource hub)\b/.test(msg)) {
    return 'Monroe Resource Hub is a free, community-maintained directory of local services in Union County, NC — food, healthcare, housing, jobs, events, and more. Built by Union County volunteers.';
  }
  if (/\b(contact|email|hello|support)\b/.test(msg)) {
    return 'Contact us at **hello@monroeresourcehub.us**. For urgent needs, you can also call **211** for local referrals.';
  }
  if (/\b(211|urgent|emergency|help now)\b/.test(msg)) {
    return 'For urgent needs, call **211** for local referrals and support. Our site lists ongoing services — use **Resources** or search to find organizations.';
  }

  // Default
  return 'I can help with navigation, food and healthcare resources, organizations like Community Care Clinic and Second Harvest, event and volunteer info, and how to submit a resource. Try "Find food help," "Healthcare resources," or "Contact info," or ask in your own words.';
}

export const QUICK_REPLIES = [
  'Find food help',
  'Healthcare resources',
  'Submit a resource',
  'Contact info',
] as const;
