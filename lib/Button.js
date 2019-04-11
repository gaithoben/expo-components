import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo';
import { colors, sizes } from './theme';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      style,
      opacity,
      gradient,
      color,
      startColor,
      endColor,
      end,
      start,
      locations,
      shadow,
      children,
      ...props
    } = this.props;

    const buttonStyles = [
      styles.button,
      shadow && styles.shadow,
      color && styles[color], // predefined styles colors for backgroundColor
      color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
      style,
    ];

    if (gradient) {
      return (
        <TouchableOpacity
          style={buttonStyles}
          activeOpacity={opacity}
          {...props}
        >
          <LinearGradient
            start={start}
            end={end}
            locations={locations}
            style={buttonStyles}
            colors={[startColor, endColor]}
          >
            {children}
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={buttonStyles}
        activeOpacity={opacity || 0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

Button.defaultProps = {
  startColor: colors.primary,
  endColor: colors.secondary,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0.1, 0.9],
  opacity: 0.8,
  color: colors.white,
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: sizes.radius,
    height: sizes.base * 3,
    justifyContent: 'center',
    marginVertical: sizes.padding / 3,
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
  mistywhite: { backgroundColor: colors.mistywhite },
  milkywhite: { backgroundColor: colors.milkywhite },
  clear: { backgroundColor: colors.clear },
  facebook: { backgroundColor: colors.facebook },
  transparent: { backgroundColor: colors.transparent },
  silver: { backgroundColor: colors.silver },
  steel: { backgroundColor: colors.steel },
  error: { backgroundColor: colors.error },
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
});
