function AlertCard({
  title,
  message,
  type = "warning",
}) {
  return (
    <div className={`alert-card ${type}`}>
      <div className="alert-card-title">
        {title}
      </div>

      <div className="alert-card-message">
        {message}
      </div>
    </div>
  );
}

export default AlertCard;