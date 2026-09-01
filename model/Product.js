import mongoose from "mongoose";

// Blueprint for a product
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    default: 0
  },

  stock: {
    type: Number,
    required: true,
    default: 0
  }
});

// Create Product model
const Product = mongoose.model("Product", productSchema);

export default Product;