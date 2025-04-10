const CircularProgress = ({ value, max }) => {
  const radius = 60;
  const stroke = 15;
  const normalizedRadius = radius - stroke / 2; // radius as 0-1 val
  const circumference = 2 * Math.PI * normalizedRadius;
  const percent = Math.min(Math.max(value / max, 0), 1); // percent as 0-1 val
  const strokeDashoffset = circumference * (1 - percent); // fill amt based on percent value

  // Color transition: from red (0%) to green (100%)
  const interpolateColor = (percent) => {
    const r = Math.round(255 * (1 - percent)); // how much is red
    const g = Math.round(255 * percent); // how much is green
    return `rgb(${r}, ${g}, 0)`; // put in full rgb component
  };

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#374151"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={interpolateColor(percent)}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="square"
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`} // start at top
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="25"
        fontWeight="bold"
        fill="#ffffff"
      >
        {Math.round(percent * 100)}
      </text>
    </svg>
  );
};

export default CircularProgress;
