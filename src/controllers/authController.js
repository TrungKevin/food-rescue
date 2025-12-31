const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'bi_mat_khong_duoc_bat_mi';

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, role, phone, storeId } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email đã tồn tại!' });
        const user = await User.create({ fullName, email, password, role, phone, storeId });
        res.status(201).json({ message: 'Đăng ký thành công!', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng!' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng!' });
        const payload = { id: user.id, role: user.role, storeId: user.storeId };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Đăng nhập thành công!', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
