import React, { useState } from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { Images } from '../theme';
import Block from '../Block';
import Badge from '../Badge';
import Text from '../Text';
import ThemeContext from '../theme/ThemeContext';

const VehicleMarker = ({ latlng, image }) => {
  const { colors } = React.useContext(ThemeContext);
  const [] = useState(0);

  return (
    <Marker coordinate={latlng}>
      <Image
        resizeMode="contain"
        source={image}
        style={{ width: 48, height: 32 }}
      />
    </Marker>
  );
};

VehicleMarker.defaultProps = {
  latlng: {
    latitude: -1.292066,
    longitude: 36.831946,
  },
  image: Images.CarMarker,
};
export default VehicleMarker;
