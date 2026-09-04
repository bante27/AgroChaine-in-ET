import express from 'express';
import {
    getAllProducts,
    getMyProducts,
    getSingleProduct,
    addReview,
    likeProduct,
    unlikeProduct,
    addProduct,
    purchaseProduct,
    getMySoldProducts
} from '../controllers/productController.js';

import auth from '../middleware/auth.js';
import { productImageUpload } from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import {
    addProductSchema,
    addReviewSchema,
    purchaseProductSchema,
    productIdParamSchema,
    singleProductParamSchema
} from '../validation/productValidation.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/my-products', auth, getMyProducts);
router.get('/sold-products', auth, getMySoldProducts);
router.get('/:id', validate(singleProductParamSchema), getSingleProduct);

router.post('/', auth, productImageUpload.array("images", 5), validate(addProductSchema), addProduct);
router.post('/:productId/reviews', auth, validate(addReviewSchema), addReview);
router.post('/:productId/like', auth, validate(productIdParamSchema), likeProduct);
router.post('/:productId/unlike', auth, validate(productIdParamSchema), unlikeProduct);
router.post('/:productId/purchase', auth, validate(purchaseProductSchema), purchaseProduct);

export default router;
