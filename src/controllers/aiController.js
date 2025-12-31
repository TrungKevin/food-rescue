const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");
const Store = require("../models/Store");
const { Op } = require("sequelize");
const ChatHistory = require("../models/ChatHistory");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askAIAdvice = async (req, res) => {
    try {
        const { userQuestion, budget } = req.body;
        const userId = req.user.id;
        // 1. Lấy lịch sử 6 tin nhắn gần nhất của user
        const oldMessages = await ChatHistory.findAll({
            where: { userId },
            order: [['createdAt', 'ASC']],
            limit: 6
        });
        const historyContext = oldMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.message }]
        }));
        // 2. Lấy danh sách món ăn còn hàng
        const products = await Product.findAll({
            where: { stockQuantity: { [Op.gt]: 0 } },
            include: [{ model: Store, attributes: ['name'] }],
            limit: 5
        });
        const availableProducts = products.map(p => `- ${p.name}: ${p.salePrice}đ`).join("\n");
        // 3. Khởi tạo Chat với Gemini kèm lịch sử
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: historyContext,
            generationConfig: { maxOutputTokens: 500 },
        });
        const finalPrompt = `Danh sách món ăn hiện có:\n${availableProducts}\n\nCâu hỏi khách hàng: ${userQuestion}`;
        const result = await chat.sendMessage(finalPrompt);
        const responseText = result.response.text();
        // 4. Lưu lịch sử chat
        await ChatHistory.create({ userId, role: 'user', message: userQuestion });
        await ChatHistory.create({ userId, role: 'model', message: responseText });
        res.json({ answer: responseText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearChatHistory = async (req, res) => {
    try {
        await ChatHistory.destroy({ where: { userId: req.user.id } });
        res.json({ message: "Đã xóa toàn bộ lịch sử trò chuyện của bạn!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
