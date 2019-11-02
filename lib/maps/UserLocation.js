import React, { useState } from 'react';
import { Marker } from 'react-native-maps';
import { hexToRgb } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import Badge from '../Badge';
import Text from '../Text';
import ThemeContext from '../theme/ThemeContext';

const UserLocation = ({ latlng }) => {
  const { colors } = React.useContext(ThemeContext);
  const [] = useState(0);
  const dot = '.';

  return (
    <Marker coordinate={latlng}>
      <Badge
        padding={0}
        margin={0}
        style={{ backgroundColor: `rgba(${hexToRgb(colors.pink)}, 0.3)` }}
        size={42}
      >
        <Badge style={{ position: 'absolute' }} size={28}>
          <MaterialIcons
            name="location-on"
            style={{
              color: colors.pink,
              fontSize: 24,
              marginRight: -5,
              marginTop: -5,
              transform: [{ rotate: '-135deg' }],
              zIndex: -1,
            }}
          />
        </Badge>
        <Badge
          style={{
            backgroundColor: `rgba(${hexToRgb(colors.pink)}, 0.3)`,
          }}
          size={28}
        >
          <Badge
            style={{
              backgroundColor: colors.pink,
              borderWidth: 2,
              borderColor: colors.milkyWhite,
              zIndex: 1,
            }}
            size={15}
          />
        </Badge>
      </Badge>
    </Marker>
  );
};

UserLocation.defaultProps = {
  latlng: {
    latitude: -1.292066,
    longitude: 36.821946,
  },
};

export default UserLocation;
