const express = require("express");
const Material = require("../models/Material");

const router = express.Router();

// GET all materials
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving materials",
      error: error.message,
    });
  }
});

// GET one material by ID
router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving material",
      error: error.message,
    });
  }
});

// POST create a new material
router.post("/", async (req, res) => {
  try {
    const material = new Material(req.body);
    const savedMaterial = await material.save();

    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(400).json({
      message: "Error creating material",
      error: error.message,
    });
  }
});

// PUT update a material
router.put("/:id", async (req, res) => {
  try {
    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMaterial) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({
      message: "Error updating material",
      error: error.message,
    });
  }
});

// DELETE a material
router.delete("/:id", async (req, res) => {
  try {
    const deletedMaterial = await Material.findByIdAndDelete(
      req.params.id
    );

    if (!deletedMaterial) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    res.json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting material",
      error: error.message,
    });
  }
});

module.exports = router;