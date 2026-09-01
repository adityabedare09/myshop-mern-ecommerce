import express from "express";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import Notification from "../model/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ========================================
// PLACE ORDER
// POST /api/orders
// ========================================

router.post("/", protect, async (req, res) => {
    try {

        const { items, shippingAddress } = req.body;


        // ========================================
        // CHECK CART
        // ========================================

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }


        // ========================================
        // CHECK SHIPPING ADDRESS
        // ========================================

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }


        let totalAmount = 0;
        const orderItems = [];


        // ========================================
        // CHECK PRODUCTS AND STOCK
        // ========================================

        for (const item of items) {

            const product =
                await Product.findById(item.product);


            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }


            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message:
                        `${product.name} does not have enough stock`
                });
            }


            // Calculate total using MongoDB price
            totalAmount +=
                product.price * item.quantity;


            // Store product snapshot
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });
        }


        // ========================================
        // CREATE ORDER
        // ========================================

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });


        // ========================================
        // REDUCE PRODUCT STOCK
        // ========================================

        for (const item of items) {

            const updatedProduct =
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    },
                    {
                        returnDocument: "after"
                    }
                );


            console.log(
                "Stock updated:",
                updatedProduct?.name,
                "New stock:",
                updatedProduct?.stock
            );
        }


        // ========================================
        // CREATE NOTIFICATION
        // ========================================

        const notification =
            await Notification.create({
                type: "new_order",

                message:
                    "New order received!",

                order: order._id,

                customer: req.user.username,

                totalAmount: order.totalAmount
            });


        // ========================================
        // SEND REAL-TIME ADMIN NOTIFICATION
        // ========================================

        const io = req.app.get("io");


        if (io) {

            io.to("admins").emit(
                "newOrder",
                {
                    message:
                        notification.message,

                    orderId:
                        order._id,

                    customer:
                        notification.customer,

                    totalAmount:
                        notification.totalAmount
                }
            );


            console.log(
                "Admin notification sent:",
                order._id
            );
        }


        // ========================================
        // RESPONSE
        // ========================================

        res.status(201).json({

            message:
                "Order placed successfully",

            order

        });

    } catch (error) {

        console.error(
            "Order creation error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to place order"
        });
    }
});


// ========================================
// GET MY ORDERS
// GET /api/orders/my
// ========================================

router.get(
    "/my",
    protect,
    async (req, res) => {

        try {

            const orders =
                await Order.find({
                    user: req.user._id
                })
                    .populate("items.product")
                    .sort({
                        createdAt: -1
                    });


            res.json(orders);

        } catch (error) {

            console.error(
                "Fetch orders error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch orders"
            });
        }
    }
);
// ========================================
// GET SINGLE ORDER
// GET /api/orders/:id
// ========================================

router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.product")
            .populate("user", "username email");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Make sure the user can only see their own order
        // Admins are allowed to view any order.
        if (
            order.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "You are not authorized to view this order"
            });
        }

        res.json(order);

    } catch (error) {
        console.error(
            "Get single order error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch order"
        });
    }
});

export default router;