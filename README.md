# Monroe Resource Hub

A comprehensive community resource platform for Monroe, North Carolina, connecting residents with vital services, career opportunities, and local support.

## 🌟 Features

### Community Resources
- **Resource Directory**: Searchable database of local organizations and services
- **Smart Filtering**: Filter by category, services offered, and population served
- **Resource Submission**: Community-driven resource additions
- **Spotlight Features**: Highlighted community organizations

### Career Center
- **AI-Powered Resume Builder**: Create professional resumes with AI assistance
- **Job Application Assistant**: Generate personalized cover letters and interview prep
- **Local Job Board**: Browse opportunities in Monroe and Union County
- **Interview Preparation**: AI-generated interview questions and tips

### Community Features
- **Event Calendar**: Local community events and activities
- **Volunteer Opportunities**: Connect with local volunteer needs
- **Admin Dashboard**: Manage resources and submissions

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Google Gemini AI
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yatishgrandhe/Monroereasorcehub.git
cd monroe-resource-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_AI_API_KEY=your_gemini_api_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
monroe-resource-hub/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── career/            # Career center pages
│   ├── events/            # Events page
│   ├── resources/         # Resources directory
│   └── submit-resource/   # Resource submission
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Authentication components
│   ├── calendar/         # Event calendar
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── resources/        # Resource components
│   ├── resume/           # Career center components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
│   ├── ai/               # AI integration
│   ├── supabase/         # Database client
│   └── utils/            # Helper functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎨 Design System

The project uses a custom design system built with Tailwind CSS:

- **Primary Colors**: Blue theme for community focus
- **Secondary Colors**: Gray scale for content hierarchy
- **Typography**: Inter font family for readability
- **Components**: Consistent button, card, and form styles

## 🔧 Configuration

### Vercel Deployment

The project is configured for Vercel deployment with:
- Automatic builds on push to main branch
- Environment variable configuration
- Custom headers for security
- API route optimization

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Monroe High School TSA Chapter
- Monroe, North Carolina community
- Supabase for backend infrastructure
- Vercel for deployment platform

## 📞 Support

For support or questions about the Monroe Resource Hub, please contact the development team or create an issue in this repository.

---

Built with ❤️ for the Monroe, NC community