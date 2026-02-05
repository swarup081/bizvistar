import { useState } from 'react';
import { submitOrder } from '@/app/actions/orderActions';
import { usePathname } from 'next/navigation';

export const useCheckout = ({ cartDetails, subtotal, shipping, total, clearCart }) => {
    const pathname = usePathname();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        note: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleStateChange = (value) => {
        setFormData(prev => ({ ...prev, state: value }));
        if (fieldErrors.state) {
            setFieldErrors(prev => ({ ...prev, state: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";

        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
        } else {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(formData.phone.trim())) {
                errors.phone = "Phone number must be exactly 10 digits";
            }
        }

        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";

        if (!formData.zipCode.trim()) {
             errors.zipCode = "ZIP Code is required";
        } else {
            const zipRegex = /^\d{6}$/;
            if (!zipRegex.test(formData.zipCode.trim())) {
                errors.zipCode = "ZIP code must be exactly 6 digits";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = async () => {
        setMessage('');
        if (!validateForm()) {
            setMessage("Please fix the highlighted errors before continuing.");
            return { success: false };
        }

        setIsSubmitting(true);

        try {
            const pathParts = pathname.split('/');
            let siteSlug = null;
            if (pathParts[1] === 'site') {
                siteSlug = pathParts[2];
            } else {
                 console.warn("Checkout is running in preview/template mode.");
            }

            if (!siteSlug && pathParts[1] !== 'site') {
                 setMessage('Cannot place real orders in Template Preview mode.');
                 setIsSubmitting(false);
                 return { success: false, error: 'Preview Mode' };
            }

            const result = await submitOrder({
                siteSlug,
                cartDetails,
                customerDetails: formData,
                totalAmount: total
            });

            if (result.success) {
                setMessage('Order placed successfully!');
                clearCart();
                return { success: true };
            } else {
                setMessage('Failed to place order: ' + result.error);
                return { success: false, error: result.error };
            }

        } catch (error) {
            setMessage('An unexpected error occurred.');
            console.error(error);
            return { success: false, error: error.message };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        fieldErrors,
        isSubmitting,
        message,
        handleChange,
        handleStateChange,
        submit
    };
};
