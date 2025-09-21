import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).optional().default('3000'),
});

export type EnvSchema = z.infer<typeof envSchema>;
