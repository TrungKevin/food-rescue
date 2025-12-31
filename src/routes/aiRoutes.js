const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');


/**
 * @swagger
 * /api/ai/advice:
 *   post:
 *     summary: Nhận tư vấn món ăn từ AI Gemini
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Câu trả lời từ AI
 */
router.post('/advice', authenticateToken, aiController.askAIAdvice);

/**
 * @swagger
 * /api/ai/history:
 *   delete:
 *     summary: Xóa lịch sử chat với AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đã xóa lịch sử chat
 */
router.delete('/history', authenticateToken, aiController.clearChatHistory);

module.exports = router;
