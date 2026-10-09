import { useEffect, useState } from "react";


import RiskExplanation from "../components/RiskExplanation";
import KPICard from "../components/KPICard";
import RiskBadge from "../components/RiskBadge";
import AlertCard from "../components/AlertCard";

import {
  getAnalyticsSummary,
  getMaterialRisk,
} from "../services/api";

function Dashboard() {

    const [selectedMaterial, setSelectedMaterial] =
  useState(null);
  const [summary, setSummary] = useState(null);
  const [riskMaterials, setRiskMaterials] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        summaryResponse,
        riskResponse,
      ] = await Promise.all([
        getAnalyticsSummary(),
        getMaterialRisk(),
      ]);

      setSummary(summaryResponse.data);
      setRiskMaterials(riskResponse.data);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Dashboard</h1>

        <p className="error-message">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>SupplyGuard Dashboard</h1>

          <p>
            Raw-material and supplier
            disruption decision analytics
          </p>
        </div>
      </div>

      <div className="kpi-grid">

        <KPICard
          title="Total Materials"
          value={summary.totalMaterials}
          description="Materials being monitored"
        />

        <KPICard
          title="Total Suppliers"
          value={summary.totalSuppliers}
          description="Suppliers in the system"
        />

        <KPICard
          title="Active Disruptions"
          value={summary.activeDisruptions}
          description="Currently active disruptions"
          type="warning"
        />

        <KPICard
          title="High-Risk Materials"
          value={
            summary.highRiskMaterials +
            summary.criticalMaterials
          }
          description="Materials requiring attention"
          type="danger"
        />

      </div>

      <div className="dashboard-grid">

        <section className="dashboard-card">

          <div className="section-header">
            <div>
              <h2>
                Highest-Risk Materials
              </h2>

              <p>
                Materials requiring management
                attention
              </p>
            </div>
          </div>

          {riskMaterials
            .slice(0, 8)
            .map((material) => (
              <div
                className="risk-row"
                key={material.materialId}
                onClick={() =>
    setSelectedMaterial(material)
  }
              >

                <div>
                  <strong>
                    {material.materialName}
                  </strong>

                  <small>
                    {material.materialId} •{" "}
                    {material.supplierName ||
                      "No supplier"}
                  </small>
                </div>

                <div className="risk-row-right">

                  <span>
                    Score: {material.riskScore}
                  </span>

                  <RiskBadge
                    level={material.riskLevel}
                  />

                </div>

              </div>
            ))}

        </section>

        <section className="dashboard-card">

          <div className="section-header">
            <div>
              <h2>Risk Alerts</h2>

              <p>
                Important supply chain
                indicators
              </p>
            </div>
          </div>

          {summary.criticalMaterials > 0 && (
            <AlertCard
              title="Critical Materials"
              message={`${summary.criticalMaterials} material(s) have a critical risk level.`}
              type="danger"
            />
          )}

          {summary.highRiskMaterials > 0 && (
            <AlertCard
              title="High-Risk Materials"
              message={`${summary.highRiskMaterials} material(s) have a high risk level.`}
              type="warning"
            />
          )}

          {summary.activeDisruptions > 0 && (
            <AlertCard
              title="Active Disruptions"
              message={`${summary.activeDisruptions} disruption(s) are currently active.`}
              type="info"
            />
          )}

        </section>

      </div>

      <RiskExplanation
  material={selectedMaterial}
  onClose={() =>
    setSelectedMaterial(null)
  }
/>
    </div>
  );
}

export default Dashboard;