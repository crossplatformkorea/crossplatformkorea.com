import React from 'react';
import AdFit from "./AdFit";

export default function AdFitTopFixed(): JSX.Element {
  return (
    <AdFit
      unit="DAN-weLLBNA8C31gpo1t"
      height={100}
      width={320}
      className="adfit-top-mobile"
      style={{
        flex: 1,
        marginTop: 24,
        marginBottom: 24,
      }}
    />
  );
}
