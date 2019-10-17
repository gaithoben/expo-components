import React, { useState } from 'react';
import ThemeContext from './ThemeContext';

const ThemeProvider = ({ values, children, ...props }) => {
  const {
    normalFontFamily,
    thinFontFamily,
    boldFontFamily,
    semiBoldFontFamily,
  } = values.fonts;

  return (
    <ThemeContext.Provider value={{ fonts }}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.defaultProps = {
  fonts: {
    normalFontFamily: 'clanpro-book',
    thinFontFamily: 'clanpro-book',
    boldFontFamily: 'clanpro-book',
    semiBoldFontFamily: 'clanpro-book',
  },
};

export default ThemeProvider;
