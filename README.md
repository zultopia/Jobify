# JobMatch - AI-Powered Job Matching Platform

A comprehensive job matching website that helps users discover careers aligned with their personality, skills, and aspirations using AI-powered recommendations.

## Features

### 1. Landing Page
- Beautiful, modern landing page with feature highlights
- Easy navigation to sign up/login

### 2. Authentication
- User sign up and login functionality
- Session management using localStorage

### 3. Onboarding Flow
- **RIASEC Personality Test**: Complete Holland Code assessment to determine personality type (R, I, A, S, E, C)
- **Skills Test**: Add your skills and certificates
- **CV/Resume Upload**: Upload your CV/Resume (PDF, DOC, DOCX)
- **LinkedIn Integration**: Add your LinkedIn profile URL
- **Job Interests**: Select your preferred job types

### 4. AI Job Recommendations
- Personalized job recommendations based on RIASEC type and interests
- Multiple job options with detailed information:
  - Job description and responsibilities
  - Required skills
  - Salary ranges
  - Recommended companies (Google, Meta, Amazon, Microsoft, Apple, etc.)

### 5. Practice Interview
- AI-powered mock interview with camera integration
- Timed questions (2 minutes per question)
- Real-time video recording
- Detailed interview report with:
  - Overall score and completion rate
  - Strengths and areas for improvement
  - Movement analysis
  - Answer quality assessment
  - Personalized recommendations

### 6. Career Coaching
- Personalized career path recommendations based on RIASEC type
- Step-by-step guidance to achieve career goals
- Career development tips and advice
- AI-generated career advice

### 7. Connect to Companies
- Explore top companies (Google, Meta, Amazon, Microsoft, Apple)
- View company information and benefits
- Get personalized path to join each company
- Step-by-step action plan

### 8. Progress Tracking
- Visual progress tracking with charts
- Skills growth visualization
- Interview performance tracking
- Achievement tracking
- Motivation dashboard with statistics

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /page.tsx              # Landing page
  /login/page.tsx        # Login page
  /signup/page.tsx      # Sign up page
  /onboarding/page.tsx  # Onboarding flow
  /dashboard
    /page.tsx           # Main dashboard
    /jobs/page.tsx      # Job recommendations
    /interview/page.tsx # Practice interview
    /coaching/page.tsx  # Career coaching
    /companies/page.tsx # Company connections
    /progress/page.tsx  # Progress tracking
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Notes

- This is a frontend-only application using localStorage for data persistence
- No backend API is required - all functionality works client-side
- Camera permissions are required for the practice interview feature
- Data is stored in browser localStorage and will persist across sessions

## Features in Detail

### RIASEC Types
- **R (Realistic)**: Practical, hands-on, technical
- **I (Investigative)**: Analytical, research-oriented, scientific
- **A (Artistic)**: Creative, expressive, design-focused
- **S (Social)**: Helping, teaching, service-oriented
- **E (Enterprising)**: Leadership, business, sales
- **C (Conventional)**: Organized, administrative, detail-oriented

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to production:
```bash
vercel --prod
```

#### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your repository
5. Vercel will automatically detect Next.js and configure the build
6. Click "Deploy"

#### Option 3: Deploy via GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub account to Vercel
3. Select your repository
4. Vercel will automatically deploy on every push to main branch

### Build Configuration

The project includes `vercel.json` with the following configuration:
- Framework: Next.js
- Build Command: `npm run build`
- Install Command: `npm install`
- Region: Singapore (sin1) for better performance in Asia

### Environment Variables

This project doesn't require any environment variables as it uses client-side localStorage for data persistence.

### Post-Deployment

After deployment, your application will be available at:
- Production: `https://your-project-name.vercel.app`
- Preview: Automatic preview URLs for every commit

## License

This project is created for hackathon purposes.

