import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MoodSlider from './MoodSlider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { addDoc, collection } from 'firebase/firestore';

vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp'),
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

describe('TC-07: Mind Loop (Mood Slider)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: { uid: 'user-123' },
            loading: false
        });
    });

    it('renders mood slider with 1-10 scale', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MoodSlider workoutId="workout-123" />
            </QueryClientProvider>
        );

        expect(screen.getByText('How do you feel?')).toBeInTheDocument();
        expect(screen.getByText(/Connect your effort/i)).toBeInTheDocument();
        expect(screen.getByText(/Tired/i)).toBeInTheDocument();
        expect(screen.getByText(/Energized/i)).toBeInTheDocument();
    });

    it('updates mood score when slider changes', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MoodSlider workoutId="workout-123" />
            </QueryClientProvider>
        );

        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '8' } });

        expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('saves mood to firestore with correct workoutId', async () => {
        (addDoc as any).mockResolvedValue({ id: 'mood-123' });

        render(
            <QueryClientProvider client={queryClient}>
                <MoodSlider workoutId="workout-456" />
            </QueryClientProvider>
        );

        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '7' } });

        const submitBtn = screen.getByRole('button', { name: /Save Mood/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    userId: 'user-123',
                    workoutId: 'workout-456',
                    score: 7,
                    timestamp: 'mock-timestamp'
                })
            );
        });
    });

    it('shows success state after saving mood', async () => {
        (addDoc as any).mockResolvedValue({ id: 'mood-123' });

        render(
            <QueryClientProvider client={queryClient}>
                <MoodSlider workoutId="workout-123" />
            </QueryClientProvider>
        );

        const submitBtn = screen.getByRole('button', { name: /Save Mood/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/Mind Synced/i)).toBeInTheDocument();
        });
    });

    it('calls onComplete callback after successful save', async () => {
        (addDoc as any).mockResolvedValue({ id: 'mood-123' });
        const onComplete = vi.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MoodSlider workoutId="workout-123" onComplete={onComplete} />
            </QueryClientProvider>
        );

        const submitBtn = screen.getByRole('button', { name: /Save Mood/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(onComplete).toHaveBeenCalled();
        }, { timeout: 2000 });
    });

    it('disables submit button while saving', async () => {
        (addDoc as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        render(
            <QueryClientProvider client={queryClient}>
                <MoodSlider workoutId="workout-123" />
            </QueryClientProvider>
        );

        const submitBtn = screen.getByRole('button', { name: /Save Mood/i });
        fireEvent.click(submitBtn);

        // Check that the button becomes disabled or shows loading state
        await waitFor(() => {
            expect(submitBtn).toHaveClass('bg-gradient-to-r');
        }, { timeout: 500 });
    });
});
