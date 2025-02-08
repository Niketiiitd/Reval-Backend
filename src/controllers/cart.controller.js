import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get cart by user ID
const getCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
        return next(new ApiError(404, 'Cart not found'));
    }
    res.status(200).json(cart);
});

// Add item to cart
const addItemToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ApiError(404, 'Product not found'));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = product.discountPrice * cart.items[itemIndex].quantity;
    } else {
        cart.items.push({
            product: productId,
            quantity,
            price: product.discountPrice * quantity
        });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();
    res.status(200).json(cart);
});

// Remove item from cart
const removeItemFromCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(404, 'Cart not found'));
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
        await cart.save();
        res.status(200).json(cart);
    } else {
        return next(new ApiError(404, 'Item not found in cart'));
    }
});

// Clear cart
const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(404, 'Cart not found'));
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(200).json(cart);
});

export { getCart, addItemToCart, removeItemFromCart, clearCart };