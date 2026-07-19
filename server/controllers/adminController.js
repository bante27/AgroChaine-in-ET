import User from '../models/User.js';
import Product from '../models/Product.js';
import Contact from '../models/Contact.js';
import PlatformFee from "../models/PlatformFee.js";
import transporter from '../utils/mailer.js';
import Transaction from "../models/Transaction.js";

// --- USER MANAGEMENT ---

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -otp -otpExpires').sort({ registrationDate: -1 });
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error fetching users' });
    }
};

export const toggleRestriction = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user.role === 'superadmin') {
            return res.status(403).json({ success: false, error: 'Cannot restrict the Super Admin' });
        }

        user.isRestricted = !user.isRestricted;
        await user.save();
        res.json({ success: true, isRestricted: user.isRestricted });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error toggling restriction' });
    }
};

export const liftRestriction = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        user.isRestricted = false;
        await user.save();
        res.json({ success: true, message: 'User restriction has been lifted.', isRestricted: false });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error lifting restriction' });
    }
};

export const toggleAdminStatus = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user.role === 'superadmin') {
            return res.status(400).json({ success: false, error: 'Cannot modify Super Admin role.' });
        }

        user.isAdmin = !user.isAdmin;
        user.role = user.isAdmin ? 'admin' : 'user';
        await user.save();
        res.json({ success: true, message: user.isAdmin ? 'Promoted to Admin' : 'Demoted to User', user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error toggling admin status' });
    }
};

// --- VERIFICATION MANAGEMENT ---

export const getPendingVerifications = async (req, res) => {
    try {
        const pending = await User.find(
            { govIdStatus: 'pending' }, 
            'userId fullName email govIdFront govIdBack govIdSelfie nationalIdNumber govIdStatus'
        );
        res.json({ success: true, pending });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error fetching verification data' });
    }
};

export const verifyUserId = async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const { userId } = req.params;
    
    try {
        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        // FIX: Update all related flags to ensure user doesn't get re-prompted
        user.govIdStatus = status; 
        user.verified = (status === 'approved');
        user.isVerified = (status === 'approved'); // Set boolean flag for easier frontend checks

        await user.save();
        res.json({ success: true, message: `User ${status} successfully`, status: user.govIdStatus });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during verification' });
    }
};

// --- PRODUCT & DATA MANAGEMENT ---

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        if (user.role === 'superadmin') return res.status(403).json({ success: false, error: 'Super Admin cannot be deleted.' });

        await Product.deleteMany({ ownerUserId: user.userId });
        await user.deleteOne();
        res.json({ success: true, message: 'User and their products deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error deleting user' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error fetching products' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.productId });
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

        await product.deleteOne();
        res.json({ success: true, message: 'Product successfully removed' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error deleting product' });
    }
};

export const getAllTransactionsForAdmin = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("productId", "name price images")
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
  }
};

// --- MESSAGES & STATS ---

export const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error fetching messages' });
    }
};

export const replyToMessage = async (req, res) => {
    const { reply } = req.body;
    try {
        const message = await Contact.findById(req.params.messageId);
        if (!message) return res.status(404).json({ success: false, error: 'Message not found' });

        await transporter.sendMail({
            to: message.email,
            subject: `Re: ${message.subject}`,
            html: `<p>${reply}</p><br><i>Original: ${message.message}</i>`
        });

        message.status = 'replied';
        message.reply = reply;
        message.repliedAt = new Date();
        await message.save();

        res.json({ success: true, message: 'Reply sent' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error sending reply' });
    }
};

export const getPlatformFees = async (req, res) => {
    try {
        const fees = await PlatformFee.aggregate([
            { $group: { _id: null, totalFees: { $sum: "$feeAmount" }, count: { $sum: 1 } } }
        ]);
        res.json({ success: true, totalFees: fees[0]?.totalFees || 0, count: fees[0]?.count || 0 });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error calculating fees' });
    }
};