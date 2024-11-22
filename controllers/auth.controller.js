const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res, next) => {
	try {
		const hash = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			email: req.body.email,
			password: hash,
		});

		await user.save();
		res.status(201).json({ message: 'User created!' });
	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}

	next();
};

const login = async (req, res, next) => {
	try {
		const user = await User.findOne({
			email: req.body.email,
		});

		if (!user) {
			return res.status(401).json({ message: 'Auth failed' });
		}

		const result = await bcrypt.compare(req.body.password, user.password);

		if (!result) {
			return res.status(401).json({ message: 'Auth failed' });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '24h',
		});

		res.status(200).json({
			userId: user._id,
			token: token,
		});
	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}

	next();
};

module.exports = { signup, login };
