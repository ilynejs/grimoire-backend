const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

connectDB();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
