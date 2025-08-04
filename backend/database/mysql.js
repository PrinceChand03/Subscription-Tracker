// database/mysql.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    NODE_ENV,
    PORT
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error(
        'Missing DB config. Please define DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in your .env file.'
    );
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
});

const connectToDatabase = async() => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Connected to MySQL database [${DB_NAME}] in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('❌ MySQL connection error:', error.message);
        process.exit(1);
    }
};

export { sequelize, connectToDatabase };