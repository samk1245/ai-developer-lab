const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/summary", async (req, res) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required"
      });
    }

    const products = await Product.find({ tenantId }).lean();

    const summary = {
      totalProducts: products.length,
      totalUnits: products.reduce((sum, p) => sum + Math.max(0, Number(p.stock) || 0), 0),
      totalStockValue: products.reduce((sum, p) => sum + Math.max(0, Number(p.stock) || 0) * Math.max(0, Number(p.price) || 0), 0),
      lowStockCount: products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length,
      outOfStockCount: products.filter(p => Number(p.stock) <= 0).length,
      categorySummary: Object.values(products.reduce((groups, p) => {
        const category = p.category?.trim() || "Uncategorized";
        if (!groups[category]) groups[category] = { category, productCount: 0, units: 0, stockValue: 0 };
        groups[category].productCount += 1;
        groups[category].units += Math.max(0, Number(p.stock) || 0);
        groups[category].stockValue += Math.max(0, Number(p.stock) || 0) * Math.max(0, Number(p.price) || 0);
        return groups;
      }, {}))
    };

    res.json({ success: true, tenantId, summary });
  } catch (error) {
    console.error("Inventory summary error:", error);
    res.status(500).json({ success: false, message: "Failed to load inventory summary" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { tenantId, search = "", category = "", stockStatus = "all", sort = "name" } = req.query;

    if (!tenantId) {
      return res.status(400).json({ success: false, message: "tenantId is required" });
    }

    const filter = { tenantId };
    if (category && category !== "all") filter.category = category;

    let products = await Product.find(filter).lean();

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      products = products.filter(p =>
        [p.name, p.description, p.category].some(value =>
          String(value || "").toLowerCase().includes(term)
        )
      );
    }

    if (stockStatus === "low") products = products.filter(p => p.stock > 0 && p.stock <= 5);
    if (stockStatus === "out") products = products.filter(p => p.stock <= 0);
    if (stockStatus === "available") products = products.filter(p => p.stock > 5);

    const sorters = {
      name: (a, b) => String(a.name).localeCompare(String(b.name)),
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      stockAsc: (a, b) => a.stock - b.stock,
      stockDesc: (a, b) => b.stock - a.stock
    };

    products.sort(sorters[sort] || sorters.name);
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("Inventory list error:", error);
    res.status(500).json({ success: false, message: "Failed to load inventory" });
  }
});

module.exports = router;
