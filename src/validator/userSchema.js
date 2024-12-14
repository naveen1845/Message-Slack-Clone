import z from 'zod';

export const userSingupSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string().min(3)
});

export const userSinginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
