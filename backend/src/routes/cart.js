const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.get("/", async (req, res) => {
  try {
    const { tenantId, userId } = req.query;

    if (!tenantId || !userId) {
      return res.status(400).json({
        success: false,
        message: "tenantId and userId are required"
      });
    }

    let cart = await Cart.findOne({ tenantId, userId });

    if (!cart) {
      cart = await Cart.create({
        tenantId,
        userId,
        items: []
      });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/items", async (req, res) => {
  try {
    const { tenantId, userId, productId, name, price, quantity } = req.body;

    if (!tenantId || !userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "tenantId, userId and productId are required"
      });
    }

    let cart = await Cart.findOne({ tenantId, userId });

    if (!cart) {
      cart = new Cart({ tenantId, userId, items: [] });
    }

    const existing = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existing) {
      existing.quantity += Number(quantity || 1);
    } else {
      cart.items.push({
        productId,
        name,
        price,
        quantity: Number(quantity || 1)
      });
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete("/items/:productId", async (req, res) => {
  try {
    const { tenantId, userId } = req.query;

    const cart = await Cart.findOne({ tenantId, userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
