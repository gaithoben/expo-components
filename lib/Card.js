import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { sizes, colors } from './theme';
import Block from './Block';

const Card = ({ color, style, children, rounded, ...props }) => {
  const cardStyles = [
    styles.card,
    style,
    rounded && { borderRadius: sizes.border },
  ];

  return (
    <Block color={color || colors.white} style={cardStyles} {...props}>
      {children}
    </Block>
  );
};

Card.defaultProps = {
  rounded: true,
};

export const styles = StyleSheet.create({
  card: {
    padding: sizes.base + 4,
    marginBottom: sizes.base,
  },
  shadow: {
    shadowColor: colors.black,
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 13,
  },
});

export default Card;
