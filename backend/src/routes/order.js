const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { tenantId, userId, items } = req.body;

    if (!tenantId || !userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "tenantId, userId and items are required"
      });
    }

    const totalAmount = items.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );

    const order = await Order.create({
      tenantId,
      userId,
      items,
      totalAmount
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { tenantId, userId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required"
      });
    }

    const filter = { tenantId };

    if (userId) {
      filter.userId = userId;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
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
