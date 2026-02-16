# Developer Reference Guide - FitLikeUs

## Quick Navigation

- [Architecture](#-architecture)
- [Key Files](#-key-files)
- [Component Tree](#-component-tree)
- [Data Flow](#-data-flow)
- [Common Tasks](#-common-tasks)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture

### Technology Stack
```
Frontend:
├── React 18.2 (UI framework)
├── Vite (Build tool)
├── TypeScript (Type safety)
├── Tailwind CSS (Styling)
├── React Hook Form (Form management)
├── Zod (Schema validation)
├── React Router v6 (Routing)
├── Framer Motion (Animations)
└── Lucide React (Icons)

Backend:
├── Firebase Auth (Authentication)
├── Firestore (Database)
└── Firebase Functions (Cloud logic)
```

### Project Structure
```
apps/web/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Firebase services
│   ├── lib/            # Utilities & helpers
│   ├── context/        # React context
│   ├── App.tsx         # Router setup
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

---

## 📄 Key Files

### Authentication Files

#### `src/services/auth.ts`
**Contains**: All Firebase authentication methods

```typescript
// Usage:
import { authService } from '../services/auth';

// Login
await authService.login({ email, password });

// Sign Up
await authService.register({ email, password, role: 'client' });

// Password Reset
await authService.sendPasswordReset(email);
await authService.resetPassword(code, newPassword);

// Logout
await authService.logout();
```

#### `src/lib/errorHandling.ts`
**Contains**: Error mapping and validation utilities

```typescript
// Usage:
import { mapFirebaseError, validatePassword } from '../lib/errorHandling';

// Map Firebase errors
try {
  // Firebase call
} catch (error) {
  const friendlyMessage = mapFirebaseError(error);
  // Display: "Incorrect password. Please try again."
}

// Validate password
const validation = validatePassword('MyPassword123!');
// Returns: { isValid: true, errors: [], score: 5 }
```

### Component Files

#### `src/components/Navbar.tsx`
**Provides**: Application navigation bar

```typescript
import Navbar from '../components/Navbar';

// Add to pages that need navigation:
<Navbar />
```

**Features**:
- Responsive (desktop menu + mobile hamburger)
- Current page highlighting
- User info display
- Logout button

#### `src/components/FitnessDataManager.tsx`
**Provides**: Complete CRUD interface for fitness entries

```typescript
import FitnessDataManager from '../components/FitnessDataManager';

// Add to any page:
<FitnessDataManager />
```

**Features**:
- Real-time Firestore listeners
- Add, edit, delete entries
- Stats dashboard
- Confirmation dialogs

#### `src/components/PasswordValidator.tsx`
**Provides**: Real-time password strength feedback

```typescript
import PasswordValidator from '../components/PasswordValidator';

const [password, setPassword] = useState('');

<PasswordValidator 
  password={password} 
  showGuidelines={true} 
/>
```

**Shows**:
- 5 requirement checklist
- Strength meter
- Color-coded feedback

### Page Files

#### `src/pages/Login.tsx`
- Email/password form
- "Forgot password" link
- "Sign up" link
- Error handling

#### `src/pages/SignUp.tsx`
- Email field
- Password field with validator
- Confirm password field
- Success confirmation screen

#### `src/pages/ForgotPassword.tsx`
- Email input form
- "Send reset email" button
- Success screen with instructions

#### `src/pages/ResetPassword.tsx`
- Extract code from URL
- Validate code
- Password form with requirements
- Success/error screens

#### `src/pages/Dashboard.tsx`
- Navbar integration
- Tab navigation (Overview/Manage)
- Original fitness components
- FitnessDataManager for CRUD

---

## 🌳 Component Tree

```
App
├── Navbar (on most pages)
├── Routes
│   ├── LoginPage
│   ├── SignUpPage
│   │   └── PasswordValidator
│   ├── ForgotPasswordPage
│   ├── ResetPasswordPage
│   │   └── PasswordValidator
│   ├── Dashboard
│   │   ├── Navbar
│   │   ├── Tab 1 (Overview)
│   │   │   ├── WorkoutLogger
│   │   │   ├── ConsistencyStreak
│   │   │   └── MoodSlider
│   │   └── Tab 2 (Manage Workouts)
│   │       └── FitnessDataManager
│   ├── AdminDashboard
│   └── Other Pages
└── OfflineBanner
```

---

## 📊 Data Flow

### Authentication Flow
```
User Input
    ↓
[Login/SignUp Page]
    ↓
Form Validation (Zod + Custom)
    ↓
Password Validation (if signup)
    ↓
authService.login() / authService.register()
    ↓
Firebase Auth API
    ↓
Success: Store in Auth state
     OR
Error: mapFirebaseError() → Show friendly message
    ↓
[useAuth Hook]
    ↓
App Routes & Component Rendering
```

### CRUD Data Flow
```
User Action (Add/Edit/Delete)
    ↓
FitnessDataManager
    ↓
Validation
    ↓
Firestore Operation (addDoc/updateDoc/deleteDoc)
    ↓
onSnapshot Listener (Real-time)
    ↓
State Update
    ↓
UI Rerender
    ↓
Success Toast Message
```

### Error Handling Flow
```
Firebase Error Thrown
    ↓
Catch Block
    ↓
mapFirebaseError(error)
    ↓
Map error code to friendly message:
  auth/wrong-password → "Incorrect password. Please try again."
    ↓
Display to User
    ↓
(No technical jargon exposed)
```

---

## 🎯 Common Tasks

### Adding a New Page

1. Create file in `src/pages/NewPage.tsx`:
```tsx
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NewPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Your content */}
      </main>
    </div>
  );
}
```

2. Add route to `src/App.tsx`:
```tsx
import NewPage from './pages/NewPage';

// In Router:
<Route
  path="/new-page"
  element={profile ? <NewPage /> : <Navigate to="/login" />}
/>
```

### Adding a New Component

1. Create `src/components/NewComponent.tsx`
2. Use TypeScript for props:
```tsx
interface NewComponentProps {
  title: string;
  onAction: () => void;
}

export default function NewComponent({ title, onAction }: NewComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

### Using New Color

1. Use Tailwind classes:
```tsx
// Button primary
<button className="btn-glow-primary">Primary</button>

// Text primary
<span className="text-brand-primary">Text</span>

// Background
<div className="bg-brand-primary/20">Content</div>

// Border
<div className="border-brand-primary">Content</div>
```

2. Or CSS variables:
```css
.my-class {
  color: var(--brand-primary);
  background: var(--brand-warning);
  border: 2px solid var(--bg-hover);
}
```

### Handling Firestore Data

1. Real-time listener:
```tsx
useEffect(() => {
  const q = query(
    collection(db, 'entries'),
    where('uid', '==', userId)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setData(data);
  });
  
  return () => unsubscribe(); // Cleanup
}, [userId]);
```

2. Add document:
```tsx
await addDoc(collection(db, 'entries'), {
  uid: userId,
  title: 'My Entry',
  createdAt: serverTimestamp()
});
```

3. Update document:
```tsx
await updateDoc(doc(db, 'entries', entryId), {
  title: 'Updated Title'
});
```

4. Delete document:
```tsx
await deleteDoc(doc(db, 'entries', entryId));
```

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8)
});

