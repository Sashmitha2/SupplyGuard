const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    materialId: {
      type: String,
      required: true,
      unique: true
    },

    materialName: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    unit: {
      type: String,
      required: true
    },

    currentStock: {
      type: Number,
      required: true
    },

    safetyStock: {
      type: Number,
      required: true
    },

    dailyConsumption: {
      type: Number,
      required: true
    },

    criticality: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true
    },

    supplierId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Material", materialSchema);