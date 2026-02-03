import express from 'express';
import { body, validationResult, param } from 'express-validator';
import auth from '../middleware/auth.js';
import admin from '../middleware/adminMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Message from '../models/Message.js';
import PlatformFee from "../models/PlatformFee.js";
import transporter from '../utils/mailer.js';

const router = express.Router();

// Transporter is now imported from ../utils/mailer.js

// Get all messages sent to admin
router.get('/messages', auth, admin, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .select('name email subject message attachments status createdAt');
    res.json({ success: true, messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ success: false, error: 'Server error fetching messages' });
  }
});

// Reply to a message
router.post(
  '/messages/:messageId/reply',
  auth,
  admin,
  [
    body('reply').notEmpty().withMessage('Reply message is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { reply } = req.body;
      const message = await Message.findById(req.params.messageId);
      if (!message) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      // Send email reply to the user
      const mailOptions = {
        to: message.email,
        subject: `Re: ${message.subject}`,
        html: `
          <p>Hi ${message.name},</p>
          <p>Thank you for your message. Here is our response:</p>
          <p>${reply}</p>
          <p>Best regards,<br/>Agrochain Ethiopia Team</p>
        `,
      };

      // Send email
      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error('❌ Error sending reply email:', emailErr.message);
        if (emailErr.statusCode === 403) {
          console.error("💡 TIP: Verify your domain at Resend.com to send to this address.");
        }
      }

      // Update message status
      message.status = 'replied';
      message.reply = reply; // Store reply in message document
      message.repliedAt = new Date();
      await message.save();

      res.json({
        success: true,
        message: 'Reply sent successfully',
        data: {
          messageId: message._id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          reply,
          status: message.status,
          createdAt: message.createdAt,
          repliedAt: message.repliedAt,
        },
      });
    } catch (err) {
      console.error('Error replying to message:', err);
      res.status(500).json({
        success: false,
        error: 'Server error replying to message'
      });
    }
  }
);

// Delete a message
router.delete(
  '/messages/:messageId',
  auth,
  admin,
  [
    param('messageId').notEmpty().withMessage('Message ID is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const message = await Message.findById(req.params.messageId);
      if (!message) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      // Optional: Notify user that their message was deleted
      try {
        await transporter.sendMail({
          to: message.email,
          subject: 'Your Message Has Been Removed',
          html: `
            <p>Hi ${message.name},</p>
            <p>Your message with subject "${message.subject}" has been removed by the admin.</p>
            <p>If you have questions, please contact our support team.</p>
            <p>Best regards,<br/>Agrochain Ethiopia Team</p>
          `,
        });
      } catch (emailErr) {
        console.error('Error sending deletion email:', emailErr);
      }

      // Delete the message
      await message.deleteOne();

      res.json({
        success: true,
        message: 'Message deleted successfully',
        messageId: req.params.messageId,
      });
    } catch (err) {
      console.error('Error deleting message:', err);
      res.status(500).json({ success: false, error: 'Server error deleting message' });
    }
  }
);


// Get pending government ID verifications
router.get('/verifications/pending', auth, admin, async (req, res) => {
  try {
    const pending = await User.find({ govIdStatus: 'pending' })
      .select('userId fullName email govIdFront govIdBack govIdStatus');
    res.json({ success: true, pending });
  } catch (err) {
    console.error('Error fetching pending verifications:', err);
    res.status(500).json({ success: false, error: 'Server error fetching pending verifications' });
  }
});

// Approve or ❌ Reject verification
router.patch('/verify/:userId', auth, admin, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Action must be "approve" or "reject"' });
    }

    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const status = action === 'approve' ? 'verified' : 'rejected';
    user.govIdStatus = status;
    user.verified = action === 'approve';

    await user.save();

    // Notify user via email
    try {
      await transporter.sendMail({
        to: user.email,
        subject: `ID Verification ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
          <p>Dear ${user.fullName},</p>
          <p>Your government ID verification has been ${status}.</p>
          <p>${status === 'approved'
            ? 'Your account is now fully verified.'
            : 'Please upload valid ID documents and try again.'
          }</p>
          <p>Best regards,<br/>Agrochain Ethiopia Team</p>
        `,
      });
    } catch (emailErr) {
      console.error('❌ Error sending verification email:', emailErr.message);
      if (emailErr.statusCode === 403) {
        console.error("💡 TIP: Verify your domain at Resend.com to send to this address.");
      }
    }

    res.json({
      success: true,
      message: `User ID verification ${status}`,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        verified: user.verified,
        govIdStatus: user.govIdStatus,
      },
    });
  } catch (err) {
    console.error('Error processing verification:', err);
    res.status(500).json({ success: false, error: 'Server error processing ID verification' });
  }
});

