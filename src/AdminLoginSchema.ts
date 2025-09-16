import { z } from 'zod';

export const AdminLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});
