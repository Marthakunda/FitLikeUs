import { z } from 'zod';

/* ============================================================================
   AUTHENTICATION & ROLES
   ============================================================================ */
export const RoleSchema = z.enum(['admin', 'client']);
export type Role = z.infer<typeof RoleSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

/* ============================================================================
   USER PROFILE
   ============================================================================ */
export const UserPlanSchema = z.enum(['free', 'premium']);
export type UserPlan = z.infer<typeof UserPlanSchema>;

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  role: RoleSchema,
  displayName: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  plan: UserPlanSchema.default('free'),
  premiumExpiresAt: z.any().optional(), // Timestamp or null
  createdAt: z.any(),
  updatedAt: z.any().optional(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

/* ============================================================================
   WORKOUT & MOOD TRACKING
   ============================================================================ */
export const WorkoutSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  exercise: z.enum(['Squats', 'Pushups', 'Plank', 'Lunges']),
  reps: z.number().min(1).max(999),
  notes: z.string().optional(),
  timestamp: z.any(),
});
export type Workout = z.infer<typeof WorkoutSchema>;

export const MoodSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  workoutId: z.string(),
  score: z.number().min(1).max(10),
  notes: z.string().optional(),
  timestamp: z.any(),
});
export type Mood = z.infer<typeof MoodSchema>;

/* ============================================================================
   HABITS & STREAKS
   ============================================================================ */
export const HabitSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1),
  type: z.enum(['workout', 'mood', 'journal']),
  currentStreak: z.number().default(0),
  longestStreak: z.number().default(0),
  lastCompletedAt: z.any().optional(),
  createdAt: z.any(),
});
export type Habit = z.infer<typeof HabitSchema>;

export const StreakSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  habitId: z.string(),
  count: z.number().min(0),
  lastCompletedDate: z.string(), // YYYY-MM-DD
  title: z.string(),
});
export type Streak = z.infer<typeof StreakSchema>;

/* ============================================================================
   JOURNAL & RESOURCES
   ============================================================================ */
export const JournalEntrySchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  mood: z.number().min(1).max(10).optional(),
  workoutId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.any(),
  updatedAt: z.any().optional(),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const ResourceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string(),
  category: z.enum(['nutrition', 'training', 'recovery', 'mindset']),
  link: z.string().url().optional(),
  content: z.string().optional(),
  premium: z.boolean().default(false),
  createdAt: z.any(),
});
export type Resource = z.infer<typeof ResourceSchema>;

/* ============================================================================
   SUBSCRIPTION & PAYMENT
   ============================================================================ */
export const SubscriptionSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  plan: UserPlanSchema,
  status: z.enum(['active', 'cancelled', 'expired']),
  stripeSubscriptionId: z.string().optional(),
  currentPeriodStart: z.any(),
  currentPeriodEnd: z.any(),
  cancelledAt: z.any().optional(),
  createdAt: z.any(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;
