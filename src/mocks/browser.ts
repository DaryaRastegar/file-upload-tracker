import { setupWorker } from 'msw';
import { handlers } from './handlers';

// Set up the mock service worker to intercept network requests
export const worker = setupWorker(...handlers);