// 👤 Get all users
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp -otpExpires -govIdFront -govIdBack');
    res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, error: 'Server error fetching users' });
  }
});

// 👤 Get a single user profile
router.get('/users/:userId', auth, admin, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId })
      .select('-password -otp -otpExpires -govIdFront -govIdBack')
      .populate([
        'boughtProducts',
        'soldProducts',
        'postedProducts',
        'transactionHistory',
        'closeCustomers',
      ]);

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ success: false, error: 'Server error fetching user profile' });
  }
});

// Restrict or unrestrict a user
router.post('/users/:userId/restrict', auth, admin, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    user.isRestricted = !user.isRestricted;
    await user.save();

    res.json({
      success: true,
      message: `User has been ${user.isRestricted ? 'restricted' : 'unrestricted'}`,
      user,
    });
  } catch (err) {
    console.error('Error restricting user:', err);
    res.status(500).json({ success: false, error: 'Server error restricting user' });
  }
});

// Get all products
router.get('/products', auth, admin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: 'Server error fetching products' });
  }
});

// Delete a product
router.delete(
  '/products/:productId',
  auth,
  admin,
  [
    param('productId').notEmpty().withMessage('Product ID is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const product = await Product.findOne({ productId: req.params.productId });
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // Find the user who posted the product
      const user = await User.findOne({ userId: product.ownerUserId });
      if (user) {
        // Remove product from user's postedProducts (assuming it stores MongoDB _id)
        user.postedProducts = user.postedProducts.filter(
          (id) => id.toString() !== product._id.toString()
        );
        await user.save();

        // Notify user about product deletion
        try {
          await transporter.sendMail({
            to: user.email,
            subject: 'Your Product Has Been Removed',
            html: `
              <p>Dear ${user.fullName},</p>
              <p>Your product "${product.title}" has been removed by the admin.</p>
              <p>If you have any questions, please contact our support team.</p>
              <p>Best regards,<br/>Agrochain Ethiopia Team</p>
            `,
          });
        } catch (emailErr) {
          console.error('Error sending product deletion email:', emailErr.message);
        }
      }

      // Delete the product
      await product.deleteOne();

      res.json({
        success: true,
        message: 'Product deleted successfully',
        productId: req.params.productId,
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ success: false, error: 'Server error deleting product' });
    }
  }
);

// Get all transactions
router.get('/transactions', auth, admin, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ success: false, error: 'Server error fetching transactions' });
  }
});

// Suspicious users (basic filter example)
router.get('/users/suspicious', auth, admin, async (req, res) => {
  try {
    const suspiciousUsers = await User.find({
      $or: [{ balance: { $gt: 100000 } }, { rank: { $lt: -1 } }],
    }).select('-password -otp -otpExpires -govIdFront -govIdBack');

    res.json({ success: true, suspiciousUsers });
  } catch (err) {
    console.error('Error fetching suspicious users:', err);
    res.status(500).json({ success: false, error: 'Server error fetching suspicious users' });
  }
});

// -------------------- Make Admin (for dev only) --------------------
// Toggle admin status
router.post('/make-admin/:userId', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Toggle admin
    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      success: true,
      message: user.isAdmin ? 'User promoted to admin' : 'Admin privileges removed',
      user,
    });
  } catch (err) {
    console.error('Error toggling admin:', err);
    res.status(500).json({ success: false, error: 'Server error toggling admin' });
  }
});


router.get("/platform-fees", auth, admin, async (req, res) => {
  try {
    const fees = await PlatformFee.aggregate([
      {
        $group: {
          _id: null,
          totalFees: { $sum: "$feeAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalFees = fees.length > 0 ? fees[0].totalFees : 0;
    const feeCount = fees.length > 0 ? fees[0].count : 0;

    res.json({
      success: true,
      totalFees,
      feeCount,
    });
  } catch (error) {
    console.error("Error fetching platform fees:", error);
    res.status(500).json({ success: false, error: "Server error fetching platform fees" });
  }
});

export default router;