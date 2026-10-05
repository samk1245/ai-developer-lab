const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { tenantId, name, description, price, stock, category, image } = req.body;

    if (!tenantId || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "tenantId, name and price are required"
      });
    }

    const product = await Product.create({
      tenantId,
      name,
      description,
      price,
      stock,
      category,
      image
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET ALL PRODUCTS OF TENANT
router.get("/", async (req, res) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required"
      });
    }

    const products = await Product.find({ tenantId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET ONE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      tenantId: req.query.tenantId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { tenantId, name, description, price, stock, category, image } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      { name, description, price, stock, category, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.query.tenantId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
