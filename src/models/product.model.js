import mongoose, { Schema } from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';
const AutoIncrement = AutoIncrementFactory(mongoose);

const ProductSchema = new Schema({
    productId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mainCategory: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    actualPrice: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    bills: {
        type: [String],
    },
    rating: {
        type: Number,
        required: true
    },
    noOfRatings: {
        type: Number,
        required: true
    },
    currentOwner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    previousOwners: [{
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    transactionHistory: [{
        transactionId: {
            type: Schema.Types.ObjectId,
            ref: "Transaction"
        }
    }],
    blockchainTxId: {
        type: String // Latest transaction ID for blockchain verification
    },
    conditionUpdates: [{
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        newCondition: {
            type: String 
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

// Add auto-incrementing ID field
ProductSchema.plugin(AutoIncrement, { inc_field: 'productId' });

const Product = mongoose.model('Product', ProductSchema);

export default Product;