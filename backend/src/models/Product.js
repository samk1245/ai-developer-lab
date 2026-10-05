const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    category: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

productSchema.index({ tenantId: 1, name: 1 });

module.exports = mongoose.model("Product", productSchema);
