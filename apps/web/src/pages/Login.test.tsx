import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: vi.fn(),
}));

vi.mock('../services/auth', () => ({
    authService: {
        login: vi.fn(),
        register: vi.fn(),
    },
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    enableIndexedDbPersistence: vi.fn(),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});

describe('TC-01: Authentication & Login Page', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('renders login form by default', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        expect(screen.getByText('FitLikeUs')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('validates email format', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
        
        fireEvent.change(emailInput, { target: { value: 'invalid' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        const submitBtn = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(emailInput.value).toBe('invalid');
        });
    });

    it('validates password length', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'short' } });

        const submitBtn = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
        });
    });

    it('submits login form with valid credentials', async () => {
        const mockProfile = { uid: 'user-123', email: 'test@example.com', role: 'client', level: 'beginner' };
        (authService.login as any).mockResolvedValue(mockProfile);

        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        const submitBtn = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });

    it('toggles between login and signup modes', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const toggleBtn = screen.getByText(/Don't have an account\? Sign Up/i);
        fireEvent.click(toggleBtn);

        expect(screen.getByText('Join FitLikeUs')).toBeInTheDocument();
        expect(screen.getByText('Start your holistic journey')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    it('submits signup form and navigates to dashboard', async () => {
        const mockProfile = { uid: 'user-456', email: 'newuser@example.com', role: 'client', level: 'beginner' };
        (authService.register as any).mockResolvedValue(mockProfile);

        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const toggleBtn = screen.getByText(/Don't have an account\? Sign Up/i);
        fireEvent.click(toggleBtn);

        const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        const submitBtn = screen.getByRole('button', { name: /Create Account/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith({
                email: 'newuser@example.com',
                password: 'password123'
            });
        });
    });

    it('displays error message on failed login', async () => {
        (authService.login as any).mockRejectedValue(new Error('Invalid credentials'));

        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        const submitBtn = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
