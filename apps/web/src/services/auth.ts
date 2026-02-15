import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { LoginInput, UserProfile, UserProfileSchema, Role } from '@fitlikeus/shared';

export const authService = {
    async login({ email, password }: LoginInput): Promise<UserProfile> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return this.getUserProfile(userCredential.user.uid);
    },

    async register({ email, password, role = 'client' }: LoginInput & { role?: Role }): Promise<UserProfile> {
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
    },

    async logout(): Promise<void> {
        await signOut(auth);
    },

    async getUserProfile(uid: string): Promise<UserProfile> {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('User profile not found');
        }

        return UserProfileSchema.parse(docSnap.data());
    },

    onAuthChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    }
};
