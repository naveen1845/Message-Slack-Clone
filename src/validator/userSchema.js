import z from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string().min(3)
});
