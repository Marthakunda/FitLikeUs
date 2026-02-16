import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    sendPasswordResetEmail,
    confirmPasswordReset,
    verifyPasswordResetCode,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { LoginInput, UserProfile, UserProfileSchema, Role } from '@fitlikeus/shared';
import { mapFirebaseError, validatePassword } from '../lib/errorHandling';

export const authService = {
    async login({ email, password }: LoginInput): Promise<UserProfile> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return this.getUserProfile(userCredential.user.uid);
        } catch (error: any) {
            const friendlyMessage = mapFirebaseError(error);
            throw new Error(friendlyMessage);
        }
    },

    async register({ email, password, role = 'client' }: LoginInput & { role?: Role }): Promise<UserProfile> {
        try {
            // Validate password strength
            const validation = validatePassword(password);
            if (!validation.isValid) {
                throw new Error(`Password must contain: ${validation.errors.join(', ')}`);
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            const profile: UserProfile = {
                uid: user.uid,
                email: user.email!,
                role,
                level: 'beginner',
                plan: 'free',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'users', user.uid), profile);
            return profile;
        } catch (error: any) {
            const friendlyMessage = mapFirebaseError(error);
            throw new Error(friendlyMessage);
        }
    },

    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            const friendlyMessage = mapFirebaseError(error);
            throw new Error(friendlyMessage);
        }
    },

    async getUserProfile(uid: string): Promise<UserProfile> {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('User profile not found');
            }

            return UserProfileSchema.parse(docSnap.data());
        } catch (error: any) {
            const friendlyMessage = mapFirebaseError(error);
            throw new Error(friendlyMessage);
        }
    },

    /**
     * Send password reset email
     */
    async sendPasswordReset(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            const friendlyMessage = mapFirebaseError(error);
            throw new Error(friendlyMessage);
        }
    },

    /**
     * Verify password reset code
     */
    async verifyResetCode(code: string): Promise<string> {
        try {
            const email = await verifyPasswordResetCode(auth, code);
            return email;
        } catch (error: any) {
            const friendlyMessage = mapFirebaseError(error);
            throw new Error(friendlyMessage);
        }
    },

    /**
     * Confirm password reset with new password
     */
    async resetPassword(code: string, newPassword: string): Promise<void> {
        try {
            // Validate password strength
            const validation = validatePassword(newPassword);
            if (!validation.isValid) {
                throw new Error(`Password must contain: ${validation.errors.join(', ')}`);
            }

            await confirmPasswordReset(auth, code, newPassword);
        } catch (error: any) {
            const friendlyMessage = mapFirebaseError(error);
            throw new Error(friendlyMessage);
        }
    },

    onAuthChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    }
};

