import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '@fitlikeus/shared';
import { authService } from '../services/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthChanged(async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    const userProfile = await authService.getUserProfile(firebaseUser.uid);
                    setProfile(userProfile);
                } catch (error) {
                    console.error('Failed to fetch profile', error);
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, profile, loading };
};
