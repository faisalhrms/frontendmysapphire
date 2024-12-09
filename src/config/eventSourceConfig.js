import { EventSourcePolyfill } from 'event-source-polyfill';
import store from '@redux/store.jsx';

const createEventSource = (url) => {
    const state = store.getState();
    const token = state.auth.tokens.access_token;

    if (!token) {
        window.location.href = '/';
        return;
    }

    const eventSource = new EventSourcePolyfill(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    eventSource.onerror = function (error) {
        console.error('EventSource error:', error);
    };

    return eventSource;
};

export default createEventSource;
