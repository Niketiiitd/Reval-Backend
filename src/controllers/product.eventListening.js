// product.eventListener.js
import { ethers } from "ethers";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import abi from "../utils/CircularMarketplace.json";
import User from "../models/user.js";

// --- Configure your provider ---
// For example, using Infura's WebSocket endpoint (replace YOUR_INFURA_PROJECT_ID accordingly)
const provider = new ethers.providers.WebSocketProvider(
    INFURA_ID
);

// --- Contract configuration ---
// Replace with your deployed contract address
const contractAddress = "0x7a8654d4C516493dF2d72A0C38e828265056094f";

// Define the ABI for the events you want to listen to
const contractABI = abi.abi;

// Create a contract instance
const circularMarketplace = new ethers.Contract(contractAddress, contractABI, provider);

// --- Event Listener: ItemCreated ---
circularMarketplace.on("ItemCreated", async (id, name, price, owner, event) => {
  console.log("ItemCreated event detected:", { id: id.toString(), name, price: price.toString(), owner });
  try {
    // Option 1: Create a new product record in your database (if not already created)
    // (This depends on how your application logic is set up.)
    const newProduct = new Product({
      // Use the id from the event (converted to string or number as needed)
      _id: id.toString(),
      name,
      // Assume price from the event is used for both discountPrice and actualPrice
      discountPrice: price.toNumber(),
      actualPrice: price.toNumber(),
      currentOwner: owner,
      // Other fields such as images, billUrl, etc., might be updated later via your API
    });
    await newProduct.save();
    console.log("New product saved to database.");
  } catch (error) {
    console.error("Error saving new product:", error);
  }
});

// --- Event Listener: ItemTransferred ---
circularMarketplace.on("ItemTransferred", async (id, from, to, price, event) => {
  console.log("ItemTransferred event detected:", { id: id.toString(), from, to, price: price.toString() });
  try {
    // Update product ownership in the database
    const product = await Product.findById(id.toString());
    if (product) {
      product.currentOwner = to;
      await product.save();
      console.log("Product owner updated in database.");
    } else {
      console.warn("Product not found for id:", id.toString());
    }

    // Log the transaction in the Transaction collection
    // (Assuming your Transaction model has fields: productId, seller, buyer, price, timestamp)
    // Note: Blockchain events don't automatically include an exact timestamp in JS.
    // You can use the current time or extract the block timestamp if needed.
    const newTransaction = new Transaction({
      productId: id.toString(),
      seller: from,
      buyer: to,
      price: price.toNumber(),
      timestamp: new Date() // You might adjust this based on your needs
    });
    await newTransaction.save();
    console.log("Transaction record saved.");
  } catch (error) {
    console.error("Error processing ItemTransferred event:", error);
  }
});

// --- Event Listener: ItemUpdated ---
circularMarketplace.on("ItemUpdated", async (id, newDescription, newPrice, event) => {
  console.log("ItemUpdated event detected:", { id: id.toString(), newDescription, newPrice: newPrice.toString() });
  try {
    // Update product details in the database
    const product = await Product.findById(id.toString());
    if (product) {
      product.description = newDescription;
      product.actualPrice = newPrice.toNumber();
      // You might also want to update discountPrice or other fields based on your app logic
      await product.save();
      console.log("Product details updated in database.");
    } else {
      console.warn("Product not found for id:", id.toString());
    }
  } catch (error) {
    console.error("Error processing ItemUpdated event:", error);
  }
});
