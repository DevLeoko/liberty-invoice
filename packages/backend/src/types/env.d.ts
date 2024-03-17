declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      SMTP_PORT: string
      DATABASE_URL: string
      SMTP_HOST: string
      SMTP_USERNAME: string
      SMTP_PASSWORD: string
      SMTP_PORT: string
      SMTP_SENDER: string
      SMTP_SENDER_MAIL: string;
      JWT_SECRET: string
      RECAPTCHA_SECRET_KEY: string
      SIGN_IN_URL: string
      RESET_PASSWORD_URL: string
      SUBSCRIPTION_RETURN_URL: string;
      CORS_ORIGIN: string
      BACKEND_URL: string;
      FILE_STORAGE_PATH: string
      STRIPE_PUBLIC_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      STRIPE_PLUS_SUBSCRIPTION_MONTHLY: string;
      STRIPE_PLUS_SUBSCRIPTION_YEARLY: string;
      GOOGLE_AUTH_CLIENT_ID: string
    }
  }
}

export {}
