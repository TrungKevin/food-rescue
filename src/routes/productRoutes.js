const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm và lọc sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm phù hợp
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /api/products/nearby:
 *   get:
 *     summary: Lấy sản phẩm gần vị trí
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Vĩ độ
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Kinh độ
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm gần vị trí
 */
router.get('/nearby', productController.getNearbyProducts);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 */
router.get('/:id', productController.getProductDetails);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Thêm sản phẩm mới (chỉ seller/admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Sản phẩm đã được tạo
 */
router.post('/', authenticateToken, authorizeRole(['seller', 'admin']), upload.single('image'), productController.createProduct);

module.exports = router;
