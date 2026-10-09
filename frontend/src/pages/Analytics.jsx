
import { useEffect, useState } from "react";

import {
  getMaterialRisk,
  getSupplierRisk,
  getDisruptionAnalytics,
} from "../services/api";

import RiskBadge from "../components/RiskBadge";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [materials, setMaterials] =
    useState([]);

  const [suppliers, setSuppliers] =
    useState([]);

  const [disruptions, setDisruptions] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [
        materialResponse,
        supplierResponse,
        disruptionResponse,
      ] = await Promise.all([
        getMaterialRisk(),
        getSupplierRisk(),
        getDisruptionAnalytics(),
      ]);

      setMaterials(
        materialResponse.data
      );

      setSuppliers(
        supplierResponse.data
      );

      setDisruptions(
        disruptionResponse.data
      );
    } catch (error) {
      console.error(
        "Error loading analytics:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  /* =========================
     CHART COLORS
  ========================= */

  const RISK_COLORS = {
    Low: "#27AE9A",
    Medium: "#F2C94C",
    High: "#F2994A",
    Critical: "#EB5757",
  };

  const DISRUPTION_COLORS = {
    Active: "#EB5757",
    Monitoring: "#F2C94C",
    Resolved: "#27AE9A",
  };

  const TYPE_COLORS = [
    "#2F80ED",
    "#9B51E0",
    "#F2994A",
    "#27AE9A",
    "#EB5757",
    "#F2C94C",
  ];

  /* =========================
     MATERIAL RISK DATA
  ========================= */

  const materialRiskData = [
    {
      name: "Low",
      value: materials.filter(
        (m) => m.riskLevel === "LOW"
      ).length,
    },
    {
      name: "Medium",
      value: materials.filter(
        (m) => m.riskLevel === "MEDIUM"
      ).length,
    },
    {
      name: "High",
      value: materials.filter(
        (m) => m.riskLevel === "HIGH"
      ).length,
    },
    {
      name: "Critical",
      value: materials.filter(
        (m) => m.riskLevel === "CRITICAL"
      ).length,
    },
  ];

  /* =========================
     SUPPLIER RISK DATA
  ========================= */

  const supplierRiskData = [
    {
      name: "Low",
      value: suppliers.filter(
        (s) => s.riskLevel === "LOW"
      ).length,
    },
    {
      name: "Medium",
      value: suppliers.filter(
        (s) => s.riskLevel === "MEDIUM"
      ).length,
    },
    {
      name: "High",
      value: suppliers.filter(
        (s) => s.riskLevel === "HIGH"
      ).length,
    },
    {
      name: "Critical",
      value: suppliers.filter(
        (s) => s.riskLevel === "CRITICAL"
      ).length,
    },
  ];

  /* =========================
     DISRUPTION STATUS
  ========================= */

  const disruptionStatusData = [
    {
      name: "Active",
      value: disruptions?.active || 0,
    },
    {
      name: "Monitoring",
      value:
        disruptions?.monitoring || 0,
    },
    {
      name: "Resolved",
      value:
        disruptions?.resolved || 0,
    },
  ];

  /* =========================
     DISRUPTION TYPE
  ========================= */

  const disruptionTypeData =
    Object.entries(
      disruptions?.byType || {}
    ).map(([name, value]) => ({
      name,
      value,
    }));

  /* =========================
     TOP SUPPLIERS
  ========================= */

  const supplierReliabilityData =
    [...suppliers]
      .sort(
        (a, b) =>
          a.reliabilityScore -
          b.reliabilityScore
      )
      .slice(0, 10)
      .map((supplier) => ({
        name: supplier.supplierName,
        reliability:
          supplier.reliabilityScore,
      }));

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>
            Decision Analytics
          </h1>

          <p>
            Risk analysis across materials,
            suppliers and disruptions.
          </p>
        </div>

      </div>

      {/* =====================
          CHARTS
      ===================== */}

      <div className="chart-grid">

        {/* =====================
            MATERIAL RISK
        ===================== */}

        <div className="chart-card">

          <h2>
            Material Risk Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={materialRiskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {materialRiskData.map(
                  (entry, index) => (
                    <Cell
                      key={`material-cell-${index}`}
                      fill={
                        RISK_COLORS[
                          entry.name
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* =====================
            SUPPLIER RISK
        ===================== */}

        <div className="chart-card">

          <h2>
            Supplier Risk Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={supplierRiskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {supplierRiskData.map(
                  (entry, index) => (
                    <Cell
                      key={`supplier-cell-${index}`}
                      fill={
                        RISK_COLORS[
                          entry.name
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* =====================
            DISRUPTION STATUS
        ===================== */}

        <div className="chart-card">

          <h2>
            Disruption Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={disruptionStatusData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                name="Disruptions"
              >
                {disruptionStatusData.map(
                  (entry, index) => (
                    <Cell
                      key={`status-cell-${index}`}
                      fill={
                        DISRUPTION_COLORS[
                          entry.name
                        ]
                      }
                    />
                  )
                )}
              </Bar>

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* =====================
            DISRUPTIONS BY TYPE
        ===================== */}

        <div className="chart-card">

          <h2>
            Disruptions by Type
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={disruptionTypeData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                height={80}
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                name="Disruptions"
              >
                {disruptionTypeData.map(
                  (entry, index) => (
                    <Cell
                      key={`type-cell-${index}`}
                      fill={
                        TYPE_COLORS[
                          index %
                            TYPE_COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Bar>

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* =====================
          SUPPLIER RELIABILITY
      ===================== */}

      <section className="analytics-section">

        <div className="chart-card">

          <h2>
            Lowest Supplier Reliability
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={
                supplierReliabilityData
              }
              layout="vertical"
              margin={{
                left: 30,
                right: 30,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
                domain={[0, 100]}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={140}
              />

              <Tooltip />

              <Bar
                dataKey="reliability"
                name="Reliability %"
                fill="#2F80ED"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </section>

      {/* =====================
          MATERIAL TABLE
      ===================== */}

      <section className="analytics-section">

        <div className="section-header">

          <h2>
            Material Risk Analysis
          </h2>

          <p>
            Materials ranked according to
            calculated supply risk.
          </p>

        </div>

        <div className="table-card">

          <table>

            <thead>
              <tr>
                <th>Material</th>
                <th>Stock Coverage</th>
                <th>Supplier Reliability</th>
                <th>Active Disruptions</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>

            <tbody>

              {materials
                .slice(0, 20)
                .map((material) => (
                  <tr
                    key={
                      material.materialId
                    }
                  >

                    <td>
                      <strong>
                        {material.materialName}
                      </strong>

                      <small>
                        {material.materialId}
                      </small>
                    </td>

                    <td>
                      {material.daysOfStock}
                      {" "}
                      days
                    </td>

                    <td>
                      {
                        material.supplierReliability
                      }
                      %
                    </td>

                    <td>
                      {
                        material.activeDisruptions
                      }
                    </td>

                    <td>
                      {material.riskScore}
                    </td>

                    <td>
                      <RiskBadge
                        level={
                          material.riskLevel
                        }
                      />
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Analytics;