type FormData = z.infer<typeof schema>;

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  
  const onSubmit = (data: FormData) => {
    // data is validated
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🔧 Troubleshooting

### "Module not found" Error
**Solution**: Check import paths
```tsx
// ✅ Correct
import Navbar from '../components/Navbar';

// ❌ Wrong
import Navbar from './Navbar'; // Wrong path
import { Navbar } from '../components/Navbar'; // Not default export
```

### Type Error in TypeScript
**Solution**: Check component props types
```tsx
// ✅ Correct
interface Props {
  title: string;
  count: number;
}

// ❌ Wrong
interface Props {
  title: string;
}
// Then passing count prop causes error
```

### Color Not Changing
**Solution**: Clear cache and rebuild
```bash
# Clear Tailwind cache
rm -rf .next
pnpm build

# Check if color exists in tailwind.config.js
```

### Firestore Data Not Loading
**Solution**: Check:
1. User authentication (profile exists)
2. Firestore security rules allow access
3. Collection name matches exactly
4. Query conditions are correct

```tsx
// Debug:
console.log('User UID:', profile?.uid); // Should exist
console.log('Query:', query); // Check collection/where/etc
```

### Real-time Updates Not Working
**Solution**: Verify unsubscribe on cleanup
```tsx
useEffect(() => {
  const unsubscribe = onSnapshot(q, callback);
  return () => unsubscribe(); // IMPORTANT!
}, [dependencies]);
```

### Password Validator Not Showing
**Solution**: Check:
1. Component is imported
2. Password state is being updated
3. showGuidelines prop is true
3. Component receives password prop

```tsx
<PasswordValidator 
  password={passwordValue}  // Must be string
  showGuidelines={true}     // Must be true to show
/>
```

### Navbar Not Showing
**Solution**: Add to protected pages
```tsx
import Navbar from '../components/Navbar';

return (
  <div>
    <Navbar />  {/* Add this */}
    {/* Rest of page */}
  </div>
);
```

### Button Colors Wrong
**Solution**: Use correct classes
```tsx
// ✅ Correct
<button className="btn-glow-primary">Click</button>
<button className="btn-secondary">Click</button>

// ❌ Wrong
<button className="btn-glow-red">Click</button> // Old color
<button className="btn-red">Click</button> // Not a class
```

---

## 🔐 Security Notes

### Never Expose Firebase Keys
✅ Use environment variables:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

❌ Don't copy/paste keys in code

### Validate Passwords
✅ Always use validatePassword():
```tsx
const validation = validatePassword(password);
if (!validation.isValid) {
  // Show requirements to user
}
```

### Map Firebase Errors
✅ Always use mapFirebaseError():
```tsx
const message = mapFirebaseError(error);
setError(message); // Friendly message
```

❌ Don't show raw error codes

### Protect Routes
✅ Check authentication:
```tsx
<Route
  path="/dashboard"
  element={profile ? <Dashboard /> : <Navigate to="/login" />}
/>
```

---

## 📚 Useful Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Router Docs](https://reactrouter.com)

### Local Files
- [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) - Feature details
- [VISUAL_FEATURE_SUMMARY.md](./VISUAL_FEATURE_SUMMARY.md) - Visual guide
- [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) - Testing guide
- [DETAILED_CHANGELOG.md](./DETAILED_CHANGELOG.md) - All changes

---

## 🎯 Quick Checklist

Before committing code:
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No `any` types (except necessary)
- [ ] All imports correct
- [ ] Using brand-primary not neon-red
- [ ] All form inputs have labels
- [ ] All buttons have tooltips
- [ ] Error messages are user-friendly
- [ ] Loading states on async operations
- [ ] Responsive on mobile (320px, 768px, 1200px)

---

Happy coding! 🚀
