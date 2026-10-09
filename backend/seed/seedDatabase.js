require("dotenv").config();

const mongoose = require("mongoose");

const Material = require("../models/Material");
const Supplier = require("../models/Supplier");
const Disruption = require("../models/Disruption");

const MONGO_URI = process.env.MONGO_URI;

const countries = [
  "Sri Lanka",
  "India",
  "China",
  "Malaysia",
  "Thailand",
  "Indonesia",
  "Vietnam",
  "Singapore",
  "UAE",
  "Turkey"
];

const categories = [
  "Rubber",
  "Chemicals",
  "Textiles",
  "Adhesives",
  "Packaging",
  "Leather",
  "Foam",
  "Plastic",
  "Metal Components",
  "Industrial Materials"
];

const materialNames = [
  "Natural Rubber",
  "Synthetic Rubber",
  "Rubber Compound",
  "Latex",
  "Carbon Black",
  "Zinc Oxide",
  "Sulphur",
  "Rubber Chemicals",
  "PVC Sheet",
  "Polyurethane Foam",
  "EVA Foam",
  "Nylon Fabric",
  "Polyester Fabric",
  "Cotton Fabric",
  "Canvas Material",
  "Synthetic Leather",
  "Natural Leather",
  "Adhesive Resin",
  "Industrial Glue",
  "Contact Adhesive",
  "Packaging Film",
  "Plastic Sheet",
  "Cardboard",
  "Corrugated Packaging",
  "Plastic Bags",
  "Metal Buckles",
  "Metal Rings",
  "Steel Components",
  "Aluminium Components",
  "Zippers",
  "Shoe Laces",
  "Thread",
  "Industrial Thread",
  "Dye Chemicals",
  "Pigments",
  "Cleaning Chemicals",
  "Solvents",
  "Processing Oil",
  "Lubricant",
  "Industrial Oil"
];

const disruptionTypes = [
  "Shipping Delay",
  "Port Congestion",
  "Supplier Shutdown",
  "Raw Material Shortage",
  "Transportation Delay",
  "Import Clearance Delay",
  "Fuel Price Impact",
  "Geopolitical Disruption",
  "Weather Disruption",
  "Production Delay"
];

const regions = [
  "Middle East",
  "South Asia",
  "Southeast Asia",
  "East Asia",
  "Indian Ocean",
  "Europe"
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSupplierRisk(reliability) {
  if (reliability >= 85) return "LOW";
  if (reliability >= 70) return "MEDIUM";
  if (reliability >= 55) return "HIGH";
  return "CRITICAL";
}

function generateCriticality() {
  const value = Math.random();

  if (value < 0.40) return "LOW";
  if (value < 0.75) return "MEDIUM";
  if (value < 0.95) return "HIGH";

  return "CRITICAL";
}

function generateSeverity() {
  const value = Math.random();

  if (value < 0.30) return "LOW";
  if (value < 0.65) return "MEDIUM";
  if (value < 0.90) return "HIGH";

  return "CRITICAL";
}

function generateStatus() {
  const value = Math.random();

  if (value < 0.55) return "RESOLVED";
  if (value < 0.80) return "MONITORING";

  return "ACTIVE";
}

async function seedDatabase() {

  try {

    await mongoose.connect(MONGO_URI);

    console.log("Connected to local MongoDB");

    /*
    CLEAR OLD DATA
    */

    await Material.deleteMany({});
    await Supplier.deleteMany({});
    await Disruption.deleteMany({});

    console.log("Old data cleared");

    /*
    ==============================
    CREATE 100 SUPPLIERS
    ==============================
    */

    const suppliers = [];

    for (let i = 1; i <= 100; i++) {

      const reliabilityScore = randomNumber(45, 98);

      suppliers.push({

        supplierId:
          `SUP${String(i).padStart(3, "0")}`,

        supplierName:
          `Supplier Company ${i}`,

        country:
          randomItem(countries),

        leadTimeDays:
          randomNumber(3, 30),

        reliabilityScore,

        riskLevel:
          generateSupplierRisk(reliabilityScore),

        materialsSupplied: []

      });

    }

    await Supplier.insertMany(suppliers);

    console.log("100 suppliers created");

    /*
    ==============================
    CREATE 100 MATERIALS
    ==============================
    */

    const materials = [];

    for (let i = 1; i <= 100; i++) {

      const supplierNumber =
        randomNumber(1, 100);

      const supplierId =
        `SUP${String(supplierNumber).padStart(3, "0")}`;

      const dailyConsumption =
        randomNumber(50, 500);

      const safetyStock =
        dailyConsumption * randomNumber(5, 15);

      const currentStock =
        randomNumber(
          Math.floor(safetyStock * 0.3),
          Math.floor(safetyStock * 1.5)
        );

      const material = {

        materialId:
          `MAT${String(i).padStart(3, "0")}`,

        materialName:
          `${randomItem(materialNames)} ${i}`,

        category:
          randomItem(categories),

        unit:
          randomItem([
            "kg",
            "litres",
            "units",
            "metres"
          ]),

        currentStock,

        safetyStock,

        dailyConsumption,

        criticality:
          generateCriticality(),

        supplierId

      };

      materials.push(material);

      const supplier =
        suppliers.find(
          s => s.supplierId === supplierId
        );

      if (supplier) {

        supplier.materialsSupplied.push(
          material.materialId
        );

      }

    }

    await Material.insertMany(materials);

    /*
    UPDATE SUPPLIERS
    */

    for (const supplier of suppliers) {

      await Supplier.updateOne(
        {
          supplierId:
            supplier.supplierId
        },

        {
          $set: {
            materialsSupplied:
              supplier.materialsSupplied
          }
        }
      );

    }

    console.log("100 materials created");

    /*
    ==============================
    CREATE 100 DISRUPTIONS
    ==============================
    */

    const disruptions = [];

    for (let i = 1; i <= 100; i++) {

      const material =
        randomItem(materials);

      const startDate =
        new Date();

      startDate.setDate(
        startDate.getDate() -
        randomNumber(1, 30)
      );

      const expectedEndDate =
        new Date(startDate);

      expectedEndDate.setDate(
        expectedEndDate.getDate() +
        randomNumber(5, 30)
      );

      disruptions.push({

        disruptionId:
          `DIS${String(i).padStart(3, "0")}`,

        type:
          randomItem(disruptionTypes),

        severity:
          generateSeverity(),

        region:
          randomItem(regions),

        supplierId:
          material.supplierId,

        materialId:
          material.materialId,

        startDate,

        expectedEndDate,

        status:
          generateStatus(),

        description:
          "Synthetic supply disruption affecting transportation, availability, or material supply."

      });

    }

    await Disruption.insertMany(disruptions);

    console.log("100 disruptions created");

    console.log("");
    console.log("==============================");
    console.log("DATABASE SEEDING COMPLETE");
    console.log("==============================");
    console.log("Suppliers: 100");
    console.log("Materials: 100");
    console.log("Disruptions: 100");
    console.log("Total documents: 300");
    console.log("==============================");

    await mongoose.connection.close();

  }

  catch (error) {

    console.error(
      "Database seeding failed:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);

  }

}

seedDatabase();