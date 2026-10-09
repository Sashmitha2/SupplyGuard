const express = require("express");
const Disruption = require("../models/Disruption");

const router = express.Router();

// GET all disruptions
router.get("/", async (req, res) => {
  try {
    const disruptions = await Disruption.find();
    res.json(disruptions);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving disruptions",
      error: error.message,
    });
  }
});

// GET one disruption by ID
router.get("/:id", async (req, res) => {
  try {
    const disruption = await Disruption.findById(req.params.id);

    if (!disruption) {
      return res.status(404).json({
        message: "Disruption not found",
      });
    }

    res.json(disruption);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving disruption",
      error: error.message,
    });
  }
});

// POST create a new disruption
router.post("/", async (req, res) => {
  try {
    const disruption = new Disruption(req.body);
    const savedDisruption = await disruption.save();

    res.status(201).json(savedDisruption);
  } catch (error) {
    res.status(400).json({
      message: "Error creating disruption",
      error: error.message,
    });
  }
});

// PUT update a disruption
router.put("/:id", async (req, res) => {
  try {
    const updatedDisruption = await Disruption.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDisruption) {
      return res.status(404).json({
        message: "Disruption not found",
      });
    }

    res.json(updatedDisruption);
  } catch (error) {
    res.status(400).json({
      message: "Error updating disruption",
      error: error.message,
    });
  }
});

// DELETE a disruption
router.delete("/:id", async (req, res) => {
  try {
    const deletedDisruption = await Disruption.findByIdAndDelete(
      req.params.id
    );

    if (!deletedDisruption) {
      return res.status(404).json({
        message: "Disruption not found",
      });
    }

    res.json({
      message: "Disruption deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting disruption",
      error: error.message,
    });
  }
});

module.exports = router;