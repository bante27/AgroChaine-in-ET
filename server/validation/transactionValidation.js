import { z } from 'zod';

export const buyProductSchema = z.object({
  body: z.object({
    orders: z.array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().positive('Quantity must be a positive integer')
      })
    ).min(1, 'At least one order is required'),
    deliveryAddress: z.string().min(2, 'Delivery address is required')
  })
});

export const transactionIdParamSchema = z.object({
  params: z.object({
    transactionId: z.string().min(1, 'Transaction ID is required')
  })
});
