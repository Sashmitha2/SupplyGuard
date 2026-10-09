const mongoose = require("mongoose");

const disruptionSchema = new mongoose.Schema(
  {
    disruptionId: {
      type: String,
      required: true,
      unique: true
    },

    type: {
      type: String,
      required: true
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true
    },

    region: {
      type: String,
      required: true
    },

    supplierId: {
      type: String,
      required: true
    },

    materialId: {
      type: String,
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    expectedEndDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED", "MONITORING"],
      required: true
    },

    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Disruption", disruptionSchema);