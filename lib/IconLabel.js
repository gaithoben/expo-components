import React, { useState } from 'react';
import Block from './Block';
import Text from './Text';

const IconLabel = ({ icon, label, size, color }) => {
  const [] = useState(0);

  return (
    <Block flex={false} row middle>
      {icon && <Block flex={false}>{icon}</Block>}
      <Block>
        <Text cropped style={{ fontSize: size, color }}>
          {label}
        </Text>
      </Block>
    </Block>
  );
};

IconLabel.defaultProps = {
  size: 24
};
export default IconLabel;
