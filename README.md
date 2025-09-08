# AgentBox Showcase

A modern, full-stack AI agent management platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Home**: Comprehensive overview of agents, sandboxes, and team activities
- **Team Management**: Multi-team support with role-based access control
- **Template Library**: Pre-built agent templates for quick deployment
- **Sandbox Environment**: Isolated execution environments for testing
- **Theme System**: Light/Dark mode with system preference detection
- **Authentication**: Secure login, registration, and password management
- **Responsive Design**: Mobile-first approach with modern UI components

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Context API
- **Authentication**: Custom auth system with JWT
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── home/              # Home and sub-pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # Context providers
├── src/
│   ├── components/        # Reusable components
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   └── ui/           # UI components (Shadcn/ui)
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── types/            # TypeScript type definitions
│   ├── constants/        # Application constants
│   └── utils/            # Utility functions
├── public/               # Static assets
└── config files         # Configuration files
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agentbox-showcase
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
API_URL=https://api.agentbox.lingyiwanwu.com
NEXT_PUBLIC_API_URL=https://api.agentbox.lingyiwanwu.com

# Development
DEBUG_MODE=true
```

### Theme Configuration

The app supports light and dark themes with automatic system preference detection. Themes are managed through the `ThemeContext` and persisted in localStorage.

## 📱 Features Overview

### Home
- Real-time statistics and metrics
- Recent activity feed
- Team information display
- Popular templates showcase

### Team Management
- Multi-team workspace support
- Role-based permissions (Owner, Admin, Member)
- Team switching functionality
- Member management

### Templates
- Pre-built agent templates
- Category-based filtering
- Search functionality
- Usage statistics

### Authentication
- Secure login/registration
- Password reset functionality
- Protected routes
- Session management

## 🎨 UI Components

Built with Shadcn/ui components:
- Consistent design system
- Accessible components
- Dark/light theme support
- Responsive design

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team