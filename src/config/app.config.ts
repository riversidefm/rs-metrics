export const appConfig = () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
});

export type AppConfig = ReturnType<typeof appConfig>;
