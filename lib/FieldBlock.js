import React, { useState } from 'react';
import { sizes } from './theme';
import Block from './Block';
import Text from './Text';

const FieldBlock = ({ flex = false, label, ...props }) => {
  const [] = useState(0);

  return (
    <Block flex={flex} style={{ minHeight: sizes.inputHeight }} {...props}>
      {!!label && <Text>{label}</Text>}
      <Block flex={false} style={{ marginTop: 5, flexGrow: 1 }}>
        {props.children}
      </Block>
    </Block>
  );
};

export default FieldBlock;
