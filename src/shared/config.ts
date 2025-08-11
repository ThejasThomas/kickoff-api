import dotenv from 'dotenv'
dotenv.config();

export const config = {
    cors: {
        ALLOWED_ORIGIN:process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:5173',

    },


    server: {
        PORT:process.env.PORT || 4000,
        NODE_ENV:process.env.NODE_ENV || 'development',
        
    },
    database: {
        URI:process.env.DATABASE_URI || '',
    },

    nodemailer: {
        EMAIL_USER:process.env.EMAIL_USER,
        EMAIL_PASS:process.env.EMAIL_PASS,
    },
    jwt: {
        ACCESS_SECRET_KEY: process.env.JWT_ACCESS_KEY || 'access-secret-key',
        ACCESS_EXPIRES_IN:process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        REFRESH_SECRET_KEY:process.env.JWT_REFRESH_KEY || 'refresh-secret-key',
        REFRESH_EXPIRES_IN:process.env.JWT_REFRESH_EXPIRES_IN || '14d',
        
    },
    OtpExpiry: process.env.OTP_EXPIRY_IN_MINUTES || "2",

    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),




}