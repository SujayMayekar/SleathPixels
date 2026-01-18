# SteganoSafe

## Overview

SteganoSafe is a client-side steganography application that allows users to hide encrypted messages within images. The app uses LSB (Least Significant Bit) pixel manipulation to embed AES-256 encrypted text into image files. All processing happens entirely in the browser - no data is ever sent to a server, ensuring complete privacy.

Key capabilities:
- Encode secret messages into PNG/JPEG images
- Decode hidden messages from steganographic images
- AES-256 password-based encryption before embedding
- Real-time capacity meter showing how much data an image can hold
- Session history stored in browser localStorage

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom build script for production
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom cyber/cryptographic theme
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and UI effects
- **State Management**: React hooks with localStorage for persistence

### Core Steganography Logic
- All encoding/decoding runs client-side using HTML5 Canvas API
- CryptoJS library handles AES-256 encryption/decryption
- LSB algorithm modifies the least significant bits of RGB pixel values
- Custom delimiter marks end of hidden message data

### Backend Architecture
- Express server exists but is minimal - primarily serves static files
- The application is designed to work as a purely static site (deployable to Netlify)
- Drizzle ORM is configured but database functionality is optional/unused for core features

### Design Patterns
- Custom hooks pattern for steganography logic (`use-steganography.ts`)
- Component composition with Radix UI primitives
- CSS variables for theming with HSL color system
- Path aliases (`@/`, `@shared/`) for clean imports

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives (dialogs, tooltips, tabs, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Cryptography
- **CryptoJS**: AES-256 encryption for message security before embedding

### Data & Forms
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **TanStack Query**: Server state management (available but minimal use)

### Build & Development
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server bundling for production
- **TypeScript**: Type safety across the codebase

### Database (Optional)
- **Drizzle ORM**: Database toolkit (configured but not essential for core functionality)
- **PostgreSQL**: Database option via `connect-pg-simple` (for session storage if needed)