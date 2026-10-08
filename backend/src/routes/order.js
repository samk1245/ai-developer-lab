const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

router.post("/", async (req, res) => {
  try {
    const {
      tenantId,
      userId = "demo-user",
      items,
      customer
    } = req.body;

    if (!tenantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "tenantId and items are required"
      });
    }

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return res.status(400).json({
        success: false,
        message: "Customer details are required"
      });
    }

    const productIds = items.map(item => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      tenantId
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products are invalid for this tenant"
      });
    }

    const orderItems = [];

    for (const item of items) {
      const product = products.find(
        p => p._id.toString() === item.productId
      );

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity"
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has insufficient stock`
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity
      });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    for (const item of orderItems) {
      await Product.findOneAndUpdate(
        { _id: item.productId, tenantId },
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = await Order.create({
      tenantId,
      userId,
      items: orderItems,
      totalAmount,
      customer,
      status: "confirmed"
    });

    await Cart.findOneAndUpdate(
      { tenantId, userId },
      { $set: { items: [] } }
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      tenantId,
      userId = "demo-user"
    } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required"
      });
    }

    const orders = await Order.find({
      tenantId,
      userId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
