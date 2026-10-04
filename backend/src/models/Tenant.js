const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    owner: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
