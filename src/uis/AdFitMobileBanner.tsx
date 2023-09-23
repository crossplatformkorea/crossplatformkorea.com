import React from 'react';
import AdFit from "./AdFit";

export default function AdFitMobileBanner({
  unit,
  className,
  height = 100,
  width = 320,
  style,
}: {
  unit: string;
  className: string;
  height?: number;
  width?: number,
  style?: React.CSSProperties,
}): JSX.Element {
  return (
    <AdFit
      unit={unit}
      height={height}
      width={width}
      className={className}
      style={{
        flex: 1,
        marginTop: 24,
        marginBottom: 24,
        ...style,
      }}
    />
  );
}
