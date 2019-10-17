import React from 'react';
import { TouchableOpacity } from 'react-native';

import Badge from './Badge';

const IconButton = ({ children, onPress, disabled, ...props }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress}>
    <Badge {...props}>{children}</Badge>
  </TouchableOpacity>
);

export default IconButton;
