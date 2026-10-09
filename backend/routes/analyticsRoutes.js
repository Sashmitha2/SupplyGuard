const express = require("express");

const Material = require("../models/Material");
const Supplier = require("../models/Supplier");
const Disruption = require("../models/Disruption");

const router = express.Router();

/*
========================================================
HELPER FUNCTION
Calculate material risk
========================================================
*/

function calculateMaterialRisk(material, supplier, activeDisruptions) {
  const reasons = [];

  // Calculate stock coverage
  let daysOfStock = 0;

  if (material.dailyConsumption > 0) {
    daysOfStock =
      material.currentStock / material.dailyConsumption;
  }

  // Risk score
  let riskScore = 0;

  /*
  ------------------------------------------------------
  1. Stock vs Safety Stock
  ------------------------------------------------------
  */

  if (material.currentStock < material.safetyStock) {
    riskScore += 25;

    reasons.push(
      "Current stock is below the required safety stock level."
    );
  }

  /*
  ------------------------------------------------------
  2. Stock coverage vs Supplier Lead Time
  ------------------------------------------------------
  */

  if (supplier && daysOfStock < supplier.leadTimeDays) {
    riskScore += 25;

    reasons.push(
      "Available stock does not cover the supplier lead time."
    );
  }

  /*
  ------------------------------------------------------
  3. Supplier Reliability
  ------------------------------------------------------
  */

  if (supplier) {
    if (supplier.reliabilityScore < 70) {
      riskScore += 20;

      reasons.push(
        "Supplier reliability is below the acceptable threshold."
      );
    } else if (supplier.reliabilityScore < 80) {
      riskScore += 10;

      reasons.push(
        "Supplier reliability is moderate."
      );
    }
  }

  /*
  ------------------------------------------------------
  4. Active Disruptions
  ------------------------------------------------------
  */

  if (activeDisruptions.length > 0) {
    riskScore += 20;

    reasons.push(
      "An active disruption is affecting this material or its supplier."
    );
  }

  /*
  ------------------------------------------------------
  5. Material Criticality
  ------------------------------------------------------
  */

  if (material.criticality === "CRITICAL") {
    riskScore += 10;

    reasons.push(
      "The material has CRITICAL business importance."
    );
  } else if (material.criticality === "HIGH") {
    riskScore += 5;

    reasons.push(
      "The material has HIGH business importance."
    );
  }

  /*
  ------------------------------------------------------
  Determine risk level
  ------------------------------------------------------
  */

  let riskLevel = "LOW";

  if (riskScore >= 70) {
    riskLevel = "CRITICAL";
  } else if (riskScore >= 50) {
    riskLevel = "HIGH";
  } else if (riskScore >= 25) {
    riskLevel = "MEDIUM";
  }

  /*
  ------------------------------------------------------
  If no reasons were generated
  ------------------------------------------------------
  */

  if (reasons.length === 0) {
    reasons.push(
      "No major supply risk indicators were identified."
    );
  }

  return {
    riskScore,
    riskLevel,
    daysOfStock: Number(daysOfStock.toFixed(2)),
    reasons,
  };
}


/*
========================================================
1. GET ANALYTICS SUMMARY
========================================================

GET /api/analytics/summary
*/

router.get("/summary", async (req, res) => {
  try {
    const materials = await Material.find();
    const suppliers = await Supplier.find();
    const disruptions = await Disruption.find();

    const activeDisruptions = disruptions.filter(
      (disruption) => disruption.status === "ACTIVE"
    );

    let highRiskMaterials = 0;
    let criticalMaterials = 0;

    for (const material of materials) {
      const supplier = suppliers.find(
        (supplier) =>
          supplier.supplierId === material.supplierId
      );

      const materialDisruptions = activeDisruptions.filter(
        (disruption) =>
          disruption.materialId === material.materialId ||
          disruption.supplierId === material.supplierId
      );

      const risk = calculateMaterialRisk(
        material,
        supplier,
        materialDisruptions
      );

      if (risk.riskLevel === "HIGH") {
        highRiskMaterials++;
      }

      if (risk.riskLevel === "CRITICAL") {
        criticalMaterials++;
      }
    }

    res.json({
      totalMaterials: materials.length,
      totalSuppliers: suppliers.length,
      totalDisruptions: disruptions.length,
      activeDisruptions: activeDisruptions.length,
      highRiskMaterials,
      criticalMaterials,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating analytics summary",
      error: error.message,
    });
  }
});


