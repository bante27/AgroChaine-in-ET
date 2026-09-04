import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Please provide a message to proceed.')
  })
});
