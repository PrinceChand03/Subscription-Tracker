    const express = require('express');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const { connectToDatabase, sequelize } = require('./database/mysql.js');


    dotenv.config();

    const app = express();

    app.use(cors({
        origin: process.env.HOST || 'http://localhost:5173',
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.get('/', (req, res) => {
        res.send('Welcome to the Subscription Tracker API!');
    });

    app.use('/api/auth', require('./routes/auth.routes.js'));
    app.use('/api/subscription', require('./routes/subscription.routes.js'));
    app.use('/api/user', require('./routes/user.routes.js'))

    const PORT = process.env.PORT || 2000;

    const startServer = async() => {
        try {
            await connectToDatabase();
            await sequelize.sync();
            app.listen(PORT, () => {
                console.log(`🚀 Server running at http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    };

    startServer();