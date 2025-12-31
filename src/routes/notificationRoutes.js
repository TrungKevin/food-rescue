const express = require('express');
const router = express.Router();
const notiController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');


/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Lấy danh sách thông báo của người dùng
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 */
router.get('/', authenticateToken, notiController.getMyNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Đánh dấu thông báo đã đọc
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID thông báo
 *     responses:
 *       200:
 *         description: Đã đánh dấu thông báo là đã đọc
 */
router.patch('/:id/read', authenticateToken, notiController.markAsRead);

module.exports = router;
