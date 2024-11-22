const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

const clientOptions = {
	serverApi: {
		version: '1',
		strict: true,
		deprecationErrors: true,
	},
};

const connectDB = async () => {
	try {
		await mongoose.connect(mongoUri, clientOptions);
		console.log('Connexion à MongoDB réussie !');
	} catch (err) {
		console.log('Connexion à MongoDB échouée !');
	}
};

module.exports = connectDB;
