declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DATABASE_URL: string;
      SMTP_HOST: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
      SMTP_PORT: string;
      SMTP_SENDER: string;
      JWT_SECRET: string;
      SIGN_IN_URL: string;
      RESET_PASSWORD_URL: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
