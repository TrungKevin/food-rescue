const Review = require('../models/Review');
const Order = require('../models/Order');

exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        // Kiểm tra xem user này đã từng mua sản phẩm này chưa
        const hasBought = await Order.findOne({
            where: { userId, productId, status: 'completed' }
        });

        if (!hasBought) {
            return res.status(403).json({ error: "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua thành công!" });
        }

        const review = await Review.create({ userId, productId, rating, comment });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
