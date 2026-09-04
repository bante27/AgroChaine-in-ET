
import userService from '../services/userService.js';
import catchAsync from '../utils/catchAsync.js';

export const registerUser = catchAsync(async (req, res) => {
    const result = await userService.register(req.body);
    res.status(200).json({ success: true, ...result });
});

export const resendOtp = catchAsync(async (req, res) => {
    const result = await userService.resendOtp(req.body);
    res.status(200).json({ success: true, ...result });
});

export const verifyOtp = catchAsync(async (req, res) => {
    const result = await userService.verifyOtp(req.body);
    res.status(201).json({ success: true, ...result });
});

export const loginUser = catchAsync(async (req, res) => {
    const result = await userService.login(req.body);
    res.json({ success: true, ...result });
});

export const googleLogin = catchAsync(async (req, res) => {
    const result = await userService.googleLogin(req.body);
    res.status(200).json({ success: true, ...result });
});

export const getProfile = catchAsync(async (req, res) => {
    const user = await userService.getProfile(req.user.userId);
    res.json({ success: true, user });
});

export const updateProfile = catchAsync(async (req, res) => {
    const result = await userService.updateProfile(req.user.userId, req.body);
    res.json({ success: true, ...result });
});

export const uploadProfilePic = catchAsync(async (req, res) => {
    const result = await userService.uploadProfilePic(req.user.userId, req.file ? req.file.path : null);
    res.json({ success: true, ...result });
});

export const requestVerificationOtp = catchAsync(async (req, res) => {
    const result = await userService.requestVerificationOtp(req.user.userId);
    res.json({ success: true, ...result });
});

export const verifyId = catchAsync(async (req, res) => {
    const result = await userService.verifyId(req.user.userId, req.body, req.files);
    res.json({ success: true, ...result });
});

export const addBalance = catchAsync(async (req, res) => {
    const result = await userService.addBalance(req.user.userId, req.body.amount);
    res.json({ success: true, ...result });
});

export const forgotPassword = catchAsync(async (req, res) => {
    const result = await userService.forgotPassword(req.body.email);
    res.json({ success: true, ...result });
});

export const resetPassword = catchAsync(async (req, res) => {
    const result = await userService.resetPassword(req.body);
    res.json({ success: true, ...result });
});
