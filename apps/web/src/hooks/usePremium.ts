import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '@fitlikeus/shared';

// Define premium features
type PremiumFeature = 'advanced-analytics' | 'advanced-workouts' | 'custom-programs' | 'nutrition-guidance' | 'priority-support';

const PREMIUM_FEATURES: Record<PremiumFeature, boolean> = {
  'advanced-analytics': true,
  'advanced-workouts': true,
  'custom-programs': true,
  'nutrition-guidance': true,
  'priority-support': true,
};

/**
 * Custom hook for managing premium features and subscription status.
 * Determines whether user has access to premium features based on subscription plan.
 *
 * @param userId - The user's Firebase UID
 * @returns Object containing premium status and feature access methods
 */
export const usePremium = (userId: string) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const docRef = doc(db, 'users', userId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return snapshot.data() as UserProfile;
    },
    enabled: !!userId,
  });

  /**
   * Determine if user has active premium subscription
   */
  const isPremium = (): boolean => {
    if (!profile) return false;
    if (profile.plan !== 'premium') return false;

    // Check if premium has expired
    if (profile.premiumExpiresAt) {
      const expiresAt = profile.premiumExpiresAt instanceof Timestamp
        ? profile.premiumExpiresAt.toDate()
        : new Date(profile.premiumExpiresAt);

      return expiresAt > new Date();
    }

    return true;
  };

  /**
   * Check if user has access to a specific feature
   */
  const hasFeatureAccess = (feature: PremiumFeature): boolean => {
    if (!PREMIUM_FEATURES[feature]) return true; // Feature is free for all users

    return isPremium();
  };

  /**
   * Get days remaining until premium expires
   */
  const getDaysUntilExpiry = (): number | null => {
    if (!profile?.premiumExpiresAt) return null;

    const expiresAt = profile.premiumExpiresAt instanceof Timestamp
      ? profile.premiumExpiresAt.toDate()
      : new Date(profile.premiumExpiresAt);

    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  return {
    isPremium: isPremium(),
    isLoading,
    plan: profile?.plan || 'free',
    hasFeatureAccess,
    getDaysUntilExpiry,
    daysUntilExpiry: getDaysUntilExpiry(),
  };
};
