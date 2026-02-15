# FitLikeUs Development Guide

## Project Overview

FitLikeUs is a holistic fitness web app for beginners combining physical training with mental discipline. Built with React, Vite, TypeScript, Tailwind CSS, and Firebase.

### Core Values
- **Holistic Approach**: Combines Body Loop (Workouts) with Mind Loop (Mood Tracking)
- **Beginner-Friendly**: Simple, intuitive UI with guidance and video demonstrations
- **Modern & Futuristic**: Glassmorphism design with neon accents (Emerald for Body, Blue for Mind)
- **Offline-First**: Full offline support with automatic sync

## Architecture

### Tech Stack (Golden Path)
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS 3 + Framer Motion
- **State Management**: React Query + Zustand
- **Database**: Firebase Firestore with offline persistence
- **Authentication**: Firebase Auth
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + React Testing Library
- **Monorepo**: PNPM + Turborepo

### Project Structure
```
apps/web/                    # Main React application
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ConsistencyStreak.tsx    # TC-xx: Graph visualization
│   │   ├── WorkoutLogger.tsx        # TC-04: Workout logging
│   │   ├── MoodSlider.tsx           # TC-07: Mood tracking
│   │   ├── VideoModal.tsx           # Exercise demonstrations
│   │   └── OfflineBanner.tsx        # TC-05: Offline indicator
│   ├── pages/               # Page components
│   │   ├── Login.tsx        # TC-01: Authentication
│   │   └── Dashboard.tsx    # Main interface
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Auth state management
│   │   └── useOnlineStatus.ts # Network detection
│   ├── services/            # Firebase services
│   │   └── auth.ts          # Authentication logic
│   ├── context/             # React Context
│   │   └── AuthContext.tsx  # Auth provider
│   └── lib/
│       └── firebase.ts      # Firebase initialization

packages/shared/             # Shared Zod schemas
├── schemas/
│   ├── auth.ts
│   └── models.ts
```

## Test Cases Implementation

### TC-01: Authentication & Beginner Level Assignment ✅
**Status**: Implemented and Tested

**Features**:
- User registration with email/password
- Automatic "beginner" level assignment to new users
- Email validation using Zod schema
- Password minimum length enforcement (6 characters)
- Role-based routing (admin → /admin/dashboard, client → /dashboard)
- User profile persistence in Firestore

**Files**:
- [src/pages/Login.tsx](src/pages/Login.tsx) - Login/signup form
- [src/services/auth.ts](src/services/auth.ts) - Auth logic
- [src/pages/Login.test.tsx](src/pages/Login.test.tsx) - Tests
- [src/services/auth.test.ts](src/services/auth.test.ts) - Service tests

**Key Code**:
```tsx
const profile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    role: 'client',
    level: 'beginner',  // Default level for new users
    createdAt: serverTimestamp(),
};
```

---

### TC-04: Body Loop (Workout Logger) ✅
**Status**: Implemented and Tested

**Features**:
- Exercise logging with Squats, Pushups, Plank, Lunges
- Rep/duration tracking
- Firestore persistence with serverTimestamp
- Video demonstrations for each exercise
- Real-time form validation
- Success feedback state

**Files**:
- [src/components/WorkoutLogger.tsx](src/components/WorkoutLogger.tsx)
- [src/components/WorkoutLogger.test.tsx](src/components/WorkoutLogger.test.tsx)
- [src/components/VideoModal.tsx](src/components/VideoModal.tsx)

**Firestore Structure**:
```typescript
Collection: workouts
{
  userId: string;           // User UID
  exercise: 'Squats' | 'Pushups' | 'Plank' | 'Lunges';
  reps: number;             // Reps or duration
  timestamp: FieldValue;    // serverTimestamp()
}
```

---

### TC-07: Mind Loop (Mood Slider) ✅
**Status**: Implemented and Tested

**Features**:
- Triggered immediately after workout completion
- 1-10 scale mood scoring (1=Tired, 10=Energized)
- Connects mood score to workout ID
- Firestore persistence with serverTimestamp
- Dynamic color feedback (Blue → Yellow gradient)
- Animated score display

**Files**:
- [src/components/MoodSlider.tsx](src/components/MoodSlider.tsx)
- [src/components/MoodSlider.test.tsx](src/components/MoodSlider.test.tsx)

**Firestore Structure**:
```typescript
Collection: moods
{
  userId: string;      // User UID
  workoutId: string;   // Reference to workout
  score: number;       // 1-10
  timestamp: FieldValue; // serverTimestamp()
}
```

---

### TC-05: Offline Mode ✅
**Status**: Implemented and Tested

**Features**:
- Automatic offline detection using `navigator.onLine`
- IndexedDB persistence enabled on Firebase Firestore
- Offline banner notification at top of screen
- Automatic sync when connection restored
- Works across all forms (workouts, moods)

**Files**:
- [src/lib/firebase.ts](src/lib/firebase.ts) - Firebase initialization
- [src/hooks/useOnlineStatus.ts](src/hooks/useOnlineStatus.ts)
- [src/components/OfflineBanner.tsx](src/components/OfflineBanner.tsx)
- [src/components/OfflineBanner.test.tsx](src/components/OfflineBanner.test.tsx)

