import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// List a Product for Sale
export const listProductForSale = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;

    // Validate input
    if (!productId) {
        return next(new ApiError(400, "Product ID is required"));
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ApiError(404, "Product not found"));
    }

    // Find the seller (current user)
    const seller = await User.findById(req.user._id);
    if (!seller) {
        return next(new ApiError(404, "Seller not found"));
    }

    // Check if the product is already listed by the seller
    const isListed = seller.itemsListed.includes(productId);
    if (isListed) {
        return next(new ApiError(400, "Product is already listed by the seller"));
    }

    // Add the product to the seller's itemsListed array
    seller.itemsListed.push(productId);
    await seller.save();

    res.status(200).json({ message: "Product listed for sale successfully" });
});

// Sell Item
export const sellItem = asyncHandler(async (req, res, next) => {
    const { productId, buyerId } = req.body;

    // Validate input
    if (!productId || !buyerId) {
        return next(new ApiError(400, "Product ID and Buyer ID are required"));
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ApiError(404, "Product not found"));
    }

    // Find the seller (current user)
    const seller = await User.findById(req.user._id);
    if (!seller) {
        return next(new ApiError(404, "Seller not found"));
    }

    // Find the buyer
    const buyer = await User.findById(buyerId);
    if (!buyer) {
        return next(new ApiError(404, "Buyer not found"));
    }

    // Check if the product is listed by the seller
    const isListed = seller.itemsListed.includes(productId);
    if (!isListed) {
        return next(new ApiError(400, "Product is not listed by the seller"));
    }

    // Update the product's current owner
    product.currentOwner = buyerId;
    await product.save();

    // Update the seller's itemsListed and itemsSold arrays
    seller.itemsListed.pull(productId);
    seller.itemsSold.push(productId);
    await seller.save();

    // Update the buyer's itemsListed array
    buyer.itemsListed.push(productId);
    await buyer.save();

    res.status(200).json({ message: "Item sold successfully" });
});