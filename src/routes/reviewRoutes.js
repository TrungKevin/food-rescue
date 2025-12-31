const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');


/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tạo đánh giá cho sản phẩm
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đánh giá đã được tạo
 */
router.post('/', authenticateToken, authorizeRole(['buyer', 'seller', 'admin']), reviewController.createReview);

module.exports = router;
