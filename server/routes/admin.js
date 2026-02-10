import express from 'express';
import { body, validationResult, param } from 'express-validator';
import auth from '../middleware/auth.js';
import admin from '../middleware/adminMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Contact from '../models/Contact.js';
import Message from '../models/Message.js';
import PlatformFee from "../models/PlatformFee.js";
import transporter from '../utils/mailer.js';

const router = express.Router();

// Transporter is now imported from ../utils/mailer.js

// Get all messages sent to admin
router.get('/messages', auth, admin, async (req, res) => {
  try {
    const messages = await Contact.find()
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
      const message = await Contact.findById(req.params.messageId);
      if (!message) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      // Send email reply to the user
      const mailOptions = {
        to: message.email,
        bcc: process.env.EMAIL_USER, // Send a copy to the admin
        replyTo: process.env.EMAIL_USER, // Allow user to reply
        subject: `Re: ${message.subject}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; text-align: center;">
              <h2 style="margin: 0;">Message from AgroChain Ethiopia</h2>
            </div>
            <div style="padding: 30px; background: #ffffff;">
              <p style="font-size: 16px; color: #111827; margin-top: 0;">Hi ${message.name},</p>
              <p style="color: #374151; line-height: 1.6;">Thank you for contacting us. Here is our official response to your inquiry:</p>
              
              <div style="margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0; line-height: 1.6; color: #111827; white-space: pre-wrap;">${reply}</p>
              </div>

              <p style="color: #6b7280; font-size: 14px;">If you have any further questions, please feel free to reach out.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                <p style="margin: 0; color: #111827; font-weight: bold;">Best Regards,</p>
                <p style="margin: 4px 0 0; color: #10b981; font-weight: 600;">AgroChain Ethiopia Team</p>
              </div>

              <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
                <strong>Original Message Snapshot:</strong><br>
                <div style="margin-top: 8px; font-style: italic;">
                  "${message.message}"
                </div>
              </div>
            </div>
            <div style="background: #f9fafb; padding: 15px; text-align: center; color: #9ca3af; font-size: 11px;">
              Addis Ababa | +251 985 076 701 | sales@agrochain.et
            </div>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Reply sent to ${message.email}`);
      } catch (emailErr) {
        console.error('❌ Error sending reply email:', emailErr);
        // Don't fail the request, but log it.
        // If needed, we could return a warning, but UI usually expects success.
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

// Mark a message as read
router.patch('/messages/:messageId/read', auth, admin, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    // Only update if it's currently pending
    if (message.status === 'pending') {
      message.status = 'replied'; // Or add a 'read' status if you prefer
      await message.save();
    }

    res.json({ success: true, message: 'Message marked as read' });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

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

      const message = await Contact.findById(req.params.messageId);
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