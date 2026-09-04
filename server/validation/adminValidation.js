
import { z } from 'zod';

export const verifyUserIdSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected'], 'Status must be either approved or rejected')
  })
});

export const replyToMessageSchema = z.object({
  body: z.object({
    reply: z.string().min(1, 'Reply content is required')
  })
});
