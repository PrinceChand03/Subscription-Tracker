import express from 'express';


import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

const app = express();

// handle json data in API calls
app.use(express.json());

// process the form data sent via html forms in a simple format
app.use(express.urlencoded({ extended: false }));

// reads coockies from incoming request to store user data
app.use(cookieParser());

// Arcjet middleware to protect the API
app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to the subscription tracker API!');
});

app.listen(PORT, async () => {
  console.log(`Subscription tracker API is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;