import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "node:process";

import Product from "./model/Product.js";
import products from "./data/products.js";


dotenv.config();

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove the old products
    await Product.deleteMany({});

    console.log("Old products deleted");

    // Insert the 50 products
    const insertedProducts = await Product.insertMany(products);

    console.log(
      `${insertedProducts.length} products inserted successfully`
    );

    // Close database connection
    await mongoose.connection.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Seeding failed:", error.message);

    process.exit(1);
  }
}

seedProducts();