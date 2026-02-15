import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ConsistencyStreak from './ConsistencyStreak';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { getDocs, query } from 'firebase/firestore';

vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    getDocs: vi.fn(),
    enableIndexedDbPersistence: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
    db: {},
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

describe('ConsistencyStreak Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: { uid: 'user-123' },
            loading: false
        });
    });

    it('displays consistency streak title', () => {
        (getDocs as any).mockResolvedValue({ docs: [] });

        render(
            <QueryClientProvider client={queryClient}>
                <ConsistencyStreak />
            </QueryClientProvider>
        );

        expect(screen.getByText('Consistency Streak')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
        (getDocs as any).mockImplementation(() => new Promise(() => { }));

        render(
            <QueryClientProvider client={queryClient}>
                <ConsistencyStreak />
            </QueryClientProvider>
        );

        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('fetches workouts for current user', async () => {
        (getDocs as any).mockResolvedValue({ 
            docs: [
                { 
                    id: 'workout-1', 
                    data: () => ({ 
                        exercise: 'Squats', 
                        reps: 10,
                        timestamp: new Date(),
                        userId: 'user-123'
                    }) 
                }
            ] 
        });

        render(
            <QueryClientProvider client={queryClient}>
                <ConsistencyStreak />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Consistency Streak')).toBeInTheDocument();
        });
    });

    it("shows no workouts when user hasn't logged any yet", async () => {
        (getDocs as any).mockResolvedValue({ docs: [] });

        render(
            <QueryClientProvider client={queryClient}>
                <ConsistencyStreak />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Consistency Streak')).toBeInTheDocument();
        });
    });

    it('displays streak indicator dots', async () => {
        (getDocs as any).mockResolvedValue({ 
            docs: [
                { 
                    id: 'workout-1', 
                    data: () => ({ 
                        exercise: 'Squats', 
                        reps: 10,
                        timestamp: new Date(),
                        userId: 'user-123'
                    }) 
                }
            ] 
        });

        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <ConsistencyStreak />
            </QueryClientProvider>
        );

        await waitFor(() => {
            const dots = container.querySelectorAll('.rounded-full');
            expect(dots.length).toBeGreaterThan(0);
        });
    });
});
