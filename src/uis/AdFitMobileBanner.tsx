import React from 'react';
import AdFit from "./AdFit";

export default function AdFitMobileBanner({
  unit,
  className
}: {
  unit: string;
  className: string;
}): JSX.Element {
  return (
    <AdFit
      unit={unit}
      height={100}
      width={320}
      className={className}
      style={{
        flex: 1,
        marginTop: 24,
        marginBottom: 24,
      }}
    />
  );
}
