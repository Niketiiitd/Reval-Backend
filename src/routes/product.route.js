import express from 'express';
import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import verifyUserJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create a new product
router.route('/').post(verifyUserJWT, createProduct);

// Get product details by ID
router.route('/:id').get(getProductById);

// Get all products
router.route('/').get(getAllProducts);

// Update product details
router.route('/:id').put(verifyUserJWT, updateProduct);

// Delete a product
router.route('/:id').delete(verifyUserJWT, deleteProduct);

export default router;