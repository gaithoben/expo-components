import React from 'react';
import { Marker } from 'react-native-maps';

const CustomMarker = ({ latlng, animated, children, ...props }) => {
  if (animated) {
    return (
      <Marker.Animated coordinate={latlng} {...props}>
        {children}
      </Marker.Animated>
    );
  }

  return (
    <Marker coordinate={latlng} {...props}>
      {children}
    </Marker>
  );
};

CustomMarker.defaultProps = {
  latlng: {
    latitude: -1.292066,
    longitude: 36.821946
  }
};
export default CustomMarker;
