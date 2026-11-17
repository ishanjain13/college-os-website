import React, { useEffect, useState } from 'react';

export function AnimatedCounter({
  value = 0,
  duration = 800,
  formatter = (val) => Math.round(val).toLocaleString(),
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startVal = displayValue;
    let endVal = Number(value) || 0;
    if (startVal === endVal) return;

    let startTime = null;

    const easeOutQuad = (t) => t * (2 - t);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = startVal + (endVal - startVal) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {formatter(displayValue)}
    </span>
  );
}

export default AnimatedCounter;
