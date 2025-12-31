const Review = require('../models/Review');
const User = require('../models/User');
const { Op, fn, col } = require('sequelize');

exports.getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                { model: Store, attributes: ['name', 'address', 'phoneNumber'] },
                {
                    model: Review,
                    attributes: ['id', 'rating', 'comment', 'createdAt'],
                    include: [{ model: User, attributes: ['fullName'] }]
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
        }

        // Tính toán điểm trung bình sao và tổng số review
        const stats = await Review.findOne({
            where: { productId: id },
            attributes: [
                [fn('AVG', col('rating')), 'avgRating'],
                [fn('COUNT', col('id')), 'totalReviews']
            ],
            raw: true
        });

        res.json({
            success: true,
            data: {
                ...product.toJSON(),
                ratingSummary: {
                    average: parseFloat(stats.avgRating || 0).toFixed(1),
                    total: parseInt(stats.totalReviews || 0)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { q, minPrice, maxPrice, sortBy } = req.query;
        let whereConditions = {};

        // 1. Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường)
        if (q) {
            whereConditions.name = { [Op.iLike]: `%${q}%` };
        }

        // 2. Lọc theo khoảng giá
        if (minPrice || maxPrice) {
            whereConditions.salePrice = {
                [Op.between]: [
                    parseFloat(minPrice) || 0,
                    parseFloat(maxPrice) || 999999999
                ]
            };
        }

        // 3. Thiết lập sắp xếp
        let orderStrategy = [['createdAt', 'DESC']];
        if (sortBy === 'price_asc') orderStrategy = [['salePrice', 'ASC']];
        if (sortBy === 'price_desc') orderStrategy = [['salePrice', 'DESC']];

        const products = await Product.findAll({
            where: whereConditions,
            include: [{ model: Store, attributes: ['name', 'address'] }],
            order: orderStrategy
        });

        res.json({
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const Product = require('../models/Product');
const Store = require('../models/Store');

exports.createProduct = async (req, res) => {
    try {
        let data = req.body;
        if (req.file) data.image = `/uploads/${req.file.filename}`;
        const product = await Product.create(data);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: [Store] });
        const now = new Date();
        const updatedProducts = products.map(p => {
            const productData = p.toJSON();
            let displayStatus = 'Đang bán';
            let canBuy = true;
            let timeLeftSeconds = 0;
            let isExpired = false;
            let displayMessage = '';

            // Countdown logic
            if (p.expiryTime) {
                const [hours, minutes, seconds] = p.expiryTime.split(':');
                const expiryDate = new Date();
                expiryDate.setHours(hours, minutes, seconds, 0);
                timeLeftSeconds = Math.floor((expiryDate - now) / 1000);
                isExpired = timeLeftSeconds <= 0;
                displayMessage = timeLeftSeconds > 0
                    ? `Còn ${Math.floor(timeLeftSeconds / 60)} phút để giải cứu!`
                    : 'Đã hết thời gian bán hôm nay';
            }

            if (p.stockQuantity <= 0) {
                displayStatus = 'Hết hàng';
                canBuy = false;
            } else if (p.expiryTime && isExpired) {
                displayStatus = 'Cửa hàng đã đóng cửa';
                canBuy = false;
            }

            return {
                ...productData,
                displayStatus,
                canBuy,
                timeLeftSeconds: timeLeftSeconds > 0 ? timeLeftSeconds : 0,
                isExpired,
                displayMessage
            };
        });
        res.json(updatedProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNearbyProducts = async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = parseInt(req.query.radius) || 2000;
        if (!lat || !lng) return res.status(400).json({ error: "Thiếu tọa độ GPS" });
        const { fn, col, where, Op } = require('sequelize');
        const products = await Product.findAll({
            where: where(
                fn('ST_DistanceSphere', col('location'), fn('ST_GeomFromText', `POINT(${lng} ${lat})`, 4326)),
                { [Op.lte]: radius }
            ),
            include: [Store]
        });
        res.json({ count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
