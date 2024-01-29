import React from 'react';
import AdFit from "./AdFit";

/**
 * 1. DAN-mhiKCkCNnnFtwxGh
 * 2. DAN-ECUZO05s14SU0P7d
 * 3. DAN-kjanuOssm1H2Rd7Z
 * 4. DAN-h9aPNdWQH8MvhaeY
 * 5. DAN-MKrQwsmxT8uLhukP
 * 6. DAN-xs0r56ZGEL2yMihi
 * 7. DAN-ToBFS44DTfrAHzOv
 * 8. DAN-cQauA1ifRr7lrdqY
 * 9. DAN-YpQyMBCxi1vg3gJM
 * 10. DAN-MbgKf77ax95JqLJl

 */

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
