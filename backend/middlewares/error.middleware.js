// Centralized error-handling middleware for Sequelize + Express
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.status || 500;
    let message = err.message || 'Server Error';

    console.error(err); // For debugging

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        message = err.errors.map((e) => e.message).join(', ');
        statusCode = 400;
    }

    // Sequelize unique constraint (duplicate key) error
    if (err.name === 'SequelizeUniqueConstraintError') {
        message = err.errors.map((e) => e.message).join(', ');
        statusCode = 409;
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        message = 'Invalid reference to another table';
        statusCode = 400;
    }

    // Sequelize database errors
    if (err.name === 'SequelizeDatabaseError') {
        message = 'Database query error';
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

module.exports = errorMiddleware;