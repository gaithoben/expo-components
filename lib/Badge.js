import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import Block from './Block';

const Badge = ({ children, style, size, color, ...props }) => {
  const badgeStyles = StyleSheet.flatten([
    !size && { padding: 5 },
    size && {
      height: size,
      width: size,
      borderRadius: size
    },
    Array.isArray(style) ? [...style] : style
  ]);

  return (
    <Block
      flex={false}
      middle
      center
      color={color}
      style={badgeStyles}
      {...props}
    >
      {children}
    </Block>
  );
};

Badge.defaultProps = {
  size: 42
};

export default Badge;
