import express from 'express';
import cors from 'cors';
// const path = require('path');

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

app.use(cors({ origin: process.env.HOST, credentials: true }));

// handle json data in API calls
app.use(express.json());

// process the form data sent via html forms in a simple format
app.use(express.urlencoded({ extended: false }));

// reads coockies from incoming request to store user data
app.use(cookieParser());

// Arcjet middleware to protect the API
app.use(arcjetMiddleware);

// Serve static files from the 'dist' folder
// app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to the subscription tracker API!');
});

app.listen(PORT, async () => {
  console.log(`Subscription tracker API is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;