/*
========================================================
2. GET MATERIAL RISK
========================================================

GET /api/analytics/material-risk
*/

router.get("/material-risk", async (req, res) => {
  try {
    const materials = await Material.find();
    const suppliers = await Supplier.find();
    const disruptions = await Disruption.find();

    const activeDisruptions = disruptions.filter(
      (disruption) => disruption.status === "ACTIVE"
    );

    const results = materials.map((material) => {
      const supplier = suppliers.find(
        (supplier) =>
          supplier.supplierId === material.supplierId
      );

      const materialDisruptions = activeDisruptions.filter(
        (disruption) =>
          disruption.materialId === material.materialId ||
          disruption.supplierId === material.supplierId
      );

      const risk = calculateMaterialRisk(
        material,
        supplier,
        materialDisruptions
      );

      return {
        materialId: material.materialId,
        materialName: material.materialName,
        category: material.category,
        currentStock: material.currentStock,
        safetyStock: material.safetyStock,
        dailyConsumption: material.dailyConsumption,

        daysOfStock: risk.daysOfStock,

        criticality: material.criticality,

        supplierId: supplier
          ? supplier.supplierId
          : null,

        supplierName: supplier
          ? supplier.supplierName
          : null,

        supplierLeadTime: supplier
          ? supplier.leadTimeDays
          : null,

        supplierReliability: supplier
          ? supplier.reliabilityScore
          : null,

        activeDisruptions:
          materialDisruptions.length,

        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,

        reasons: risk.reasons,
      };
    });

    // Highest risk first
    results.sort(
      (a, b) => b.riskScore - a.riskScore
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error calculating material risk",
      error: error.message,
    });
  }
});


/*
========================================================
3. GET SUPPLIER RISK
========================================================

GET /api/analytics/supplier-risk
*/

router.get("/supplier-risk", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    const disruptions = await Disruption.find();

    const results = suppliers.map((supplier) => {
      const supplierDisruptions =
        disruptions.filter(
          (disruption) =>
            disruption.supplierId ===
            supplier.supplierId
        );

      const activeDisruptions =
        supplierDisruptions.filter(
          (disruption) =>
            disruption.status === "ACTIVE"
        );

      let riskScore = 0;
      const reasons = [];

      /*
      Supplier reliability
      */

      if (supplier.reliabilityScore < 60) {
        riskScore += 50;

        reasons.push(
          "Supplier reliability is very low."
        );
      } else if (supplier.reliabilityScore < 70) {
        riskScore += 35;

        reasons.push(
          "Supplier reliability is below 70%."
        );
      } else if (supplier.reliabilityScore < 80) {
        riskScore += 20;

        reasons.push(
          "Supplier reliability is moderate."
        );
      }

      /*
      Lead time
      */

      if (supplier.leadTimeDays > 20) {
        riskScore += 25;

        reasons.push(
          "Supplier lead time is high."
        );
      } else if (supplier.leadTimeDays > 14) {
        riskScore += 15;

        reasons.push(
          "Supplier lead time is relatively long."
        );
      }

      /*
      Active disruptions
      */

      if (activeDisruptions.length > 0) {
        riskScore += 25;

        reasons.push(
          "Supplier is currently affected by active disruptions."
        );
      }

      /*
      Determine risk
      */

      let riskLevel = "LOW";

      if (riskScore >= 70) {
        riskLevel = "CRITICAL";
      } else if (riskScore >= 50) {
        riskLevel = "HIGH";
      } else if (riskScore >= 25) {
        riskLevel = "MEDIUM";
      }

      if (reasons.length === 0) {
        reasons.push(
          "No major supplier risk indicators were identified."
        );
      }

      return {
        supplierId: supplier.supplierId,
        supplierName: supplier.supplierName,
        country: supplier.country,

        leadTimeDays: supplier.leadTimeDays,

        reliabilityScore:
          supplier.reliabilityScore,

        materialsSupplied:
          supplier.materialsSupplied,

        totalDisruptions:
          supplierDisruptions.length,

        activeDisruptions:
          activeDisruptions.length,

        riskScore,
        riskLevel,

        reasons,
      };
    });

    results.sort(
      (a, b) => b.riskScore - a.riskScore
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error calculating supplier risk",
      error: error.message,
    });
  }
});


