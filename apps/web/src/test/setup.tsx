import React from 'react';
import '@testing-library/jest-dom'
import * as rtl from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
} as any;

// Provide window.scrollTo for libraries that call it (framer-motion)
(global as any).scrollTo = () => {};

// Ensure chart containers have non-zero size in jsdom
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function () {
    try {
        const rect = originalGetBoundingClientRect ? originalGetBoundingClientRect.call(this) : { width: 0, height: 0 };
        return { width: rect.width || 800, height: rect.height || 400, top: 0, left: 0, bottom: (rect.height || 400), right: (rect.width || 800) } as DOMRect;
    } catch (e) {
        return { width: 800, height: 400, top: 0, left: 0, bottom: 400, right: 800 } as DOMRect;
    }
};

// Provide a default QueryClientProvider wrapper for all renders in tests
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const AllProviders = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { render: originalRender } = rtl as any;
function customRender(ui: any, options?: any) {
    return originalRender(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
