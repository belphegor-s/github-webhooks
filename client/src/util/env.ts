const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

if(!BACKEND_URL) {
    throw `BACKEND_URL missing!`;
}

export { BACKEND_URL }