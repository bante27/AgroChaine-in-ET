const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ correct
const Product = require('../models/products'); // ✅ correct path

/**
 * @route GET /api/dashboard
 * @desc Get user's dashboard data (stats, recent activities, etc.)
 * @access Private
 */
router.get('/', async (req, res) => {
    try {
        // Find the user by ID from the authenticated request
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Fetch products uploaded by the current user
        const userProducts = await Product.find({ seller: req.user.id });
        const activeProducts = userProducts.length;

        // --- Mock Data for Dashboard Stats (replace with real data fetching) ---
        // In a real application, you would query your 'orders' or 'sales' collection
        // to calculate total revenue and orders. For now, we'll use mocked data.
        const totalRevenue = Math.floor(Math.random() * 10000) + 5000;
        const totalOrders = Math.floor(Math.random() * 200) + 50;

        const stats = [
            { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', trend: 'up', icon: 'DollarSign', color: 'emerald' },
            { title: 'Active Products', value: `${activeProducts}`, change: '+3', trend: 'up', icon: 'Package', color: 'blue' },
            { title: 'Total Orders', value: `${totalOrders}`, change: '+8.2%', trend: 'up', icon: 'BarChart3', color: 'purple' },
            { title: 'Customer Rating', value: '4.8', change: '-0.1', trend: 'down', icon: 'Users', color: 'orange' }
        ];

        // --- Mock Data for Recent Activities ---
        // This would also come from a database, e.g., a 'notifications' or 'activity' collection.
        const recentActivities = [
            { id: 1, type: 'sale', description: 'New order received', amount: '$45.00', time: '2 hours ago', status: 'completed' },
            { id: 2, type: 'product', description: 'Product uploaded: Teff Grain', amount: null, time: '4 hours ago', status: 'pending' },
        ];

        // Send back the necessary dashboard data
        res.json({
            user: { name: user.name, verificationStatus: user.verificationStatus },
            stats,
            recentActivities
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;