/*
========================================================
4. GET DISRUPTION ANALYTICS
========================================================

GET /api/analytics/disruptions
*/

router.get("/disruptions", async (req, res) => {
  try {
    const disruptions = await Disruption.find();

    const total = disruptions.length;

    const active = disruptions.filter(
      (d) => d.status === "ACTIVE"
    ).length;

    const resolved = disruptions.filter(
      (d) => d.status === "RESOLVED"
    ).length;

    const monitoring = disruptions.filter(
      (d) => d.status === "MONITORING"
    ).length;

    const highSeverity = disruptions.filter(
      (d) => d.severity === "HIGH"
    ).length;

    const criticalSeverity = disruptions.filter(
      (d) => d.severity === "CRITICAL"
    ).length;

    // Count disruption types
    const typeCounts = {};

    disruptions.forEach((disruption) => {
      if (!typeCounts[disruption.type]) {
        typeCounts[disruption.type] = 0;
      }

      typeCounts[disruption.type]++;
    });

    // Count disruption regions
    const regionCounts = {};

    disruptions.forEach((disruption) => {
      if (!regionCounts[disruption.region]) {
        regionCounts[disruption.region] = 0;
      }

      regionCounts[disruption.region]++;
    });

    res.json({
      total,
      active,
      resolved,
      monitoring,

      highSeverity,
      criticalSeverity,

      byType: typeCounts,
      byRegion: regionCounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating disruption analytics",
      error: error.message,
    });
  }
});


/*
========================================================
5. GET CRITICAL MATERIALS
========================================================

GET /api/analytics/critical-materials
*/

router.get("/critical-materials", async (req, res) => {
  try {
    const materials = await Material.find({
      criticality: {
        $in: ["HIGH", "CRITICAL"],
      },
    });

    const suppliers = await Supplier.find();
    const disruptions = await Disruption.find();

    const activeDisruptions = disruptions.filter(
      (disruption) =>
        disruption.status === "ACTIVE"
    );

    const results = materials.map((material) => {
      const supplier = suppliers.find(
        (supplier) =>
          supplier.supplierId ===
          material.supplierId
      );

      const materialDisruptions =
        activeDisruptions.filter(
          (disruption) =>
            disruption.materialId ===
              material.materialId ||
            disruption.supplierId ===
              material.supplierId
        );

      const risk = calculateMaterialRisk(
        material,
        supplier,
        materialDisruptions
      );

      return {
        materialId: material.materialId,
        materialName: material.materialName,

        criticality: material.criticality,

        currentStock:
          material.currentStock,

        safetyStock:
          material.safetyStock,

        dailyConsumption:
          material.dailyConsumption,

        daysOfStock:
          risk.daysOfStock,

        supplierId:
          material.supplierId,

        supplierName:
          supplier
            ? supplier.supplierName
            : null,

        supplierLeadTime:
          supplier
            ? supplier.leadTimeDays
            : null,

        supplierReliability:
          supplier
            ? supplier.reliabilityScore
            : null,

        activeDisruptions:
          materialDisruptions.length,

        riskScore:
          risk.riskScore,

        riskLevel:
          risk.riskLevel,

        reasons:
          risk.reasons,
      };
    });

    results.sort(
      (a, b) => b.riskScore - a.riskScore
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving critical materials",
      error: error.message,
    });
  }
});


module.exports = router;