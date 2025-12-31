const jwt = require('jsonwebtoken');
const JWT_SECRET = 'bi_mat_khong_duoc_bat_mi';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Vui lòng đăng nhập!" });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
        req.user = user;
        next();
    });
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Bạn không có quyền thực hiện hành động này!" });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };