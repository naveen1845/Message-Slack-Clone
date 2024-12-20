import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const PROD_DB_URL = process.env.PROD_DB_URL;

export const DEV_DB_URL = process.env.DEV_DB_URL;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY || '1d';

export const MAIL_ID = process.env.MAIL_ID;

export const APP_PASSWORD = process.env.APP_PASSWORD;

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

export const REDIS_PORT = process.env.REDIS_PORT || 6379;
