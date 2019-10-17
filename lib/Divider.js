import React from 'react';
import Block from './Block';
import { colors } from './theme';

const Divider = ({ height, width, color }) => {
  const dividerStyles = {
    borderBottomWidth: height || width,
    borderBottomColor: color,
  };

  return <Block flex={false} style={dividerStyles} />;
};

Divider.defaultProps = {
  width: 1,
  color: colors.gray,
};

export default Divider;
