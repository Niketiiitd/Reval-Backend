import express from 'express';
import { getCart, addItemToCart, removeItemFromCart, clearCart } from '../controllers/cart.controller.js';
import verifyUserJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(verifyUserJWT, getCart)
    .post(verifyUserJWT, addItemToCart)
    .delete(verifyUserJWT, removeItemFromCart);

router.route('/clear')
    .post(verifyUserJWT, clearCart);

export default router;