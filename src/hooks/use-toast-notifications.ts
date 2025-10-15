import { toast } from 'sonner';

export const useToastNotifications = () => {
    const showSuccess = (message: string, description?: string) => {
        toast.success(message, {
            description,
            duration: 4000,
        });
    };

    const showError = (message: string, description?: string) => {
        toast.error(message, {
            description,
            duration: 5000,
        });
    };

    const showInfo = (message: string, description?: string) => {
        toast.info(message, {
            description,
            duration: 4000,
        });
    };

    const showWarning = (message: string, description?: string) => {
        toast.warning(message, {
            description,
            duration: 4000,
        });
    };

    const showLoading = (message: string, description?: string) => {
        return toast.loading(message, {
            description,
        });
    };

    const dismissToast = (toastId: string | number) => {
        toast.dismiss(toastId);
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showLoading,
        dismissToast,
    };
};

// Predefined toast messages for common actions
export const TOAST_MESSAGES = {
    GMAIL_CONFIG: {
        CREATED: 'Gmail configuration added successfully!',
        UPDATED: 'Gmail configuration updated successfully!',
        DELETED: 'Gmail configuration deleted successfully!',
        ACTIVATED: 'Configuration activated successfully!',
        DEACTIVATED: 'Configuration deactivated successfully!',
        TEST_SUCCESS: 'Test email sent successfully!',
        TEST_SUCCESS_DESC: 'Your Gmail configuration is working correctly.',
        TEST_FAILED: 'Test failed',
        INVALID_EMAIL: 'Please enter a valid test email address',
    },
    USERS: {
        UPLOAD_SUCCESS: 'Upload completed successfully!',
        UPLOAD_FAILED: 'Upload failed',
        UPLOAD_FAILED_DESC: 'An error occurred while uploading the CSV file.',
    },
    CAMPAIGNS: {
        STARTED: 'Campaign started successfully!',
        SCHEDULED: 'Campaign scheduled successfully!',
        FAILED: 'Campaign failed',
        FAILED_DESC: 'An error occurred while processing your campaign.',
        MISSING_FIELDS: 'Missing required fields',
        MISSING_FIELDS_DESC: 'Please fill in all required fields before sending the campaign.',
    },
    CATEGORIES: {
        CREATED: 'Category created successfully!',
        FAILED: 'Failed to create category',
        FAILED_DESC: 'An error occurred while creating the category.',
    },
    GENERAL: {
        NETWORK_ERROR: 'Network error occurred',
        NETWORK_ERROR_DESC: 'Please check your internet connection and try again.',
        UNEXPECTED_ERROR: 'An unexpected error occurred',
        UNEXPECTED_ERROR_DESC: 'Please try again or contact support if the problem persists.',
    },
};