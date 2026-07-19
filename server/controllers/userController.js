import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import transporter from '../utils/mailer.js';
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto'; // For generating secure random data

// Temporary memory for OTP
const pendingUsers = new Map();

// Utilities
const generateUserId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🔒 ➕ ጠንካራ የይለፍ ቃል መኖሩን የሚያረጋግጥ የ Regex ማጣሪያ ፈንክሽን
const isStrongPassword = (password) => {
    // ቢያንስ: 8 ርዝመት, 1 ካፒታል, 1 አነስተኛ ፊደል, 1 ቁጥር, 1 ልዩ ምልክት
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. Regular Local Register
export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

    try {
        const { fullName, email, password, phone, address } = req.body;

        // 🔒 [የደህንነት ፍተሻ] የይለፍ ቃሉ ጠንካራ መሆኑን ማረጋገጥ
        if (!isStrongPassword(password)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).' 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, error: 'Email already registered' });

        const userId = generateUserId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpExpires = Date.now() + 5 * 60 * 1000;

        pendingUsers.set(email, { fullName, email, password: hashedPassword, phone, address, userId, otp: otpHash, otpExpires, isGoogleUser: false });

        (async () => {
            try {
                await transporter.sendMail({
                    to: email,
                    subject: 'Your OTP Code - Agrochain Ethiopia',
                    html: `<p>Dear <strong>${fullName}</strong>,</p><p>Welcome to AgroChain Ethiopia! Please use the following OTP:</p><div style="background: #f4f4f4; padding: 25px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981; border: 1px dashed #10b981; margin: 20px 0;">${otp}</div><p style="color: #666; font-size: 14px;">This OTP will expire in 5 minutes.</p>`,
                });
            } catch (emailErr) {
                console.error(`Registration OTP email failed:`, emailErr.message);
            }
        })();

        res.status(200).json({ success: true, message: 'OTP sent to email. Please verify to complete registration.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during registration' });
    }
};

// 2. Resend Register OTP
export const resendOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

    try {
        const { email } = req.body;
        const pending = pendingUsers.get(email);
        if (!pending) return res.status(400).json({ success: false, error: 'No pending registration found.' });

        const otp = generateOtp();
        pending.otp = await bcrypt.hash(otp, 10);
        pending.otpExpires = Date.now() + 5 * 60 * 1000;
        pendingUsers.set(email, pending);

        (async () => {
            try {
                await transporter.sendMail({
                    to: email,
                    subject: 'Your New OTP Code - Agrochain Ethiopia',
                    html: `<p>Dear <strong>${pending.fullName}</strong>,</p><div style="background: #f4f4f4; padding: 25px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981; border: 1px dashed #10b981; margin: 20px 0;">${otp}</div>`,
                });
            } catch (emailErr) { console.error(`Resend OTP failed:`, emailErr.message); }
        })();

        res.status(200).json({ success: true, message: 'A new OTP has been sent.' });
    } catch (err) { res.status(500).json({ success: false, error: 'Server error resending OTP' }); }
};

// 3. Verify Local Register OTP
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const pending = pendingUsers.get(email);
    if (!pending) return res.status(400).json({ success: false, error: 'No OTP request found' });

    if (Date.now() > pending.otpExpires) {
        pendingUsers.delete(email);
        return res.status(400).json({ success: false, error: 'OTP expired' });
    }

    const isValidOtp = await bcrypt.compare(otp, pending.otp);
    if (!isValidOtp) return res.status(400).json({ success: false, error: 'Invalid OTP' });

    // Mark as verified on local signup complete
    const newUser = new User({ ...pending, verified: true });
    await newUser.save();
    pendingUsers.delete(email);

    const token = jwt.sign({ id: newUser._id, userId: newUser.userId, fullName: newUser.fullName, role: newUser.role, isAdmin: newUser.isAdmin || false }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user: newUser });
};

// 4. Local User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });

        // 2. Validate user existence and password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid email or password' 
            });
        }

        // 3. Generate Token
        const token = jwt.sign(
            { 
                id: user._id,          
                userId: user.userId,
                role: user.role, 
                isAdmin: user.isAdmin 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // 4. Prepare response (remove password for security)
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ 
            success: true, 
            token, 
            user: userResponse 
        });

    } catch (err) { 
        console.error('Login Error:', err.message);
        res.status(500).json({ 
            success: false, 
            error: 'An internal server error occurred during login' 
        }); 
    }
};

