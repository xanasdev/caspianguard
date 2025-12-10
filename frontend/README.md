# Caspian Sea Clean Map - Frontend

Interactive pollution tracking platform for the Caspian Sea coastal region.

## Features

- **Interactive Map**: Yandex Maps integration for marking pollution points
- **User Authentication**: JWT-based authentication with Django backend
- **Photo Upload**: Document pollution with images
- **Filtering**: Filter by pollution type and region
- **Statistics**: Dashboard with pollution analytics
- **Role-based Access**: Support for different user roles

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Maps**: Yandex Maps API
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with JWT interceptors
- **Backend**: Django REST Framework

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Django backend running on `http://localhost:8000`

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_YANDEX_MAPS_KEY=your_yandex_maps_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Backend Integration

### Django API Endpoints

**Authentication** (`/api/auth/`):
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login (returns JWT tokens)
- `POST /auth/token/refresh/` - Refresh access token
- `GET /auth/profile/` - Get current user profile

**Markers** (`/api/markers/`):
- `GET /api/markers/` - List all markers
- `POST /api/markers/` - Create new marker
- `GET /api/markers/{id}/` - Get marker details
- `PUT /api/markers/{id}/` - Update marker
- `DELETE /api/markers/{id}/` - Delete marker

**Pollution Types** (`/api/pollution-types/`):
- `GET /api/pollution-types/` - List all pollution types
- `POST /api/pollution-types/` - Create pollution type

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (main)/          # Main application pages
│   └── providers.tsx    # React Query provider
├── shared/
│   ├── api/            # API service layer
│   ├── components/     # Reusable components
│   │   ├── ui/        # shadcn components
│   │   ├── map/       # Map components
│   │   ├── pollution/ # Pollution-specific components
│   │   └── layout/    # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and axios instance
│   └── types/         # TypeScript types
```

## User Roles

### Citizens
- Report pollution points
- View pollution map
- Add photos and descriptions

### Activists
- All citizen features
- Update pollution status
- Access dashboard
- Export reports

### Administrators
- All activist features
- Delete pollution points
- Manage users

## API Integration

The app uses axios interceptors for:
- Automatic token injection
- 401 error handling
- Request/response logging

Services are organized by domain:
- `auth.service.ts`: Authentication
- `pollution.service.ts`: Pollution points CRUD

## Components

All components follow these principles:
- Maximum 100 lines per file
- Modular styling with Tailwind
- Clean, decomposed code
- No comments in production code
- shadcn/ui components where possible
