const { fn, col } = require('sequelize');
exports.getStoreStats = async (req, res) => {
    try {
        // Giả sử req.user.storeId được lưu khi Login
        const storeId = req.user.storeId;

        const stats = await Order.findAll({
            include: [{
                model: Product,
                where: { storeId: storeId },
                attributes: [] // Không lấy dữ liệu sản phẩm, chỉ để lọc
            }],
            attributes: [
                [fn('COUNT', col('Order.id')), 'totalOrders'],
                [fn('SUM', col('Order.totalPrice')), 'totalRevenue'],
                [fn('SUM', col('Order.quantity')), 'totalItemsRescued']
            ],
            where: { status: 'completed' },
            raw: true
        });

        res.json({
            message: "Thống kê cửa hàng",
            data: stats[0] || { totalOrders: 0, totalRevenue: 0, totalItemsRescued: 0 }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getAllOrders = async (req, res) => {
    try {
        const history = await Order.findAll({
            include: [{ model: Product, attributes: ['name', 'salePrice', 'image'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findByPk(productId);
        const currentTime = new Date().toLocaleTimeString('it-IT');
        if (!product || product.stockQuantity < quantity) {
            return res.status(400).json({ error: "Sản phẩm đã hết hàng!" });
        }
        if (product.expiryTime && currentTime > product.expiryTime) {
            return res.status(400).json({ error: "Đã quá thời gian giải cứu món này!" });
        }
        const order = await Order.create({
            productId,
            quantity,
            totalPrice: product.salePrice * quantity,
            status: 'pending'
        });
        product.stockQuantity -= quantity;
        await product.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Notification = require('../models/Notification');
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed', 'completed', 'cancelled'
        const order = await Order.findByPk(id, {
            include: [{ model: Product }]
        });
        if (!order) return res.status(404).json({ error: "Không thấy đơn hàng" });
        // Kiểm tra nếu là Seller thì phải đúng là chủ của sản phẩm đó mới được duyệt đơn
        if (req.user.role === 'seller' && order.Product && order.Product.storeId !== req.user.storeId) {
            return res.status(403).json({ error: "Bạn không có quyền duyệt đơn này!" });
        }
        order.status = status;
        await order.save();
        // Gửi thông báo cho khách hàng
        await Notification.create({
            userId: order.userId,
            title: "Cập nhật đơn hàng",
            message: `Đơn hàng món ${order.Product.name} của bạn đã được chuyển sang trạng thái: ${status}`,
            type: 'order_update'
        });
        res.json({ message: `Đơn hàng đã chuyển sang: ${status} và đã gửi thông báo cho khách!`, order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
