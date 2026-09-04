
import User from '../models/User.js';
import Product from '../models/Product.js';
import Contact from '../models/Contact.js';
import PlatformFee from '../models/PlatformFee.js';
import Transaction from '../models/Transaction.js';
import transporter from '../utils/mailer.js';
import AppError from '../utils/appError.js';

class AdminService {
    async getAllUsers() {
        return await User.find({}, '-password -otp -otpExpires').sort({ registrationDate: -1 });
    }

    async toggleRestriction(userId) {
        const user = await User.findOne({ userId });
        if (!user) throw new AppError('User not found', 404);
        if (user.role === 'superadmin') throw new AppError('Cannot restrict the Super Admin', 403);

        user.isRestricted = !user.isRestricted;
        await user.save();
        return { isRestricted: user.isRestricted };
    }

    async liftRestriction(userId) {
        const user = await User.findOne({ userId });
        if (!user) throw new AppError('User not found', 404);

        user.isRestricted = false;
        await user.save();
        return { message: 'User restriction has been lifted.', isRestricted: false };
    }

    async toggleAdminStatus(userId) {
        const user = await User.findOne({ userId });
        if (!user) throw new AppError('User not found', 404);
        if (user.role === 'superadmin') throw new AppError('Cannot modify Super Admin role.', 400);

        user.isAdmin = !user.isAdmin;
        user.role = user.isAdmin ? 'admin' : 'user';
        await user.save();
        return { message: user.isAdmin ? 'Promoted to Admin' : 'Demoted to User', user };
    }

    async getPendingVerifications() {
        return await User.find(
            { govIdStatus: 'pending' }, 
            'userId fullName email govIdFront govIdBack govIdSelfie nationalIdNumber govIdStatus'
        );
    }

    async verifyUserId(userId, status) {
        const user = await User.findOne({ userId });
        if (!user) throw new AppError('User not found', 404);

        user.govIdStatus = status; 
        user.verified = (status === 'approved');
        user.isVerified = (status === 'approved');

        await user.save();
        return { message: `User ${status} successfully`, status: user.govIdStatus };
    }

    async deleteUser(userId) {
        const user = await User.findOne({ userId });
        if (!user) throw new AppError('User not found', 404);
        if (user.role === 'superadmin') throw new AppError('Super Admin cannot be deleted.', 403);

        await Product.deleteMany({ ownerUserId: user.userId });
        await user.deleteOne();
        return { message: 'User and their products deleted' };
    }

    async getAllProducts() {
        return await Product.find().sort({ createdAt: -1 });
    }

    async deleteProduct(productId) {
        const product = await Product.findOne({ productId });
        if (!product) throw new AppError('Product not found', 404);

        await product.deleteOne();
        return { message: 'Product successfully removed' };
    }

    async getAllTransactionsForAdmin() {
        const transactions = await Transaction.find()
            .populate("productId", "name price images")
            .sort({ date: -1 });
        return { count: transactions.length, data: transactions };
    }

    async getMessages() {
        return await Contact.find().sort({ createdAt: -1 });
    }

    async replyToMessage(messageId, reply) {
        const message = await Contact.findById(messageId);
        if (!message) throw new AppError('Message not found', 404);

        await transporter.sendMail({
            to: message.email,
            subject: `Re: ${message.subject}`,
            html: `<p>${reply}</p><br><i>Original: ${message.message}</i>`
        });

        message.status = 'replied';
        message.reply = reply;
        message.repliedAt = new Date();
        await message.save();
        return { message: 'Reply sent' };
    }

    async getPlatformFees() {
        const fees = await PlatformFee.aggregate([
            { $group: { _id: null, totalFees: { $sum: "$feeAmount" }, count: { $sum: 1 } } }
        ]);
        return { totalFees: fees[0]?.totalFees || 0, count: fees[0]?.count || 0 };
    }
}

export default new AdminService();
