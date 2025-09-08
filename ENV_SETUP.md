# Environment Variables Setup

This document explains how to configure environment variables for the AgentBox project.

## Environment Files

The project includes several environment files for different deployment scenarios:

### `.env.local` (Local Development)
- **Purpose**: Local development overrides
- **Priority**: Highest (overrides all other env files)
- **Usage**: Copy `.env.example` to `.env.local` and customize
- **Git**: Should be in `.gitignore` (contains sensitive data)

### `.env.development` (Development Environment)
- **Purpose**: Development environment defaults
- **Usage**: Used when `NODE_ENV=development`
- **Git**: Can be committed (no sensitive data)

### `.env.production` (Production Environment)
- **Purpose**: Production environment defaults
- **Usage**: Used when `NODE_ENV=production`
- **Git**: Can be committed (no sensitive data)

### `.env.example` (Template)
- **Purpose**: Template for other developers
- **Usage**: Copy to `.env.local` and fill in actual values
- **Git**: Should be committed

## Required Environment Variables

### API Configuration
```bash
# API endpoint for AgentBox backend
API_URL=https://api.agentbox.lingyiwanwu.com
NEXT_PUBLIC_API_URL=https://api.agentbox.lingyiwanwu.com
```

### App Configuration
```bash
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
NEXT_PUBLIC_APP_URL=https://agentbox.lingyiwanwu.com  # Production
```

### Authentication
```bash
# NextAuth.js configuration
NEXTAUTH_URL=http://localhost:3000  # Development
NEXTAUTH_URL=https://agentbox.lingyiwanwu.com  # Production
NEXTAUTH_SECRET=your-secret-key-here
```

### Feature Flags
```bash
# Enable/disable features
NEXT_PUBLIC_ENABLE_ANALYTICS=false  # Development
NEXT_PUBLIC_ENABLE_ANALYTICS=true   # Production
NEXT_PUBLIC_DEBUG_MODE=true         # Development
NEXT_PUBLIC_DEBUG_MODE=false        # Production
```

## Setup Instructions

### 1. Local Development
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your local values
nano .env.local
```

### 2. Production Deployment
```bash
# Set production environment variables
export NODE_ENV=production
export NEXTAUTH_SECRET=your-production-secret
export NEXT_PUBLIC_APP_URL=https://agentbox.lingyiwanwu.com
```

### 3. Environment Validation
```bash
# Check current environment
npm run env:check

# Validate environment variables
node -e "require('./src/lib/env').validateEnv()"
```

## Available Scripts

```bash
# Development with default environment
npm run dev

# Development with production environment
npm run dev:prod

# Build for development
npm run build:dev

# Build for production
npm run build

# Check environment
npm run env:check
```

## Environment Variable Types

### Server-side Variables
- `API_URL`: Backend API endpoint
- `NEXTAUTH_URL`: NextAuth.js URL
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `DATABASE_URL`: Database connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Client-side Variables (NEXT_PUBLIC_*)
- `NEXT_PUBLIC_API_URL`: Public API endpoint
- `NEXT_PUBLIC_APP_URL`: Public app URL
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable analytics
- `NEXT_PUBLIC_DEBUG_MODE`: Enable debug mode
- `NEXT_PUBLIC_ENABLE_SW`: Enable service worker

## Security Notes

1. **Never commit sensitive data** to version control
2. **Use strong secrets** for production
3. **Rotate secrets regularly** in production
4. **Use different secrets** for different environments
5. **Validate environment variables** on startup

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Check file naming (`.env.local`, not `.env.local.txt`)
   - Restart the development server
   - Check for typos in variable names

2. **API calls failing**
   - Verify `API_URL` is correct
   - Check network connectivity
   - Enable debug mode for more details

3. **Authentication issues**
   - Verify `NEXTAUTH_URL` matches your domain
   - Check `NEXTAUTH_SECRET` is set
   - Ensure OAuth credentials are correct

### Debug Mode
Enable debug mode to see detailed logs:
```bash
NEXT_PUBLIC_DEBUG_MODE=true npm run dev
```

## API Integration

The project is configured to use the AgentBox API at:
- **Development**: `https://api.agentbox.lingyiwanwu.com`
- **Production**: `https://api.agentbox.lingyiwanwu.com`

### API Endpoints
- `POST /user/sign-up` - User registration
- `POST /user/sign-in` - User login
- `POST /user/forgot-password` - Password reset request
- `POST /user/reset-password` - Password reset
- `PUT /user/update-password` - Update password
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /health` - Health check

### Fallback Mode
In development mode, if API calls fail, the app will fall back to demo mode for testing purposes.
