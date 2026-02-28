import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from '../page';
import { createSubscriptionAction, validateCouponAction } from '@/app/actions/razorpayActions';
import { supabase } from '@/lib/supabaseClient';

// Mock Server Actions
vi.mock('@/app/actions/razorpayActions', () => ({
  createSubscriptionAction: vi.fn(),
  verifyPaymentAction: vi.fn(),
  validateCouponAction: vi.fn(),
}));

// Mock Config
vi.mock('@/app/config/razorpay-config', () => ({
  getStandardPlanId: vi.fn(() => 'std_plan_123'),
}));

// Mock Components that might cause issues in test environment
vi.mock('framer-motion', () => {
    const React = require('react');
    return {
        motion: {
            div: ({ children, className }) => React.createElement('div', { className }, children),
        },
        AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    };
});

vi.mock('@/components/checkout/FaqSection', () => {
    const React = require('react');
    return {
        default: () => React.createElement('div', { 'data-testid': 'faq-section' }, 'FAQ Section')
    };
});

vi.mock('@/components/checkout/StateSelector', () => {
    const React = require('react');
    return {
        default: ({ value, onChange }) => React.createElement(
            'select',
            { 'data-testid': 'state-selector', value, onChange: (e) => onChange(e.target.value) },
            React.createElement('option', { value: '' }, 'Select State'),
            React.createElement('option', { value: 'Delhi' }, 'Delhi'),
            React.createElement('option', { value: 'Maharashtra' }, 'Maharashtra')
        )
    };
});

vi.mock('@/components/checkout/ErrorDialog', () => {
    const React = require('react');
    return {
        default: ({ isOpen, title, message }) => isOpen ? React.createElement(
            'div',
            { 'data-testid': 'error-dialog' },
            React.createElement('h1', null, title),
            React.createElement('p', null, message)
        ) : null
    };
});

describe('CheckoutPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default Auth Mock: Logged In
        supabase.auth.getUser.mockResolvedValue({
            data: { user: { id: 'user_123', email: 'test@example.com' } }
        });
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { access_token: 'fake_token', user: { id: 'user_123' } } }
        });

        // Default Profile Mock
        supabase.from().select().eq().single.mockResolvedValue({
            data: {
                billing_address: {
                    fullName: 'John Doe',
                    address: '123 Main St',
                    city: 'Test City',
                    state: 'Delhi',
                    zipCode: '110001',
                    phoneNumber: '9876543210'
                }
            }
        });

        // Mock Razorpay on Window
        window.Razorpay = vi.fn().mockImplementation(() => ({
            on: vi.fn(),
            open: vi.fn(),
        }));
    });

    it('renders the checkout form pre-filled with user data', async () => {
        render(<CheckoutPage />);

        // Wait for auth check and data load
        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument(); // derived from split
            expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
        });
    });

    it('validates required fields before submission', async () => {
        // Mock empty profile to force manual entry
        supabase.from().select().eq().single.mockResolvedValue({ data: null });

        render(<CheckoutPage />);

        await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

        const submitBtn = screen.getByText(/Continue to Payment/i);
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('First name is required')).toBeInTheDocument();
            expect(screen.getByText('Address is required')).toBeInTheDocument();
        });
    });

    it('validates phone number format', async () => {
        supabase.from().select().eq().single.mockResolvedValue({ data: null });
        render(<CheckoutPage />);
        await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

        // Fill invalid phone
        const phoneInput = screen.getByPlaceholderText('0000000000');
        fireEvent.change(phoneInput, { target: { value: '123' } });

        const submitBtn = screen.getByText(/Continue to Payment/i);
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Phone number must be exactly 10 digits')).toBeInTheDocument();
        });
    });

    it('initiates subscription creation on valid submission', async () => {
        createSubscriptionAction.mockResolvedValue({
            success: true,
            subscriptionId: 'sub_123',
            keyId: 'key_123'
        });

        // Update mock to return "saved" so we don't trigger validation errors
        supabase.from().update.mockResolvedValue({ error: null });

        render(<CheckoutPage />);
        await waitFor(() => expect(screen.getByDisplayValue('John')).toBeInTheDocument());

        // Ensure all required fields are filled (pre-filled by mock)

        const submitBtn = screen.getByText(/Continue to Payment/i);
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(createSubscriptionAction).toHaveBeenCalled();
            // Check arguments: Plan Name (default Pro), Cycle (default monthly), Coupon (''), Token
            expect(createSubscriptionAction).toHaveBeenCalledWith('Pro', 'monthly', '', 'fake_token');
        });

        // Verify Razorpay open
        expect(window.Razorpay).toHaveBeenCalled();
    });

    it('handles coupon application', async () => {
        validateCouponAction.mockResolvedValue({
            valid: true,
            code: 'TEST20',
            percentOff: 20,
            type: 'discount'
        });

        render(<CheckoutPage />);
        await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

        // Open Coupon Field
        const toggle = screen.getByText(/Have a coupon code\?/i);
        fireEvent.click(toggle);

        const input = screen.getByPlaceholderText('Code');
        fireEvent.change(input, { target: { value: 'TEST20' } });

        const applyBtn = screen.getByText('Apply');
        fireEvent.click(applyBtn);

        await waitFor(() => {
            expect(validateCouponAction).toHaveBeenCalledWith('TEST20');
            expect(screen.getByText('TEST20 -20%')).toBeInTheDocument();
        });
    });

    it('shows error dialog if subscription creation fails with specific error', async () => {
        createSubscriptionAction.mockResolvedValue({
            success: false,
            error: 'You already have an active plan'
        });
        supabase.from().update.mockResolvedValue({ error: null });

        render(<CheckoutPage />);
        await waitFor(() => expect(screen.getByDisplayValue('John')).toBeInTheDocument());

        const submitBtn = screen.getByText(/Continue to Payment/i);
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByTestId('error-dialog')).toBeInTheDocument();
            expect(screen.getByText('Subscription Active')).toBeInTheDocument();
        });
    });
});
