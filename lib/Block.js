// just copy this code from the driving repo :)

import React, { Component } from 'react';
import { StyleSheet, View, Animated, Platform, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { sizes, colors } from './theme';

const android = Platform.OS === 'android';

export default class Block extends Component {
  handleMargins() {
    const { margin } = this.props;
    if (typeof margin === 'number') {
      return {
        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,
      };
    }

    if (typeof margin === 'object') {
      const marginSize = Object.keys(margin).length;
      switch (marginSize) {
        case 1:
          return {
            marginTop: margin[0],
            marginRight: margin[0],
            marginBottom: margin[0],
            marginLeft: margin[0],
          };
        case 2:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[0],
            marginLeft: margin[1],
          };
        case 3:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[1],
          };
        default:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[3],
          };
      }
    }
  }

  handlePaddings() {
    const { padding } = this.props;
    if (typeof padding === 'number') {
      return {
        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingLeft: padding,
      };
    }

    if (typeof padding === 'object') {
      const paddingSize = Object.keys(padding).length;
      switch (paddingSize) {
        case 1:
          return {
            paddingTop: padding[0],
            paddingRight: padding[0],
            paddingBottom: padding[0],
            paddingLeft: padding[0],
          };
        case 2:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[0],
            paddingLeft: padding[1],
          };
        case 3:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[1],
          };
        default:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[3],
          };
      }
    }
  }

  render() {
    const {
      flex,
      row,
      center,
      middle,
      left,
      right,
      top,
      bottom,
      margin,
      padding,
      absolute,
      card,
      shadow,
      shadowTop,
      elevation,
      color,
      space,
      style,
      animated,
      animatable,
      scrollView,
      children,
      ...props
    } = this.props;

    const blockStyles = [
      styles.block,
      flex && { flex: 1 },
      flex === false && { flex: 0 }, // reset / disable flex
      row && styles.row,
      !row && styles.column,
      center && (row ? { justifyContent: 'center' } : { alignItems: 'center' }),
      middle && (row ? { alignItems: 'center' } : { justifyContent: 'center' }),
      left &&
        (row ? { justifyContent: 'flex-start' } : { alignItems: 'flex-start' }),
      right &&
        (row ? { justifyContent: 'flex-end' } : { alignItems: 'flex-end' }),
      top &&
        (row ? { alignItems: 'flex-start' } : { justifyContent: 'flex-start' }),
      bottom &&
        (row ? { alignItems: 'flex-end' } : { justifyContent: 'flex-end' }),
      margin && { ...this.handleMargins() },
      padding && { ...this.handlePaddings() },
      absolute && styles.absolute,
      card && styles.card,
      shadow && styles.shadow,
      shadowTop && styles.shadowTop,
      elevation && { elevation },
      space && { justifyContent: `space-${space}` },
      color && styles[color], // predefined styles colors for backgroundColor
      color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
      style, // rewrite predefined styles
    ];

    if (animated) {
      return (
        <Animated.View style={blockStyles} {...props}>
          {children}
        </Animated.View>
      );
    }

    if (scrollView) {
      return (
        <ScrollView style={blockStyles} {...props}>
          {children}
        </ScrollView>
      );
    }

    if (animatable) {
      return (
        <Animatable.View style={blockStyles} {...props}>
          {children}
        </Animatable.View>
      );
    }

    return (
      <View style={blockStyles} {...props}>
        {children}
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },

  card: {
    borderRadius: sizes.border,
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: android ? 10 : 1,
  },
  shadowTop: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: android ? 10 : 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  accent: { backgroundColor: colors.accent },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  tertiary: { backgroundColor: colors.tertiary },
  black: { backgroundColor: colors.black },
  white: { backgroundColor: colors.white },
  gray: { backgroundColor: colors.gray },
  gray2: { backgroundColor: colors.gray2 },
  gray3: { backgroundColor: colors.gray3 },
  gray4: { backgroundColor: colors.gray4 },
  dark: { backgroundColor: colors.dark },
  mistyWhite: { backgroundColor: colors.mistyWhite },
  milkyWhite: { backgroundColor: colors.milkyWhite },
  error: { backgroundColor: colors.error },
  clear: { backgroundColor: colors.clear },
  facebook: { backgroundColor: colors.facebook },
  transparent: { backgroundColor: colors.transparent },
  silver: { backgroundColor: colors.silver },
  steel: { backgroundColor: colors.steel },
  ricePaper: { backgroundColor: colors.ricePaper },
  frost: { backgroundColor: colors.frost },
  cloud: { backgroundColor: colors.cloud },
  windowTint: { backgroundColor: colors.windowTint },
  panther: { backgroundColor: colors.panther },
  charcoal: { backgroundColor: colors.charcoal },
  coal: { backgroundColor: colors.coal },
  bloodOrange: { backgroundColor: colors.bloodOrange },
  snow: { backgroundColor: colors.snow },
  ember: { backgroundColor: colors.ember },
  fire: { backgroundColor: colors.fire },
  drawer: { backgroundColor: colors.drawer },
  eggplant: { backgroundColor: colors.eggplant },

  twitterColor: { backgroundColor: colors.twitterColor },
  facebookColor: { backgroundColor: colors.twitterColor },
  googleColor: { backgroundColor: colors.twitterColor },
  linkedinColor: { backgroundColor: colors.twitterColor },
  pinterestColor: { backgroundColor: colors.twitterColor },
  youtubeColor: { backgroundColor: colors.twitterColor },
  tumblrColor: { backgroundColor: colors.twitterColor },
  behanceColor: { backgroundColor: colors.twitterColor },
  dribbbleColor: { backgroundColor: colors.twitterColor },
  redditColor: { backgroundColor: colors.twitterColor },
  instagramColor: { backgroundColor: colors.twitterColor },
  success: { backgroundColor: colors.successColor[0] },
  info: { backgroundColor: colors.infoColor[0] },
  rose: { backgroundColor: colors.roseColor[0] },
  warning: { backgroundColor: colors.warningColor[0] },
  danger: { backgroundColor: colors.dangerColor[0] },
});
