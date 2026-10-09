function RiskExplanation({
  material,
  onClose,
}) {
  if (!material) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="risk-modal">

        <div className="modal-header">

          <div>
            <h2>
              Risk Explanation
            </h2>

            <p>
              {material.materialName}
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="risk-summary">

          <div>
            <span>
              Risk Score
            </span>

            <strong>
              {material.riskScore}
            </strong>
          </div>

          <div>
            <span>
              Risk Level
            </span>

            <strong>
              {material.riskLevel}
            </strong>
          </div>

          <div>
            <span>
              Stock Coverage
            </span>

            <strong>
              {material.daysOfStock} days
            </strong>
          </div>

        </div>

        <div className="risk-details">

          <h3>
            Why is this material at risk?
          </h3>

          <ul>

            {material.reasons?.map(
              (reason, index) => (
                <li key={index}>
                  {reason}
                </li>
              )
            )}

          </ul>

        </div>

        <div className="risk-details">

          <h3>
            Supplier Information
          </h3>

          <p>
            <strong>
              Supplier:
            </strong>{" "}
            {material.supplierName ||
              "Not available"}
          </p>

          <p>
            <strong>
              Reliability:
            </strong>{" "}
            {material.supplierReliability !==
            null
              ? `${material.supplierReliability}%`
              : "N/A"}
          </p>

          <p>
            <strong>
              Lead Time:
            </strong>{" "}
            {material.supplierLeadTime !==
            null
              ? `${material.supplierLeadTime} days`
              : "N/A"}
          </p>

        </div>

      </div>

    </div>
  );
}

export default RiskExplanation;