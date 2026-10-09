const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: true,
      unique: true
    },

    supplierName: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: true
    },

    leadTimeDays: {
      type: Number,
      required: true
    },

    reliabilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true
    },

    materialsSupplied: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);