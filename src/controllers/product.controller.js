// product.controller.js
import Product from '../models/product.model.js';
import Transaction from '../models/transaction.model.js';

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      mainCategory,
      subCategory,
      discountPrice,
      actualPrice,
      link,
      images,
      bills,
      currentOwner = req._id,
    } = req.body;

    const newProduct = new Product({
      name,
      mainCategory,
      subCategory,
      discountPrice,
      actualPrice,
      link,
      images,
      bills,
      currentOwner,
    });

    await newProduct.save();
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

/**
 * Get product details by ID.
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'currentOwner',
      'username email'
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

/**
 * Get all products.
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      'currentOwner',
      'username email'
    );
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

/**
 * Update product details.
 * Only the owner (authenticated via req.user) can update the product.
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });

    // Check if the logged-in user is the current owner.
    if (product.currentOwner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update product' });
    }

    const { discountPrice, actualPrice, images, bills } = req.body;
    if (discountPrice) product.discountPrice = discountPrice;
    if (actualPrice) product.actualPrice = actualPrice;
    if (images) product.images = images;
    if (bills) product.bills = bills;

    await product.save();
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

/**
 * Delete a product.
 * Only the owner (authenticated via req.user) can delete the product.
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    if (product.currentOwner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete product' });
    }
    await product.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

/**
 * fetch transaction history of a product.
 */
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ productId: req.params.id });
    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching transaction history',
      error: error.message,
    });
  }
}
