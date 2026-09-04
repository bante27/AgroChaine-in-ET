import { z } from 'zod';

export const notificationIdSchema = z.object({
  params: z.object({
    notificationId: z.string().min(1, 'Notification ID is required')
  })
});
