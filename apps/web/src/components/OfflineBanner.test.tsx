import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import OfflineBanner from './OfflineBanner';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

vi.mock('../hooks/useOnlineStatus', () => ({
    useOnlineStatus: vi.fn(),
}));

describe('TC-05: Offline Mode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does not display offline banner when online', () => {
        (useOnlineStatus as any).mockReturnValue(true);

        const { container } = render(<OfflineBanner />);
        expect(container.textContent).toBe('');
    });

    it('displays offline banner when offline', () => {
        (useOnlineStatus as any).mockReturnValue(false);

        render(<OfflineBanner />);

        expect(screen.getByText('Offline Mode')).toBeInTheDocument();
        expect(screen.getByText(/Your progress will be saved offline and synced when you're back online/)).toBeInTheDocument();
    });

    it('shows offline icon in banner', () => {
        (useOnlineStatus as any).mockReturnValue(false);

        render(<OfflineBanner />);

        expect(screen.getByText('📡')).toBeInTheDocument();
    });

    it('banner is fixed positioned', () => {
        (useOnlineStatus as any).mockReturnValue(false);

        const { container } = render(<OfflineBanner />);
        const banner = container.querySelector('div');

        expect(banner).toHaveClass('fixed');
    });

    it('toggle visibility based on online status', () => {
        const mockUseOnlineStatus = useOnlineStatus as any;
        mockUseOnlineStatus.mockReturnValue(true);

        const { rerender } = render(<OfflineBanner />);
        expect(screen.queryByText('Offline Mode')).not.toBeInTheDocument();

        mockUseOnlineStatus.mockReturnValue(false);
        rerender(<OfflineBanner />);

        expect(screen.getByText('Offline Mode')).toBeInTheDocument();
    });
});
