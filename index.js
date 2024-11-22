const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
// const bookRoutes = require('./routes/book');

app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);

connectDB();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
