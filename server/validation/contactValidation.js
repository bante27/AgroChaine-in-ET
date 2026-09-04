import { z } from 'zod';

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    subject: z.string().min(2, 'Subject is required'),
    message: z.string().min(5, 'Message must be at least 5 characters')
  })
});
