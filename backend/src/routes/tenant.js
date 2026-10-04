const express = require("express");
const Tenant = require("../models/Tenant");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, slug, owner } = req.body;

    if (!name || !slug || !owner) {
      return res.status(400).json({
        success: false,
        message: "name, slug and owner are required"
      });
    }

    const tenant = await Tenant.create({ name, slug, owner });

    res.status(201).json({
      success: true,
      tenant
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
    const tenants = await Tenant.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tenants.length,
      tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
