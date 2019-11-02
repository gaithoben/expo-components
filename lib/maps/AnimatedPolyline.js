import React, { Fragment, useState } from 'react';
import RNMapView from 'react-native-maps';
import useInterval from '../useInterval';

import ThemeContext from '../theme/ThemeContext';

const AnimatedPolyline = ({ chunks, color }) => {
  const { colors } = React.useContext(ThemeContext);
  const [chuckindex, setChunkIndex] = useState(0);
  const [delay, setDelay] = useState(70);

  const animatePolyline = () => {
    if (delay !== 70) {
      setDelay(70);
    }
    if (chuckindex < chunks.length - 1) {
      setChunkIndex(chuckindex + 1);
    } else {
      setDelay(2000);
      setChunkIndex(0);
    }
  };

  useInterval(() => {
    animatePolyline();
  }, delay);

  return (
    <Fragment>
      {chunks.length > 1 && (
        <RNMapView.Polyline
          coordinates={chunks[chuckindex]}
          strokeWidth={4}
          geodesic
          strokeColor={color}
        />
      )}
    </Fragment>
  );
};

AnimatedPolyline.defaultProps = {
  chunks: [[]],
  color: colors.dark,
};

export default AnimatedPolyline;
