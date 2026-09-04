/**
 * Normalize API URL to ensure it has the correct protocol
 * Render Blueprint fromService.property.host returns just the hostname without protocol
 */
export const getApiUrl = () => {
    const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // If the URL doesn't start with http:// or https://, prepend https://
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        return `https://${rawUrl}`;
    }

    return rawUrl;
};

export const API_URL = getApiUrl();
