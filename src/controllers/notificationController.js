const Notification = require('../models/Notification');

// Lấy danh sách thông báo của người dùng hiện tại
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.update({ isRead: true }, { where: { id, userId: req.user.id } });
        res.json({ message: "Đã đánh dấu là đã đọc" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
