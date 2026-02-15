import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from './useAuth';
import { authService } from '../services/auth';

vi.mock('../services/auth', () => ({
    authService: {
        onAuthChanged: vi.fn(),
        getUserProfile: vi.fn(),
    },
}));

describe('useAuth Hook', () => {
    it('initializes with loading state', async () => {
        (authService.onAuthChanged as any).mockReturnValue(() => { });

        const { result } = renderHook(() => useAuth());

        expect(result.current.loading).toBe(true);
        expect(result.current.user).toBe(null);
    });

    it('sets user and profile when authenticated', async () => {
        const mockUser = { uid: '123' };
        const mockProfile = { uid: '123', email: 'test@test.com', role: 'client' };

        (authService.onAuthChanged as any).mockImplementation((callback: any) => {
            callback(mockUser);
            return () => { };
        });
        (authService.getUserProfile as any).mockResolvedValue(mockProfile);

        const { result } = renderHook(() => useAuth());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.profile).toEqual(mockProfile);
    });
});
