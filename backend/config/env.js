import dotenv from 'dotenv';

dotenv.config({path: ".env.local"});

export const PORT = process.env.PORT;
export const SERVER_URL = process.env.SERVER_URL;
export const NODE_ENV = process.env.NODE_ENV;

export const DB_URI = process.env.DB_URI;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const ARCJET_KEY = process.env.ARCJET_KEY;
export const ARCJET_ENV = process.env.ARCJET_ENV;

export const QSTASH_URL = process.env.QSTASH_URL;
export const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;