// 5. ✨ ➕ Google Login API (With Profile State & Password Reset Handling)
export const googleLogin = async (req, res) => {
    try {
        // 🔎 ከተለያዩ የጉግል ሪስፖንስ ስሞች ጋር እንዲጣጣም ማስተካከል (Fallback keys)
        const email = req.body.email;
        const fullName = req.body.fullName || req.body.name; 
        const profilePic = req.body.profilePic || req.body.picture || req.body.imageUrl;

        // የደህንነት ፍተሻ፦ ዳታው ጠቅላላ ካልመጣ ቀድሞ ማቆም
        if (!email || !fullName) {
            return res.status(400).json({ 
                success: false, 
                error: "Required data missing. Ensure email and fullName are sent correctly from frontend." 
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log("New Google user detected. Registering...");
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = new User({
                userId: generateUserId(),
                fullName: fullName,
                email: email,
                profilePic: profilePic || "", 
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

        res.status(200).json({ success: true, token, user: userResponse });
    } catch (error) {
        console.error("Google Auth Backend Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 6. Profiles & Extra Actions
export const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId })
            .select('-password -_id -__v -otp -otpExpires')
            .populate('postedProducts soldProducts boughtProducts savedProducts transactionHistory closeCustomers');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, user });
    } catch (err) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const updateProfile = async (req, res) => {
    try {
        // ✨ አሁን ተጠቃሚው የይለፍ ቃል መቀየር ከፈለገ የድሮ ፓስወርድ መፈተሻ እዚህ ተካቷል
        const { fullName, phone, address, username, location, currentPassword, newPassword } = req.body;
        
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        // 🔐 ፓስወርድ ለመቀየር ከተሞከረ የደህንነት ፍተሻ
        if (newPassword) {
            if (!isStrongPassword(newPassword)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.' 
                });
            }

            // መደበኛ ተጠቃሚ ከሆነ የድሮውን ፓስወርድ ማረጋገጥ አለበት
            if (!user.isGoogleUser) {
                if (!currentPassword) return res.status(400).json({ success: false, error: 'Current password is required.' });
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) return res.status(400).json({ success: false, error: 'የድሮው ይለፍ ቃል የተሳሳተ ነው!' });
            }

            // አዲሱን ፓስወርድ ሃሽ አድርጎ መተካት
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // የሌሎች መረጃዎች ማሻሻያ (Profile states)
        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (username) user.username = username;
        if (location) user.location = location;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ success: true, message: "ፕሮፋይልዎ በተሳካ ሁኔታ ተስተካክሏል!", user: userResponse });
    } catch (err) { res.status(500).json({ success: false, error: 'Update error' }); }
};

export const uploadProfilePic = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const user = await User.findOneAndUpdate({ userId: req.user.userId }, { profilePic: req.file.path }, { new: true });
    res.json({ success: true, profilePic: user.profilePic });
};

export const requestVerificationOtp = async (req, res) => {
    const user = await User.findOne({ userId: req.user.userId });
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
        to: user.email,
        subject: 'AgroChain - National ID Verification Code',
        html: `<p>Hello <strong>${user.fullName}</strong>,</p><p>Verification code: <strong>${otp}</strong></p>`,
    });
    res.json({ success: true, message: 'Verification code sent' });
};

export const verifyId = async (req, res) => {
    const { nationalIdNumber, name, otpCode } = req.body;
    const user = await User.findOne({ userId: req.user.userId });
    
    if (name) user.fullName = name;
    user.govIdFront = req.files.govIdFront[0].path;
    user.govIdBack = req.files.govIdBack[0].path;
    user.govIdSelfie = req.files.govIdSelfie[0].path;
    user.nationalIdNumber = nationalIdNumber;
    user.govIdStatus = 'pending';
    
    await user.save();
    res.json({ success: true, message: 'Submitted for admin review' });
};

export const addBalance = async (req, res) => {
    const { amount } = req.body;
    const user = await User.findOne({ userId: req.user.userId });
    user.balance += parseFloat(amount);
    await user.save();
    res.json({ success: true, balance: user.balance });
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset OTP',
            html: `<h3>Your OTP is: ${otp}</h3>`
        });

        res.json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        // 🔒 [የደህንነት ፍተሻ] በአዲስ የይለፍ ቃል ቅያሬ ላይም ጥብቅነቱን እናረጋግጣለን
        if (!isStrongPassword(password)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).' 
            });
        }

        const user = await User.findOne({ email });

        if (!user || !user.otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ success: false, error: 'OTP expired or invalid' });
        }

        const isValid = await bcrypt.compare(otp, user.otp);
        if (!isValid) return res.status(400).json({ success: false, error: 'Invalid OTP' });

        user.password = await bcrypt.hash(password, 10);
        user.otp = undefined; // Clear OTP after use
        user.otpExpires = undefined;
        
        // 🔐 አሁን የራሱን ጠንካራ ፓስወርድ ስላዘጋጀ ወደፊት በመደበኛ ፎርም መግባት ይችላል
        if (user.isGoogleUser) {
            user.isGoogleUser = false; 
        }
        
        await user.save();

        const token = jwt.sign({ id: user._id, userId: user.userId, role: user.role, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ success: true, message: 'Password reset successful', token, user: userResponse });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Reset failed' });
    }
};