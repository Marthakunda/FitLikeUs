import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    doc: vi.fn(() => ({ path: 'users/user-123' })),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp'),
    enableIndexedDbPersistence: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
    auth: {},
    db: {},
}));

describe('TC-01: Authentication & Beginner Level', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('assigns beginner level to new users upon registration', async () => {
        const mockUser = { uid: 'user-123', email: 'newuser@example.com' };
        (createUserWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });
        (setDoc as any).mockResolvedValue({});

        const result = await authService.register({
            email: 'newuser@example.com',
            password: 'password123'
        });

        expect(result.level).toBe('beginner');
        expect(setDoc).toHaveBeenCalled();
        const callArgs = (setDoc as any).mock.calls[0];
        expect(callArgs[1]).toEqual(expect.objectContaining({
            uid: 'user-123',
            level: 'beginner',
            role: 'client',
            email: 'newuser@example.com'
        }));
    });
});
