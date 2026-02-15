import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import * as firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firestore.getFirestore(app);

// Enable offline persistence if available (guard for test mocks)
if (typeof window !== 'undefined') {
    const enable = (firestore as any).enableIndexedDbPersistence;
    if (typeof enable === 'function') {
        enable(db).catch((err: any) => {
            if (err?.code === 'failed-precondition') {
                console.warn('Firestore persistence failed: Multiple tabs open');
            } else if (err?.code === 'unimplemented') {
                console.warn('Firestore persistence failed: Browser not supported');
            }
        });
    }
}
