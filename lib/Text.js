// just copy this code from the driving repo :)
import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

import { fonts, colors, sizes } from './theme';

export default class Typography extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      h1,
      h2,
      h3,
      title,
      header,
      body,
      caption,
      small,
      size,
      transform,
      // styling
      fontFamily,
      regular,
      bold,
      semibold,
      medium,
      weight,
      light,
      center,
      right,
      spacing, // letter-spacing
      height, // line-height
      // colors
      color,
      accent,
      primary,
      secondary,
      tertiary,
      black,
      white,
      gray,
      gray2,
      dark,
      mistywhite,
      milkywhite,
      error,
      clear,
      facebook,
      transparent,
      silver,
      steel,
      ricePaper,
      frost,
      cloud,
      windowTint,
      panther,
      charcoal,
      coal,
      bloodOrange,
      snow,
      ember,
      fire,
      drawer,
      eggplant,
      style,
      children,
      ...props
    } = this.props;

    const textStyles = [
      styles.text,
      fontFamily && { fontFamily },
      h1 && styles.h1,
      h2 && styles.h2,
      h3 && styles.h3,
      title && styles.title,
      header && styles.header,
      body && styles.body,
      caption && styles.caption,
      small && styles.small,
      size && { fontSize: size },
      transform && { textTransform: transform },
      height && { lineHeight: height },
      spacing && { letterSpacing: spacing },
      weight && { fontWeight: weight },
      regular && styles.regular,
      bold && styles.bold,
      semibold && styles.semibold,
      medium && styles.medium,
      light && styles.light,
      center && styles.center,
      right && styles.right,
      color && styles[color],
      color && !styles[color] && { color },
      // color shortcuts
      accent && styles.accent,
      primary && styles.primary,
      secondary && styles.secondary,
      tertiary && styles.tertiary,
      black && styles.black,
      white && styles.white,
      gray && styles.gray,
      gray2 && styles.gray2,
      dark && styles.dark,
      error && styles.error,
      mistywhite && styles.mistywhite,
      milkywhite && styles.milkywhite,
      clear && styles.clear,
      facebook && styles.facebook,
      transparent && styles.transparent,
      silver && styles.silver,
      steel && styles.steel,
      error && styles.error,
      ricePaper && styles.ricePaper,
      frost && styles.frost,
      cloud && styles.cloud,
      windowTint && styles.windowTint,
      panther && styles.panther,
      charcoal && styles.charcoal,
      coal && styles.coal,
      bloodOrange && styles.bloodOrange,
      snow && styles.snow,
      ember && styles.ember,
      fire && styles.fire,
      drawer && styles.drawer,
      eggplant && styles.eggplant,
      style, // rewrite predefined styles
    ];

    return (
      <Text style={textStyles} {...props}>
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  // default style
  text: {
    fontSize: sizes.font,
    color: colors.black,
  },
  // variations
  regular: {
    fontWeight: 'normal',
  },
  bold: {
    fontWeight: 'bold',
  },
  semibold: {
    fontWeight: '500',
  },
  medium: {
    fontWeight: '500',
  },
  light: {
    fontWeight: '200',
  },
  // position
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  // colors
  accent: { color: colors.accent },
  primary: { color: colors.primary },
  secondary: { color: colors.secondary },
  tertiary: { color: colors.tertiary },
  black: { color: colors.black },
  white: { color: colors.white },
  gray: { color: colors.gray },
  gray2: { color: colors.gray2 },
  dark: { color: colors.dark },
  mistywhite: { color: colors.mistywhite },
  milkywhite: { color: colors.milkywhite },
  error: { color: colors.error },
  clear: { color: colors.clear },
  facebook: { color: colors.facebook },
  transparent: { color: colors.transparent },
  silver: { color: colors.silver },
  steel: { color: colors.steel },
  ricePaper: { color: colors.ricePaper },
  frost: { color: colors.frost },
  cloud: { color: colors.cloud },
  windowTint: { color: colors.windowTint },
  panther: { color: colors.panther },
  charcoal: { color: colors.charcoal },
  coal: { color: colors.coal },
  bloodOrange: { color: colors.bloodOrange },
  snow: { color: colors.snow },
  ember: { color: colors.ember },
  fire: { color: colors.fire },
  drawer: { color: colors.drawer },
  eggplant: { color: colors.eggplant },
  // fonts
  h1: fonts.h1,
  h2: fonts.h2,
  h3: fonts.h3,
  title: fonts.title,
  header: fonts.header,
  body: fonts.body,
  caption: fonts.caption,
  small: fonts.small,
});
