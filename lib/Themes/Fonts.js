// const type = {
//   base: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
//   bold: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed',
//   emphasis: Platform.OS === 'ios' ? 'HelveticaNeue-Italic' : 'sans-serif'
// };

const type = {
  base: 'MavenPro-Regular',
  bold: 'MavenPro-Bold',
  medium: 'MavenPro-Medium',
  emphasis: 'MavenPro-Black'
};

const size = {
  h1: 30,
  h2: 28,
  h3: 26,
  h4: 24,
  h5: 22,
  h6: 17,
  input: 18,
  large: 20,
  medium: 18,
  regular: 17,
  small: 14,
  tiny: 12
};

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontFamily: type.base,
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.base,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.bold,
    fontSize: size.h6
  },
  large: {
    fontFamily: type.base,
    fontSize: size.large
  },
  medium: {
    fontFamily: type.base,
    fontSize: size.medium
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  small: {
    fontFamily: type.base,
    fontSize: size.small
  },
  tiny: {
    fontFamily: type.base,
    fontSize: size.tiny
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  }
};

export default {
  type,
  size,
  style
};
