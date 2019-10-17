import React from 'react';
import RNMapView from 'react-native-maps';
import { colors } from '../theme';

const CustomPolyline = ({ coordinates, color }) => (
  // const [] = useState(0);
  <RNMapView.Polyline
    coordinates={coordinates}
    strokeWidth={4}
    geodesic
    strokeColor={color}
  />
);
CustomPolyline.defaultProps = {
  coordinates: [],
  colors: colors.dark,
};

export default CustomPolyline;
