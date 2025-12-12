# 📝 EDIT TEXT CONTENT HERE - Quick Reference

## ✅ Next.js Updated to 16.0.10

---

## 🏠 HOMEPAGE TEXT - Edit These Files:

### 1. Hero Section (Main Welcome Text)
**📁 File:** `app/page.tsx`  
**📍 Lines:** 191-203

```typescript
Line 193: "Bringing Monroe Together"  ← Change this badge text
Line 197: "Welcome to the Monroe"     ← Change main heading part 1
Line 198: "Resource Hub"              ← Change main heading part 2
Line 202: "Everything you need..."    ← Change description paragraph
Line 213: "What can we help..."       ← Change search placeholder
Line 220: "Explore Resources"         ← Change button 1
Line 221: "Share a Resource"          ← Change button 2
```

### 2. Stats Numbers & Labels
**📁 File:** `app/page.tsx`  
**📍 Lines:** 84-89

```typescript
{ label: 'Resources Listed', value: '50+' },    ← Change label & number
{ label: 'Ways to Help', value: '10' },         ← Change label & number
{ label: 'Events this Month', value: '15+' },   ← Change label & number
{ label: 'People Helped', value: '1000+' }      ← Change label & number
```

### 3. Image Slideshow Text
**📁 File:** `components/home/ImageSlideshow.tsx`  
**📍 Lines:** 10-44

```typescript
// Slide 1 (Line 14-15)
title: 'Building Community Together',
description: 'Monroe residents coming together to support each other'

// Slide 2 (Line 21-22)
title: 'Community Events',
description: 'Join us for local events and activities'

// Slide 3 (Line 28-29)
title: 'Healthcare Services',
description: 'Access quality healthcare in Monroe'

// Slide 4 (Line 35-36)
title: 'Education Resources',
description: 'Educational opportunities for all ages'

// Slide 5 (Line 42-43)
title: 'Food Assistance',
description: 'Supporting families with food resources'
```

### 4. Category Names & Descriptions
**📁 File:** `app/page.tsx`  
**📍 Lines:** 11-81

```typescript
// Each category has:
name: 'Food Assistance',                    ← Change category name
description: 'Food banks, pantries...',    ← Change description
```

### 5. Features Section
**📁 File:** `app/page.tsx`  
**📍 Lines:** 91-113

```typescript
// Feature 1 (Lines 94-97)
title: 'Find Help',
description: 'Easily search through our list...'

// Feature 2 (Lines 99-102)
title: 'Grow Your Career',
description: 'Use our free tools to build...'

// Feature 3 (Lines 104-107)
title: 'Join In',
description: 'See what\'s happening in town...'

// Feature 4 (Lines 109-112)
title: 'Give Back',
description: 'Find volunteer opportunities...'
```

### 6. Call to Action Section
**📁 File:** `app/page.tsx`  
**📍 Lines:** 380-395

```typescript
Line 384: "Ready to Get Started?"           ← Change heading
Lines 385-387: "Join thousands..."          ← Change description
Line 390: "Find Resources"                  ← Change button 1
Line 391: "Build Your Resume"                ← Change button 2
```

---

## 📄 ABOUT PAGE TEXT

**📁 File:** `app/about/page.tsx`

### Mission & Vision (Lines 85-102)
```typescript
Line 85-87: "We're building a digital bridge..."  ← Mission text
Line 100-102: "We imagine a Monroe..."            ← Vision text
```

### Values (Lines 18-39)
```typescript
// Edit each value's title and description
title: 'Community at Heart',
description: 'We built this for our neighbors...'
```

### Team Info (Lines 8-15)
```typescript
name: 'Monroe High School TSA Chapter',
role: 'Development Team',
description: 'We are a group of students...'
```

---

## 💼 CAREER PAGE TEXT

**📁 File:** `app/career/page.tsx`

### Features (Lines 7-29)
### Benefits (Lines 31-40)
### Testimonials (Lines 42-64)

---

## 🦶 FOOTER TEXT

**📁 File:** `components/layout/Footer.tsx`  
**📍 Lines:** 18-134

```typescript
Line 19: "Connecting Monroe, North Carolina..."  ← Main description
Line 25: "Monroe, North Carolina 28112"           ← Address
Line 29: "(704) 283-0000"                         ← Phone
Line 33: "info@monroeresourcehub.org"             ← Email
```

---

## 🎯 QUICK EDIT STEPS:

1. **Open the file** listed above
2. **Go to the line number** shown
3. **Find the text** in quotes `"like this"`
4. **Change the text** inside the quotes
5. **Save the file**
6. **See changes** on your website!

---

## 📌 MOST COMMON EDITS:

- **Homepage Hero:** `app/page.tsx` lines 191-203
- **Slideshow:** `components/home/ImageSlideshow.tsx` lines 10-44
- **Categories:** `app/page.tsx` lines 11-81
- **Footer:** `components/layout/Footer.tsx` lines 18-134

