// @flow
import React from 'react';
// eslint-disable-next-line
import { Image, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import { Ionicons as VectorIcon } from '@expo/vector-icons';
import Block from '../Block';
import ThemeContext from '../theme/ThemeContext';

// let closeImage = require('./ios7-close-empty.png');

const CloseButton = ({ onPress }) => {
  const { colors } = React.useContext(ThemeContext);

  return (
    // if (image) closeImage = image;
    <Block flex={false} middle>
      <TouchableOpacity onPress={onPress}>
        <VectorIcon name="md-close" size={24} color={colors.dark} />
      </TouchableOpacity>
    </Block>
  );
};
CloseButton.propTypes = {
  onPress: PropTypes.func,
  image: PropTypes.any,
};

CloseButton.defaultProps = {
  onPress: () => {},
  image: '',
};

export default CloseButton;
