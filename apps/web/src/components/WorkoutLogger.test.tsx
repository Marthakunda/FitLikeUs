import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkoutLogger from '../components/WorkoutLogger';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { addDoc } from 'firebase/firestore';

vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(() => ({ _key: { path: { segments: ['workouts'] } } })),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp'),
    enableIndexedDbPersistence: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
    db: {},
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('TC-04: Body Loop (Workout Logger)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: { uid: 'user-123' },
            loading: false
        });
    });

    it('saves exercise to firestore with reps', async () => {
        (addDoc as any).mockResolvedValue({ id: 'workout-123' });

        render(
            <QueryClientProvider client={queryClient}>
                <WorkoutLogger />
            </QueryClientProvider>
        );

        const repsInput = screen.getByLabelText(/Reps\/Secs/i);
        fireEvent.change(repsInput, { target: { value: '20' } });

        const submitBtn = screen.getByRole('button', { name: /Log Workout/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    exercise: 'Squats',
                    reps: 20,
                    userId: 'user-123',
                    timestamp: 'mock-timestamp'
                })
            );
        });
    });
});
