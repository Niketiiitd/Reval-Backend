import express from 'express';
import { getRecommendations } from '../controllers/recommendation.controller.js';
import verifyUserJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/recommend').post(verifyUserJWT, getRecommendations);

export default router;