import bodyParser from 'body-parser';
import cors from 'cors';
import { config as configDotenv } from 'dotenv';
import express from 'express';
import userRouter from './src/routes/user.route.js';
import cookieParser from 'cookie-parser';
import cartRouter from './src/routes/cart.route.js';
import recommendationRouter from './src/routes/recommendation.route.js';
configDotenv();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(cookieParser());
// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to parse application/json
app.use(express.json());

app.use('/api/v1/auth', userRouter);

import postRouter from './src/routes/post.route.js';
app.use('/api/v1/post', postRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/recommendation', recommendationRouter);

export default app;
