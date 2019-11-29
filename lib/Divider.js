import React from 'react';
import Block from './Block';
import ThemeContext from './theme/ThemeContext';

import { colors as themecolors } from './theme';

const Divider = ({ height, width, color }) => {
  const { colors } = React.useContext(ThemeContext);

  const dividerStyles = {
    borderBottomWidth: height || width,
    borderBottomColor: color
  };

  return <Block flex={false} style={dividerStyles} />;
};

Divider.defaultProps = {
  width: 1,
  color: themecolors.gray
};

export default Divider;
