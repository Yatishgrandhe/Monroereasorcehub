# Text Content Editing Guide

## 📝 Files with Editable Text Content

This guide shows you exactly where to find and edit all the text content on the website.

---

## 🏠 Homepage (`app/page.tsx`)

### Hero Section Text
**File:** `app/page.tsx`  
**Lines:** 191-203

```typescript
// Line 193 - Badge text
"Bringing Monroe Together"

// Lines 197-198 - Main heading
"Welcome to the Monroe"
"Resource Hub"

// Lines 201-202 - Description
"Everything you need in Monroe, all in one place. Find help, discover opportunities, and connect with your community."

// Line 213 - Search placeholder
"What can we help you find today?"

// Lines 220-221 - Button text
"Explore Resources"
"Share a Resource"
```

### Stats Section
**File:** `app/page.tsx`  
**Lines:** 84-89

```typescript
const stats = [
  { label: 'Resources Listed', value: '50+' },
  { label: 'Ways to Help', value: '10' },
  { label: 'Events this Month', value: '15+' },
  { label: 'People Helped', value: '1000+' }
];
```

### Image Slideshow Text
**File:** `components/home/ImageSlideshow.tsx`  
**Lines:** 10-44

```typescript
const slides = [
  {
    title: 'Building Community Together',
    description: 'Monroe residents coming together to support each other'
  },
  {
    title: 'Community Events',
    description: 'Join us for local events and activities'
  },
  {
    title: 'Healthcare Services',
    description: 'Access quality healthcare in Monroe'
  },
  {
    title: 'Education Resources',
    description: 'Educational opportunities for all ages'
  },
  {
    title: 'Food Assistance',
    description: 'Supporting families with food resources'
  }
];
```

### Community Spotlight Section
**File:** `app/page.tsx`  
**Lines:** 250-260

```typescript
// Line 252 - Section heading
"See What's Happening"

// Lines 253-255 - Description
"Take a look at the vibrant community and diverse services available right here in our city."

// Lines 264-265 - Featured section
"Local Heroes"
"Meet the organizations that are making a real difference in our community every day."
```

### Category Descriptions
**File:** `app/page.tsx`  
**Lines:** 11-81

```typescript
const categories = [
  {
    name: 'Food Assistance',
    description: 'Food banks, pantries, and meal programs',
  },
  {
    name: 'Healthcare',
    description: 'Medical services, clinics, and health programs',
  },
  // ... more categories
];
```

### Features Section
**File:** `app/page.tsx`  
**Lines:** 91-113

```typescript
const features = [
  {
    title: 'Find Help',
    description: 'Easily search through our list of local resources to find exactly what you need.',
  },
  {
    title: 'Grow Your Career',
    description: 'Use our free tools to build a resume and get help with job applications.',
  },
  {
    title: 'Join In',
    description: 'See what\'s happening in town with our calendar of local events and workshops.',
  },
  {
    title: 'Give Back',
    description: 'Find volunteer opportunities and ways to support your neighbors.',
  }
];
```

### Call to Action Section
**File:** `app/page.tsx`  
**Lines:** 380-395

```typescript
// Line 384 - Heading
"Ready to Get Started?"

// Lines 385-387 - Description
"Join thousands of Monroe residents who are already using our platform to find resources, discover opportunities, and connect with their community."

// Lines 390-391 - Button text
"Find Resources"
"Build Your Resume"
```

---

## 📄 About Page (`app/about/page.tsx`)

### Hero Section
**File:** `app/about/page.tsx`  
**Lines:** 50-70

```typescript
// Main heading and description text
```

### Mission & Vision
**File:** `app/about/page.tsx`  
**Lines:** 73-108

```typescript
// Line 81 - "What We Do"
// Lines 85-87 - Mission description
"We're building a digital bridge for Monroe. Our goal is simple: to bring all the amazing resources our town has to offer into one easy-to-use place, so no one has to struggle to find the help they need."

// Line 96 - "Our Dream"
// Lines 100-102 - Vision description
"We imagine a Monroe where everyone feels supported and connected. A town where help is just a click away, and where technology brings us closer together instead of driving us apart."
```

