import React from 'react';
import { Button as NBButton } from 'native-base';
import { colors, sizes, verticalScale, moderateScale } from './theme';

let height = 48;

const Button = ({
  children,
  flat,
  outlined,
  contained,
  small,
  medium,
  large,
  rounded,
  padding,
  margin,
  color,
  textColor,
  style,
  ...props
}) => {
  const handleMargins = () => {
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
    return null;
  };

  const handlePaddings = () => {
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
    return null;
  };

  const getHeight = newHeight => {
    height = newHeight;
    return verticalScale(height);
  };

  const buttonStyles = [
    styles.button,
    large && {
      height: getHeight(64),
      paddingHorizontal: moderateScale(sizes.padding),
    },
    medium && {
      height: getHeight(48),
      paddingHorizontal: moderateScale(sizes.padding),
    },
    small && {
      height: getHeight(32),
      paddingHorizontal: moderateScale(sizes.padding),
    },
    margin && { ...handleMargins() },
    padding && { ...handlePaddings() },
    color && styles[color],
    color && !styles[color] && { backgroundColor: color },
    textColor && { color: textColor },
    outlined && { backgroundColor: 'transparent', borderColor: color },
    rounded && { borderRadius: height / 2 },
    props.disabled && { opacity: 0.5 },
    style,
  ];

  return (
    <NBButton
      style={buttonStyles}
      bordered={outlined || props.bordered}
      {...props}
    >
      {children}
    </NBButton>
  );
};

const styles = {
  button: {
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: moderateScale(sizes.padding),
    alignItems: 'center',
  },
};

Button.defaultProps = {};

export default Button;
