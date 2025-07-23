---
description: Repository Information Overview
alwaysApply: true
---

# Atractive Smithers Information

## Summary
A Next.js web application for browsing and searching memes, protecting IP through a centralized repository. The application allows users to search for memes and comments, with content stored in Cloudflare R2 storage.

## Structure
- `/src`: Main application code
  - `/app`: Next.js App Router pages and API routes
  - `/components`: Reusable UI components
  - `/lib`: Database and utility functions
  - `/types`: TypeScript type definitions
  - `/utils`: Helper utilities
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.x
**Framework**: Next.js 15.3.2
**Build System**: Next.js with Turbopack
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 19.0.0
- Next.js 15.3.2
- Prisma 6.8.1
- PostgreSQL (via pg 8.16.0)
- AWS SDK for S3 (for Cloudflare R2 storage)
- Chart.js 4.4.9
- Framer Motion 12.11.0
- TailwindCSS 3.4.1

## Build & Installation
```bash
# Install dependencies
npm install

# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Docker
**Dockerfile**: Dockerfile
**Base Image**: node:18-alpine
**Configuration**: Single-stage build process that installs dependencies, builds the application, and exposes port 3000

## Database
**Type**: PostgreSQL
**ORM**: Prisma
**Schema**: User, Post, Comment, and Multimedia models
**Connection**: Environment variable `DATABASE_URL`

## Storage
**Service**: Cloudflare R2
**Configuration**: Environment variables for R2 access
**Bucket**: "atractive-smithers"

## API Routes
**Random Content**: `/api/random` - Fetches random meme content
**Search**: Endpoints for searching posts and comments
**Data Models**: Structured around posts, comments, users, and multimedia

## Testing
No explicit testing framework configuration found in the repository.