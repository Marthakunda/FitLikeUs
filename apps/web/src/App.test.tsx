import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'

// Mock Firebase to avoid initialization errors in smoke tests
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(() => ({})),
}))
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_auth, callback) => {
        callback(null) // Simulate no user logged in
        return vi.fn() // Unsubscribe function
    }),
}))
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
}))

const queryClient = new QueryClient()

describe('App Smoke Test', () => {
    it('renders progress text', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        )
        expect(screen.getByText(/FitLikeUs/i)).toBeInTheDocument()
    })
})
