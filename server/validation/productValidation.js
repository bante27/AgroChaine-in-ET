import { z } from 'zod';

export const addProductSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    price: z.union([z.string(), z.number()]).transform(val => Number(val)),
    originAddress: z.string().min(2, 'Origin address is required'),
    type: z.string().min(2, 'Type is required'),
    quantity: z.union([z.string(), z.number()]).transform(val => Number(val)),
    description: z.string().optional(),
    comment: z.string().optional()
  })
});

export const addReviewSchema = z.object({
  body: z.object({
    comment: z.string().min(1, 'Comment is required')
  }),
  params: z.object({
    productId: z.string().min(1, 'Product ID is required')
  })
});

export const purchaseProductSchema = z.object({
  body: z.object({
    quantity: z.union([z.string(), z.number()]).optional().transform(val => val ? Number(val) : 1)
  }),
  params: z.object({
    productId: z.string().min(1, 'Product ID is required')
  })
});

export const productIdParamSchema = z.object({
  params: z.object({
    productId: z.string().min(1, 'Product ID is required')
  })
});

export const singleProductParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID or code is required')
  })
});