**Firebase Configuration**:
```typescript
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.warn('Browser not supported');
    }
});
```

---

## Security

### Firestore Security Rules ✅
**Status**: Implemented and Enforced

**Key Principles**:
- Users can only read/write their own documents
- Admins have read-only access to all user data
- Enforced at database level: `request.auth.uid == userId`

**Rules File**: [firestore.rules](../../firestore.rules)

**Enforcement**:
```
match /workouts/{workoutId} {
  allow read: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow update, delete: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
}
```

---

## UI/UX Design

### Glassmorphism Components
All components feature:
- `backdrop-blur-xl` for depth
- `bg-white/5` to `bg-white/10` for transparency
- `border border-white/10` for definition
- Neon accents with gradient text
- Smooth hover transitions
- Animated gradients on interactions

### Color Scheme
- **Body Loop** (Workouts): Emerald (#10b981)
- **Mind Loop** (Mood): Blue (#0ea5e9)
- **Background**: Neutral-950 (#030712)
- **Accents**: Gradient overlays on hover

### Animations
- Entry animations with Framer Motion
- Hover state enhancements
- Success state visual feedback
- Loading spinner animations
- Smooth transitions on form interactions

---

## Testing Strategy

### Test Coverage

#### Unit Tests
- `auth.test.ts` - Authentication service
- `useAuth.test.ts` - Auth hook
- `WorkoutLogger.test.tsx` - Workout logging
- `MoodSlider.test.tsx` - Mood tracking
- `OfflineBanner.test.tsx` - Offline detection
- `ConsistencyStreak.test.tsx` - Graph visualization

#### Component Tests
- Form validation
- Firebase interactions (mocked)
- State management
- UI rendering

#### E2E Tests
- `auth.spec.ts` - Authentication flow
- Complete user journey (login → workout → mood)

### Running Tests
```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e

# In workspace root
pnpm run test (runs all packages)
```

### Mocking Strategy
- Firebase modules mocked in unit tests
- Auth state mocked for component tests
- React Query client configured with no retries for tests
- Vitest for fast execution

---

## Performance Considerations

### Optimization Goals
- **Target**: <1.5s load time on 4G networks
- **Code Splitting**: Lazy load route components
- **Image Optimization**: YouTube embed for videos
- **Caching**: React Query with persistent cache
- **Bundle Size**: Tree-shaking unused code

### React Query Configuration
```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,      // 5 minutes
            gcTime: 1000 * 60 * 30,        // 30 minutes
            retry: 1,
        },
    },
});
```

---

## Development Workflow

### Adding New Features
1. Start with TDD: Write tests first
2. Implement component/logic
3. Add TypeScript types
4. Apply Glassmorphism styling
5. Test with React Query mocks
6. Update Firestore rules if needed

### Code Style
- **Formatting**: Prettier (via ESLint)
- **Linting**: ESLint with React/TypeScript plugins
- **Types**: Strict TypeScript mode
- **Zod Validation**: For all data structures

### Making Changes
```bash
# Create branch
git checkout -b feat/feature-name

# Install dependencies (if needed)
pnpm install

# Run tests during development
pnpm test:watch

# Run linting
pnpm lint

# Build before commit
pnpm build
```

---

## Common Tasks

### Adding a New Component
```tsx
// 1. Create component file
// src/components/MyComponent.tsx

import { motion } from 'framer-motion';

interface Props {
  // Define props with TypeScript
}

export default function MyComponent({ }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10"
    >
      {/* Your content */}
    </motion.div>
  );
}

// 2. Create test file
// src/components/MyComponent.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

### Adding Firestore Collection Rules
```
// In firestore.rules
match /newCollection/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth.uid == resource.data.userId;
}
```

### Updating Zod Schemas
```typescript
// packages/shared/src/index.ts

export const MySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.instanceof(Date),
});

export type My = z.infer<typeof MySchema>;
```

---

## Troubleshooting

### Firebase Persistence Errors
**Issue**: "Failed precondition: multiple tabs open"
**Solution**: Close other browser tabs or use private/incognito window

### Test Failures
**Issue**: "Firebase not mocked"
**Solution**: Ensure all Firebase imports are mocked in test file

### Type Errors
**Issue**: "Type 'never' has no properties"
**Solution**: Add TypeScript generics or update type definitions

### Framer Motion Not Animating
**Issue**: Animations don't show
**Solution**: Ensure `AnimatePresence` wraps conditional renders

---

## Resources

### Documentation
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Framer Motion](https://www.framer.com/motion/)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod Validation](https://zod.dev/)

### Design System
- Material Design 3 (base)
- Glassmorphism (overlay)
- Neon accents (interactivity)

---

## Future Enhancements

### Q2 2025
- [ ] Social sharing of achievements
- [ ] Leaderboards and challenges
- [ ] Workout history heatmap
- [ ] Advanced mood analytics

### Q3 2025
- [ ] AI-powered workout recommendations
- [ ] Community features
- [ ] Mobile app (React Native)
- [ ] Admin dashboard enhancements

### Q4 2025
- [ ] Integration with fitness devices
- [ ] Nutrition tracking
- [ ] Personalized coaching AI
- [ ] Premium subscription tiers

---

**Last Updated**: February 14, 2026
**Maintainers**: FitLikeUs Team
**License**: Apache 2.0
