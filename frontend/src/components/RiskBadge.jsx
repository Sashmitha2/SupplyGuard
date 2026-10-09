function RiskBadge({ level }) {
  return (
    <span
      className={`risk-badge risk-${level?.toLowerCase()}`}
    >
      {level}
    </span>
  );
}

export default RiskBadge;