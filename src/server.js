// Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
// 1. Cấu hình môi trường (Luôn ưu tiên hàng đầu)
require('dotenv').config({ path: './DataBase.env' });

// 2. Import các thư viện
const express = require('express');
const path = require('path');
const sequelize = require('./config/db');

// 3. Khởi tạo ứng dụng (PHẢI LÀM TRƯỚC KHI DÙNG APP.USE)
const app = express();

// 4. Các Middleware cơ bản
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 5. Import các Models để thiết lập quan hệ
const User = require('./models/User');
const Store = require('./models/Store');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Notification = require('./models/Notification');

// 6. Thiết lập quan hệ giữa các bảng
Store.hasMany(Product, { foreignKey: 'storeId' });
Product.belongsTo(Store, { foreignKey: 'storeId' });
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// 7. Import các Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');

// 8. Sử dụng Routes (Sau khi đã khởi tạo app và import routes)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/ai', aiRoutes);
// Tích hợp Swagger UI (giao diện tài liệu API)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 9. Đồng bộ Database và Chạy Server
sequelize.sync({ alter: true })
    .then(() => {
        console.log("✅ Database đã đồng bộ thành công!");
       const initCronJobs = require('./utils/cronJobs');
       // KÍCH HOẠT CRON JOB TẠI ĐÂY
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
            console.log("🤖 Chatbot AI tư vấn đã sẵn sàng!");
        });
    })
    .catch(err => {
        console.error("❌ Lỗi kết nối Database:", err);
    });