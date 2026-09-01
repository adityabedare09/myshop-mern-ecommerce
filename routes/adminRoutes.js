import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Product from "../model/Product.js";
import Order from "../model/Order.js";
import User from "../model/user.js";
import Notification from "../model/Notification.js";
const router = express.Router();


// ========================================
// ADMIN TEST
// GET /api/admin/test
// ========================================

router.get("/test", protect, adminOnly, (req, res) => {
  res.json({
    message: "Admin access confirmed!",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});


// ========================================
// GET ALL PRODUCTS
// GET /api/admin/products
// ========================================

router.get("/products", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
});


// ========================================
// ADD PRODUCT
// POST /api/admin/products
// ========================================

router.post("/products", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      description,
      category,
      brand,
      rating,
      stock
    } = req.body;

    // Check required fields
    if (
      !name ||
      price === undefined ||
      !image ||
      !description ||
      !category ||
      !brand ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required product fields"
      });
    }

    const product = await Product.create({
      name,
      price,
      image,
      description,
      category,
      brand,
      rating: rating || 0,
      stock
    });

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message
    });
  }
});


// ========================================
// UPDATE PRODUCT
// PUT /api/admin/products/:id
// ========================================

router.put("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message
    });
  }
});


// ========================================
// DELETE PRODUCT
// DELETE /api/admin/products/:id
// ========================================

router.delete(
  "/products/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      res.json({
        message: "Product deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to delete product",
        error: error.message
      });
    }
  }
);
// ========================================
// GET ALL ORDERS
// GET /api/admin/orders
// ========================================

router.get(
  "/orders",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "username email")
        .populate("items.product")
        .sort({ createdAt: -1 });

      res.json(orders);

    } catch (error) {
      console.error("Admin orders error:", error);

      res.status(500).json({
        message: "Failed to fetch orders"
      });
    }
  }
);


// ========================================
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id
// ========================================

router.put(
  "/orders/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Placed",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status"
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true
          }
        );

      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      res.json({
        message: "Order status updated",
        order
      });

    } catch (error) {
      console.error(
        "Order status error:",
        error
      );

      res.status(500).json({
        message: "Failed to update order"
      });
    }
  }
);
// ========================================
// GET ALL USERS
// GET /api/admin/users
// ========================================

router.get(
  "/users",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);

    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch users"
      });
    }
  }
);
// ========================================
// ADMIN DASHBOARD STATS
// GET /api/admin/stats
// ========================================

router.get(
  "/stats",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const productCount = await Product.countDocuments();

      const userCount = await User.countDocuments();

      const orderCount = await Order.countDocuments();

      const revenueResult = await Order.aggregate([
        {
          $match: {
            status: {
              $ne: "Cancelled"
            }
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalAmount"
            }
          }
        }
      ]);

      const revenue =
        revenueResult.length > 0
          ? revenueResult[0].total
          : 0;

      res.json({
        products: productCount,
        users: userCount,
        orders: orderCount,
        revenue
      });

    } catch (error) {
      console.error(
        "Dashboard stats error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch dashboard stats"
      });
    }
  }
);
// ========================================
// GET ADMIN NOTIFICATIONS
// GET /api/admin/notifications
// ========================================

router.get(
  "/notifications",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find()
          .populate("order")
          .sort({ createdAt: -1 })
          .limit(50);

      res.json(notifications);

    } catch (error) {
      console.error(
        "Notifications error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch notifications"
      });
    }
  }
);
// ========================================
// MARK NOTIFICATION AS READ
// PUT /api/admin/notifications/:id/read
// ========================================

router.put(
  "/notifications/:id/read",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          { read: true },
          {
            returnDocument: "after"
          }
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found"
        });
      }

      res.json(notification);

    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      res.status(500).json({
        message: "Failed to mark notification as read"
      });
    }
  }
);


// ========================================
// DELETE NOTIFICATION
// DELETE /api/admin/notifications/:id
// ========================================

router.delete(
  "/notifications/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndDelete(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found"
        });
      }

      res.json({
        message: "Notification deleted successfully"
      });

    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      res.status(500).json({
        message: "Failed to delete notification"
      });
    }
  }
);
// ========================================
// MARK ALL NOTIFICATIONS AS READ
// PUT /api/admin/notifications/read-all
// ========================================

router.put(
  "/notifications/read-all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      await Notification.updateMany(
        { read: false },
        { read: true }
      );

      res.json({
        message: "All notifications marked as read"
      });
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark all notifications as read"
      });
    }
  }
);

export default router;