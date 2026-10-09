const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const { tenantId } = req.query;
    const threshold = Number(req.query.threshold ?? 5);

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required"
      });
    }

    if (!Number.isInteger(threshold) || threshold < 0 || threshold > 1000) {
      return res.status(400).json({
        success: false,
        message: "threshold must be an integer between 0 and 1000"
      });
    }

    const tenantFilter = { tenantId };

    const [
      totalProducts,
      totalUnitsResult,
      lowStockCount,
      outOfStockCount,
      lowStockProducts,
      outOfStockProducts
    ] = await Promise.all([
      Product.countDocuments(tenantFilter),
      Product.aggregate([
        { $match: tenantFilter },
        { $group: { _id: null, total: { $sum: "$stock" } } }
      ]),
      Product.countDocuments({
        tenantId,
        stock: { $gt: 0, $lte: threshold }
      }),
      Product.countDocuments({
        tenantId,
        stock: 0
      }),
      Product.find({
        tenantId,
        stock: { $gt: 0, $lte: threshold }
      }).select("name stock price category").sort({ stock: 1 }).limit(10).lean(),
      Product.find({
        tenantId,
        stock: 0
      }).select("name stock price category").sort({ name: 1 }).limit(10).lean()
    ]);

    return res.json({
      success: true,
      tenantId,
      threshold,
      summary: {
        totalProducts,
        totalUnitsInStock: totalUnitsResult[0]?.total ?? 0,
        lowStockCount,
        outOfStockCount
      },
      lowStockProducts,
      outOfStockProducts
    });
  } catch (error) {
    console.error("Inventory summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load inventory summary"
    });
  }
});

module.exports = router;
