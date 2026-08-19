import { NODE_ENV } from "./env.js";

const refreshCookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth/refresh-token'
};

export default refreshCookieOptions;