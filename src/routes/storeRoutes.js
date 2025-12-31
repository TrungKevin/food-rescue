const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');


/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Thêm cửa hàng mới
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo cửa hàng thành công
 */
router.post('/', storeController.createStore);

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Lấy tất cả cửa hàng
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Danh sách cửa hàng
 */
router.get('/', storeController.getAllStores);

module.exports = router;
