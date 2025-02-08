import express from 'express';
import { listProductForSale, sellItem } from '../controllers/user.controller.js';
import { logIN, signOut, signUp } from '../controllers/userAuth.controller.js';
import verifyUserJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

// Sell item
router.route('/signUp').post(signUp);
router.route('/signOut').post(verifyUserJWT, signOut);
router.route('/login').post(logIN);
router.route('/list-product').post(verifyUserJWT, listProductForSale);
router.route('/sell-item').post(verifyUserJWT, sellItem);

export default router;