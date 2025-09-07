# ConceptCraft AI

**Define, Visualize, and Launch Your Business Idea**

ConceptCraft AI is a comprehensive web application that helps founders clarify their core business concept and visualize key strategic elements using AI. Built with React, TypeScript, and modern web technologies.

## 🚀 Features

### Core Features
- **Problem/Solution Fit Generator**: AI-powered tool that helps articulate clear and validated problem/solution statements
- **Target Customer Persona Builder**: Build detailed customer personas with AI assistance
- **AI-Assisted Lean Canvas**: Interactive Lean Canvas builder with AI suggestions for each section
- **AI Pitch Deck Generator**: Generate professional pitch deck slides based on your validated business concept

### Advanced Features
- **PDF Export**: Export your Lean Canvas and Pitch Deck as professional PDFs
- **JSON Export**: Export your business concepts as structured data
- **Subscription Management**: Tiered pricing with usage limits and premium features
- **Real-time Collaboration**: Team features for business tier users
- **Progress Tracking**: Visual progress indicators through the business development process

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: OpenAI GPT models via OpenRouter
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **PDF Generation**: jsPDF, html2canvas
- **Icons**: Lucide React
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (for backend services)
- OpenAI API key (for AI features)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-0006.git
cd this-is-a-0006
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your API keys:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_NAME=ConceptCraft AI
VITE_APP_VERSION=1.0.0
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `src/lib/supabase.ts` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.tsx    # Main app layout
│   ├── Dashboard.tsx   # User dashboard
│   ├── LandingPage.tsx # Marketing landing page
│   ├── PricingPage.tsx # Subscription pricing
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── AppContext.tsx  # Application state
├── lib/               # External service integrations
│   └── supabase.ts    # Supabase client and database functions
├── services/          # Business logic services
│   └── aiService.ts   # OpenAI integration
├── utils/             # Utility functions
│   ├── exportUtils.ts      # PDF/JSON export functions
│   └── subscriptionUtils.ts # Subscription management
└── ...
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: Blue (`hsl(210, 80%, 50%)`)
- **Accent**: Green (`hsl(160, 60%, 45%)`)
- **Background**: Light gray (`hsl(210, 20%, 95%)`)
- **Surface**: White (`hsl(0, 0%, 100%)`)

### Typography
- **Font**: Inter (Google Fonts)
- **Display**: 4xl, bold
- **Heading**: 2xl, semibold
- **Body**: base, normal

### Components
All components follow consistent patterns with variants for different use cases:
- Buttons (primary, secondary, outline)
- Cards (default, elevated)
- Inputs (text field, textarea, with label)

## 💳 Subscription Tiers

### Free Tier
- 1 Business Concept
- 1 Persona per concept
- 10 AI generations per month
- JSON export only

### Professional ($49/month)
- 10 Business Concepts
- 5 Personas per concept
- 500 AI generations per month
- PDF & JSON export
- Advanced AI features

### Business ($99/month)
- Unlimited Business Concepts
- Unlimited Personas
- Unlimited AI generations
- Team collaboration
- Priority support

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Error boundaries for error handling

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables
Make sure to set the following environment variables in your deployment platform:
- `VITE_OPENAI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📊 Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

### Users
- `user_id` (UUID, Primary Key)
- `email` (Text, Unique)
- `subscription_tier` (Text: 'free', 'pro', 'business')
- `created_at` (Timestamp)

### Business Concepts
- `concept_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `problem_statement` (Text)
- `solution_statement` (Text)
- `target_persona_description` (Text)
- `lean_canvas_data` (JSONB)
- `pitch_deck_slides_data` (JSONB)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Personas
- `persona_id` (UUID, Primary Key)
- `business_concept_id` (UUID, Foreign Key)
- `name` (Text)
- `demographics` (Text)
- `pain_points` (Text Array)
- `motivations` (Text Array)
- `behaviors` (Text Array)

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- User data isolation through RLS policies
- API key security through environment variables
- Input validation and sanitization
- Error boundary protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Email**: Contact support for premium users

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core AI-powered features
- ✅ Subscription management
- ✅ PDF/JSON export
- ✅ Responsive design

### Phase 2 (Next)
- [ ] Team collaboration features
- [ ] Advanced AI prompts and validation
- [ ] Integration with external tools (Slack, Notion)
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] White-label solutions
- [ ] API for third-party integrations
- [ ] Advanced analytics and insights
- [ ] Multi-language support

---

**Built with ❤️ for founders and entrepreneurs**
