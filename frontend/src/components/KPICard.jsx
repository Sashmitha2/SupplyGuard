function KPICard({
  title,
  value,
  description,
  type = "default",
}) {
  return (
    <div className={`kpi-card ${type}`}>
      <div className="kpi-title">
        {title}
      </div>

      <div className="kpi-value">
        {value}
      </div>

      <div className="kpi-description">
        {description}
      </div>
    </div>
  );
}

export default KPICard;