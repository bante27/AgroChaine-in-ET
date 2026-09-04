import Product from '../models/Product.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';
import AppError from '../utils/appError.js';

const generateProductId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

const findProductByIdOrCode = async (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const product = await Product.findById(id);
        if (product) return product;
    }
    return await Product.findOne({ productId: id });
};

class ProductService {
    async getAllProducts(query) {
        const { page = 1, limit = 20, search = "", type } = query;
        const filter = {};
        if (search) filter.title = { $regex: search, $options: "i" };
        if (type) filter.type = type;

        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const count = await Product.countDocuments(filter);
        return { page: parseInt(page), pages: Math.ceil(count / limit), total: count, products };
    }

    async getMyProducts(userId) {
        const user = await User.findOne({ userId }).populate('postedProducts');
        return user?.postedProducts || [];
    }

    async getSingleProduct(id) {
        const product = await findProductByIdOrCode(id);
        if (!product) throw new AppError("Product not found", 404);
        return product;
    }

    async addReview(productId, comment, user) {
        if (!comment) throw new AppError("Comment required", 400);

        const product = await findProductByIdOrCode(productId);
        if (!product) throw new AppError("Product not found", 404);

        product.reviews.push({ comment, userId: user.userId, userName: user.fullName, createdAt: new Date() });
        await product.save();
        return product;
    }

    async likeProduct(productId, userId) {
        const product = await findProductByIdOrCode(productId);
        if (!product) throw new AppError("Product not found", 404);

        product.likesCount += 1;
        await product.save();
        await User.findOneAndUpdate({ userId }, { $addToSet: { savedProducts: product._id } });
        return { likesCount: product.likesCount };
    }

    async unlikeProduct(productId, userId) {
        const product = await findProductByIdOrCode(productId);
        if (!product) throw new AppError("Product not found", 404);

        if (product.likesCount > 0) product.likesCount -= 1;
        await product.save();
        await User.findOneAndUpdate({ userId }, { $pull: { savedProducts: product._id } });
        return { likesCount: product.likesCount };
    }

    async addProduct(body, files, user) {
        const { title, price, originAddress, type, quantity, description, comment } = body;
        
        if (!title || !price || !originAddress || !type || !quantity) {
            throw new AppError("Missing required fields", 400);
        }

        const images = files ? files.map(f => f.path) : [];
        
        const newProduct = new Product({
            productId: generateProductId(),
            title, 
            price: Number(price), 
            originAddress, 
            type,
            initialQuantity: Number(quantity),
            quantityAvailable: Number(quantity),
            description, 
            comment, 
            images,
            ownerUserId: user.userId,
            ownerName: user.fullName,
        });

        await newProduct.save();

        await User.findOneAndUpdate(
            { userId: user.userId }, 
            { $push: { postedProducts: newProduct._id } }
        );

        return newProduct;
    }

    async purchaseProduct(productId, quantityInput) {
        const quantity = parseInt(quantityInput || 1);
        const product = await findProductByIdOrCode(productId);

        if (!product) throw new AppError("Product not found", 404);
        if (product.quantityAvailable < quantity) throw new AppError("Out of stock", 400);

        product.quantityAvailable -= quantity;
        await product.save();
        return { newQuantity: product.quantityAvailable };
    }

    async getMySoldProducts(user) {
        const sellerId = user.userId || user.id; 
        const salesHistory = await Transaction.find({
            sellerUserId: sellerId,
            status: { $in: ['delivered', 'completed'] }
        })
        .populate("productId")
        .sort({ date: -1 });

        const soldProducts = salesHistory
            .filter(item => item.productId !== null)
            .map(item => ({
                transactionId: item._id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                status: item.status,
                date: item.date,
                deliveryAddress: item.deliveryAddress,
                netSellerAmount: item.netSellerAmount,
                productDetails: item.productId 
            }));

        return { count: soldProducts.length, data: soldProducts };
    }
}

export default new ProductService();
