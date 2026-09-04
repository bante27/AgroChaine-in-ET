
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import transporter from '../utils/mailer.js';
import crypto from 'crypto';

const pendingUsers = new Map();
const generateUserId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
};

class UserService {
    async register({ fullName, email, password, phone, address }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new AppError('Email already registered', 400);

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpExpires = Date.now() + 5 * 60 * 1000;

        pendingUsers.set(email, { fullName, email, password: hashedPassword, phone, address, userId: generateUserId(), otp: otpHash, otpExpires, isGoogleUser: false });

        transporter.sendMail({
            to: email,
            subject: 'Your OTP Code - Agrochain Ethiopia',
            html: `<p>Dear <strong>${fullName}</strong>,</p><p>Welcome to AgroChain Ethiopia! Please use the following OTP:</p><div style="background: #f4f4f4; padding: 25px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981; border: 1px dashed #10b981; margin: 20px 0;">${otp}</div><p style="color: #666; font-size: 14px;">This OTP will expire in 5 minutes.</p>`,
        }).catch(err => console.error('Registration OTP email failed:', err.message));

        return { message: 'OTP sent to email. Please verify to complete registration.' };
    }

    async resendOtp({ email }) {
        const pending = pendingUsers.get(email);
        if (!pending) throw new AppError('No pending registration found.', 400);

        const otp = generateOtp();
        pending.otp = await bcrypt.hash(otp, 10);
        pending.otpExpires = Date.now() + 5 * 60 * 1000;
        pendingUsers.set(email, pending);

        transporter.sendMail({
            to: email,
            subject: 'Your New OTP Code - Agrochain Ethiopia',
            html: `<p>Dear <strong>${pending.fullName}</strong>,</p><div style="background: #f4f4f4; padding: 25px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981; border: 1px dashed #10b981; margin: 20px 0;">${otp}</div>`,
        }).catch(err => console.error('Resend OTP failed:', err.message));

        return { message: 'A new OTP has been sent.' };
    }

    async verifyOtp({ email, otp }) {
        const pending = pendingUsers.get(email);
        if (!pending) throw new AppError('No OTP request found', 400);

        if (Date.now() > pending.otpExpires) {
            pendingUsers.delete(email);
            throw new AppError('OTP expired', 400);
        }

        const isValidOtp = await bcrypt.compare(otp, pending.otp);
        if (!isValidOtp) throw new AppError('Invalid OTP', 400);

        const newUser = new User({ ...pending, verified: true });
        await newUser.save();
        pendingUsers.delete(email);

        const token = jwt.sign({ id: newUser._id, userId: newUser.userId, fullName: newUser.fullName, role: newUser.role, isAdmin: newUser.isAdmin || false }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { token, user: newUser };
    }

    async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = jwt.sign(
            { id: user._id, userId: user.userId, role: user.role, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;
        return { token, user: userResponse };
    }

    async googleLogin({ email, fullName, name, profilePic, picture, imageUrl }) {
        const nameToUse = fullName || name;
        const picToUse = profilePic || picture || imageUrl;

        if (!email || !nameToUse) {
            throw new AppError('Required data missing. Ensure email and fullName are provided.', 400);
        }

        let user = await User.findOne({ email });
        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = new User({
                userId: generateUserId(),
                fullName: nameToUse,
                email,
                profilePic: picToUse || "",
                password: hashedPassword,
                phone: "Not Provided",
                address: "Not Provided",
                role: 'user',
                verified: true,
                govIdStatus: 'unverified',
                isGoogleUser: true
            });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, userId: user.userId, role: user.role, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;
        return { token, user: userResponse };
    }

    async getProfile(userId) {
        const user = await User.findOne({ userId })
            .select('-password -_id -__v -otp -otpExpires')
            .populate('postedProducts soldProducts boughtProducts savedProducts transactionHistory closeCustomers');
        if (!user) throw new AppError('User not found', 404);
        return user;
    }

    async updateProfile(userId, updateData) {
        const { fullName, phone, address, username, location, currentPassword, newPassword } = updateData;
        const user = await User.findOne({ userId });
        if (!user) throw new AppError('User not found', 404);

        if (newPassword) {
            if (!isStrongPassword(newPassword)) {
                throw new AppError('Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.', 400);
            }
            if (!user.isGoogleUser) {
                if (!currentPassword) throw new AppError('Current password is required.', 400);
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) throw new AppError('የድሮው ይለፍ ቃል የተሳሳተ ነው!', 400);
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }
        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (username) user.username = username;
        if (location) user.location = location;

        await user.save();
        const userResponse = user.toObject();
        delete userResponse.password;
        return { message: "ፕሮፋይልዎ በተሳካ ሁኔታ ተስተካክሏል!", user: userResponse };
    }

    async uploadProfilePic(userId, filePath) {
        if (!filePath) throw new AppError('No file uploaded', 400);
        const user = await User.findOneAndUpdate({ userId }, { profilePic: filePath }, { new: true });
        return { profilePic: user.profilePic };
    }

    async requestVerificationOtp(userId) {
        const user = await User.findOne({ userId });
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await transporter.sendMail({
            to: user.email,
            subject: 'AgroChain - National ID Verification Code',
            html: `<p>Hello <strong>${user.fullName}</strong>,</p><p>Verification code: <strong>${otp}</strong></p>`,
        });
        return { message: 'Verification code sent' };
    }

    async verifyId(userId, { nationalIdNumber, name }, files) {
        const user = await User.findOne({ userId });
        if (name) user.fullName = name;
        if (files) {
            if (files.govIdFront) user.govIdFront = files.govIdFront[0].path;
            if (files.govIdBack) user.govIdBack = files.govIdBack[0].path;
            if (files.govIdSelfie) user.govIdSelfie = files.govIdSelfie[0].path;
        }
        user.nationalIdNumber = nationalIdNumber;
        user.govIdStatus = 'pending';
        await user.save();
        return { message: 'Submitted for admin review' };
    }

    async addBalance(userId, amount) {
        const user = await User.findOne({ userId });
        user.balance += parseFloat(amount);
        await user.save();
        return { balance: user.balance };
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) throw new AppError('User not found', 404);

        const otp = generateOtp();
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset OTP',
            html: `<h3>Your OTP is: ${otp}</h3>`
        });

        return { message: 'OTP sent to email' };
    }

    async resetPassword({ email, otp, password }) {
        if (!isStrongPassword(password)) {
            throw new AppError('Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.', 400);
        }

        const user = await User.findOne({ email });
        if (!user || !user.otp || Date.now() > user.otpExpires) {
            throw new AppError('OTP expired or invalid', 400);
        }

        const isValid = await bcrypt.compare(otp, user.otp);
        if (!isValid) throw new AppError('Invalid OTP', 400);

        user.password = await bcrypt.hash(password, 10);
        user.otp = undefined;
        user.otpExpires = undefined;
        if (user.isGoogleUser) user.isGoogleUser = false;
        
        await user.save();

        const token = jwt.sign({ id: user._id, userId: user.userId, role: user.role, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const userResponse = user.toObject();
        delete userResponse.password;

        return { message: 'Password reset successful', token, user: userResponse };
    }
}

export default new UserService();
