import React from 'react';
import ThemeContext from './ThemeContext';

import localsizes from './Sizes';
import localcolors from './Colors';
import localfonts from './Fonts';

const ThemeProvider = ({ children, fonts, colors, sizes, ...props }) => {
  const newfonts = { ...localfonts, ...fonts };
  const newcolors = { ...localcolors, ...colors };
  const newsizes = { ...localsizes, ...sizes };

  return (
    <ThemeContext.Provider
      value={{
        fonts: { ...fonts, ...props.fonts },
        colors: { ...colors, ...props.colors },
        sizes: { ...sizes, ...props.sizes },
        CONFIG: props.CONFIG || {},
        ...props
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
