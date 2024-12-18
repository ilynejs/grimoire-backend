const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.auth = { userId: decoded.userId };

		next();
	} catch (err) {
		return res.status(401).json({ message: 'Auth failed' });
	}
};

module.exports = authMiddleware;
