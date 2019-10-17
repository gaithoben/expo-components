import React from 'react';
import { scale } from 'react-native-size-matters';
import sizes from './Sizes';
import colors from './Colors';
import ThemeContext from './ThemeContext';

const useFonts = () => {
  const {
    fonts: {
      normalFontFamily,
      thinFontFamily,
      boldFontFamily,
      semiBoldFontFamily,
    },
  } = React.useContext(ThemeContext);

  const Fonts = {
    h1: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.h1),
    },
    h2: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.h2),
    },
    h3: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.h3),
    },
    h4: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.h4),
    },
    h5: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.h5),
    },
    h6: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.h6),
    },

    header: {
      fontFamily: boldFontFamily,
      fontSize: scale(sizes.header),
      letterSpacing: 0.5,
      color: colors.black,
    },
    subHeader: {
      fontFamily: thinFontFamily,
      fontSize: scale(sizes.subHeader),
      letterSpacing: 0.5,
      color: colors.black,
    },

    title: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.title),
      letterSpacing: 0.5,
      color: colors.black,
    },

    subTitle: {
      fontFamily: thinFontFamily,
      fontSize: scale(sizes.subTitle),
      letterSpacing: 0.5,
      color: colors.black,
    },

    semibold: {
      fontFamily: boldFontFamily,
      fontWeight: '100',
    },

    bold: {
      fontFamily: boldFontFamily,
    },

    light: {
      fontFamily: thinFontFamily,
    },

    normal: {
      fontFamily: normalFontFamily,
    },

    default: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.body),
    },

    body: {
      fontFamily: normalFontFamily,
      fontSize: scale(sizes.body),
      color: colors.darkGray,
    },

    caption: {
      fontSize: scale(sizes.caption),
    },
    small: {
      fontSize: scale(sizes.small),

      color: colors.darkGray,
    },
    button: {
      fontSize: scale(sizes.button),
      color: colors.white,
    },
  };

  return {
    Fonts,
    fonts: Fonts,
  };
};

export default useFonts;
