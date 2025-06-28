# Portfolio Website with Admin Panel

## Overview

This is a modern, full-stack portfolio website built with React and Express.js, featuring a cosmic/space-themed design. The application includes a public-facing portfolio site and an administrative panel for content management. The site showcases projects, skills, activities, pricing plans, and includes a contact form with message management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom cosmic theme variables
- **UI Components**: Radix UI components with shadcn/ui styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth animations and transitions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Database Provider**: Neon Database (serverless PostgreSQL)

### Build System
- **Build Tool**: Vite for fast development and optimized production builds
- **Development**: Hot module replacement with Vite middleware
- **Production**: ESBuild for server bundling, Vite for client bundling

## Key Components

### Database Schema
The application uses the following main entities:
- **Users**: Admin authentication (username/password)
- **Projects**: Portfolio projects with title, description, technologies, and links
- **Skills**: Technical skills categorized by type (Frontend/Backend/Database) with proficiency levels
- **Activities**: Personal activities and interests
- **Pricing Plans**: Service pricing with features and popular flags
- **Contact Messages**: Contact form submissions with read status
- **Site Settings**: Configurable site content (hero title, about text, contact info)

### Public Features
- **Hero Section**: Dynamic hero content with cosmic animations
- **About Section**: Personal information and mission statement
- **Skills Section**: Technical skills grouped by category with progress indicators
- **Projects Section**: Portfolio projects with live/GitHub links
- **Activities Section**: Personal interests and activities
- **Pricing Section**: Service offerings and pricing plans
- **Contact Section**: Contact form with social media links
- **Theme Support**: Light/dark theme toggle

### Admin Features
- **Authentication**: Secure admin login with JWT tokens
- **Content Management**: Full CRUD operations for all content types
- **Dashboard**: Tabbed interface for managing different content sections
- **Contact Management**: View and manage contact form submissions
- **Settings Management**: Update site-wide settings and content

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Authentication**: JWT tokens stored in localStorage, included in API requests
3. **Server Processing**: Express routes handle CRUD operations with Drizzle ORM
4. **Database Operations**: PostgreSQL database operations through Drizzle ORM
5. **Response Handling**: JSON responses processed by React Query and component updates

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database (serverless)
- **Authentication**: JWT for stateless authentication
- **UI Framework**: Radix UI primitives for accessible components
- **Animation**: Framer Motion for smooth transitions
- **Validation**: Zod for runtime type checking and validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code formatting and linting
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Drizzle push for schema synchronization

### Production
- **Build Process**: 
  - Frontend: Vite build outputs to `dist/public`
  - Backend: ESBuild bundles server to `dist/index.js`
- **Static Assets**: Express serves built frontend from `dist/public`
- **Environment**: NODE_ENV=production with optimized builds
- **Database**: Production PostgreSQL database with connection pooling

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment setting (development/production)

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```