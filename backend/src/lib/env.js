import "dotenv/config";

export const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    RESND_API_KEY: process.env.RESEND_API_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API: process.env.CLOUD_API,
    CLOUD_SECRET: process.env.CLOUD_SECRET,
    ARCJET_KEY: process.env.ARCJET_KEY,
    ARCJET_ENV: process.env.ARCJET_ENV,
    CLIENT_URL:process.env.CLIENT_URL
}