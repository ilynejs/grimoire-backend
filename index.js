const app = require('express').express();
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
