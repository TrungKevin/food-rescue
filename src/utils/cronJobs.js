
const cron = require('node-cron');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Notification = require('../models/Notification');


// Hàm dọn dẹp ảnh thừa
const cleanupImages = async () => {
    try {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) return;
        const filesOnDisk = fs.readdirSync(uploadDir);
        const products = await Product.findAll({ attributes: ['image'] });
        const filesInDb = products
            .map(p => p.image ? path.basename(p.image) : null)
            .filter(name => name !== null);
        filesOnDisk.forEach(file => {
            if (!filesInDb.includes(file)) {
                const filePath = path.join(uploadDir, file);
                if (fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️ Đã xóa ảnh thừa: ${file}`);
                }
            }
        });
    } catch (error) {
        console.error('❌ Lỗi dọn dẹp ảnh:', error.message);
    }
};

const initCronJobs = () => {
    // 1. Tác vụ chạy vào lúc 00:00 mỗi đêm
    cron.schedule('0 0 * * *', async () => {
        console.log('--- 🌙 Bắt đầu dọn dẹp hệ thống định kỳ ---');
        try {
            // A. Đóng các món ăn của ngày hôm qua
            const updatedProducts = await Product.update(
                { status: 'closed' },
                { 
                    where: { 
                        status: 'active',
                        // Nếu có trường ngày tạo, hãy lọc những món cũ hơn hôm nay
                    } 
                }
            );
            console.log(`✅ Đã đóng ${updatedProducts[0]} món ăn hết hạn.`);

            // B. Xóa các thông báo đã đọc cũ hơn 7 ngày
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const deletedNotifications = await Notification.destroy({
                where: {
                    isRead: true,
                    createdAt: { [Op.lt]: sevenDaysAgo }
                }
            });
            console.log(`✅ Đã xóa ${deletedNotifications} thông báo cũ.`);

            // C. Dọn dẹp ảnh thừa trong thư mục uploads
            await cleanupImages();
            console.log('--- ✅ Hoàn tất dọn dẹp ---');
        } catch (error) {
            console.error('❌ Lỗi khi chạy Cron Job:', error.message);
        }
    });

    console.log('🚀 Hệ thống Cron Job đã được kích hoạt!');
};

module.exports = initCronJobs;
