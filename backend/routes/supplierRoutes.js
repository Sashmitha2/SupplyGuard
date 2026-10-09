const express = require("express");
const Supplier = require("../models/Supplier");

const router = express.Router();

// GET all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving suppliers",
      error: error.message,
    });
  }
});

// GET one supplier by ID
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving supplier",
      error: error.message,
    });
  }
});

// POST create a new supplier
router.post("/", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();

    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({
      message: "Error creating supplier",
      error: error.message,
    });
  }
});

// PUT update a supplier
router.put("/:id", async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({
      message: "Error updating supplier",
      error: error.message,
    });
  }
});

// DELETE a supplier
router.delete("/:id", async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting supplier",
      error: error.message,
    });
  }
});

module.exports = router;