### Values Section
**File:** `app/about/page.tsx`  
**Lines:** 18-39

```typescript
const values = [
  {
    title: 'Community at Heart',
    description: 'We built this for our neighbors. Every feature is designed to help the people of Monroe.'
  },
  {
    title: 'Open to Everyone',
    description: 'No matter who you are or where you come from, these resources are here for you.'
  },
  {
    title: 'Always Improving',
    description: 'We use the latest tech to make finding help easier and faster for everyone.'
  },
  {
    title: 'Trustworthy',
    description: 'We care about accuracy. You can count on the information you find here.'
  }
];
```

### Team Section
**File:** `app/about/page.tsx`  
**Lines:** 8-15

```typescript
const team = [
  {
    name: 'Monroe High School TSA Chapter',
    role: 'Development Team',
    description: 'We are a group of students from Monroe High School who built this platform to give back to our community.',
  }
];
```

---

## 💼 Career Center Page (`app/career/page.tsx`)

### Hero Section
**File:** `app/career/page.tsx`  
**Lines:** 71-100

```typescript
// Main heading and description
```

### Features
**File:** `app/career/page.tsx`  
**Lines:** 7-29

```typescript
const features = [
  {
    title: 'AI Resume Builder',
    description: 'Create professional resumes with AI-powered suggestions for summaries, bullet points, and skills.',
  },
  {
    title: 'Job Application Assistant',
    description: 'Generate personalized cover letters and get interview questions tailored to specific job postings.',
  },
  {
    title: 'Local Job Board',
    description: 'Browse job opportunities in Monroe, NC and surrounding Union County area.',
  }
];
```

### Benefits List
**File:** `app/career/page.tsx`  
**Lines:** 31-40

```typescript
const benefits = [
  'AI-powered resume optimization',
  'Personalized cover letter generation',
  'Interview question preparation',
  'Local job opportunities',
  'Career guidance and tips',
  'Professional templates',
  'PDF export functionality',
  'Save and manage multiple resumes'
];
```

### Testimonials
**File:** `app/career/page.tsx`  
**Lines:** 42-64

```typescript
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Developer',
    company: 'Monroe Tech Solutions',
    content: 'The AI resume builder helped me land my dream job! The suggestions were spot-on and the cover letter generator saved me hours.',
  },
  // ... more testimonials
];
```

---

## 🎯 Footer (`components/layout/Footer.tsx`)

**File:** `components/layout/Footer.tsx`  
**Lines:** 18-134

```typescript
// Line 19 - Description
"Connecting Monroe, North Carolina residents with vital community resources, services, and opportunities to build a stronger, more supported community."

// Lines 24-34 - Contact information
"Monroe, North Carolina 28112"
"(704) 283-0000"
"info@monroeresourcehub.org"

// Lines 40-67 - Quick Links section
// Lines 72-105 - Services section
// Lines 113-127 - Footer bottom text
```

---

## 📋 Quick Reference

### Most Important Files to Edit:

1. **Homepage Hero Text**
   - File: `app/page.tsx`
   - Lines: 191-203

2. **Slideshow Images & Text**
   - File: `components/home/ImageSlideshow.tsx`
   - Lines: 10-44

3. **Category Descriptions**
   - File: `app/page.tsx`
   - Lines: 11-81

4. **Features Section**
   - File: `app/page.tsx`
   - Lines: 91-113

5. **About Page Content**
   - File: `app/about/page.tsx`
   - Lines: 8-108

6. **Footer Information**
   - File: `components/layout/Footer.tsx`
   - Lines: 18-134

---

## 🔧 How to Edit

1. Open the file in your code editor
2. Navigate to the line numbers shown above
3. Edit the text inside the quotes (strings)
4. Save the file
5. The changes will appear on your website

**Note:** Make sure to keep the quotes (`"`) around your text and maintain proper formatting!

