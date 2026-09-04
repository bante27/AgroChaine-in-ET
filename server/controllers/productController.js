import productService from '../services/productService.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllProducts = catchAsync(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    res.json({ success: true, ...result });
});

export const getMyProducts = catchAsync(async (req, res) => {
    const products = await productService.getMyProducts(req.user.userId);
    res.json({ success: true, products });
});

export const getSingleProduct = catchAsync(async (req, res) => {
    const product = await productService.getSingleProduct(req.params.id);
    res.json({ success: true, product });
});

export const addReview = catchAsync(async (req, res) => {
    const product = await productService.addReview(req.params.productId, req.body.comment, req.user);
    res.status(201).json({ success: true, product });
});

export const likeProduct = catchAsync(async (req, res) => {
    const result = await productService.likeProduct(req.params.productId, req.user.userId);
    res.json({ success: true, ...result });
});

export const unlikeProduct = catchAsync(async (req, res) => {
    const result = await productService.unlikeProduct(req.params.productId, req.user.userId);
    res.json({ success: true, ...result });
});

export const addProduct = catchAsync(async (req, res) => {
    const product = await productService.addProduct(req.body, req.files, req.user);
    res.status(201).json({ success: true, product });
});

export const purchaseProduct = catchAsync(async (req, res) => {
    const result = await productService.purchaseProduct(req.params.productId, req.body.quantity);
    res.json({ success: true, ...result });
});

export const getMySoldProducts = catchAsync(async (req, res) => {
    const result = await productService.getMySoldProducts(req.user);
    res.status(200).json({ success: true, ...result });
});
