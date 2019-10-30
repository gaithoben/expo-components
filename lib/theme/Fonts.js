import { scale } from 'expo-components/lib/theme';

import colors from './Colors';
import sizes from './Sizes';

const Fonts = {
  h1: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.h1),
  },
  h2: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.h2),
  },
  h3: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.h3),
  },
  h4: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.h4),
  },
  h5: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.h5),
  },
  h6: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.h6),
  },

  header: {
    fontFamily: 'clanpro-bold',
    fontSize: scale(sizes.header),
    letterSpacing: 0.5,
    color: colors.black,
  },
  subHeader: {
    fontFamily: 'clanpro-thin',
    fontSize: scale(sizes.subHeader),
    letterSpacing: 0.5,
    color: colors.black,
  },

  title: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.title),
    letterSpacing: 0.5,
    color: colors.black,
  },

  subTitle: {
    fontFamily: 'clanpro-thin',
    fontSize: scale(sizes.subTitle),
    letterSpacing: 0.5,
    color: colors.black,
  },

  semibold: {
    fontFamily: 'clanpro-bold',
    fontWeight: '100',
  },

  bold: {
    fontFamily: 'clanpro-bold',
  },

  light: {
    fontFamily: 'clanpro-thin',
  },

  normal: {
    fontFamily: 'clanpro-book',
  },

  default: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.body),
  },

  body: {
    fontFamily: 'clanpro-book',
    fontSize: scale(sizes.body),
    color: colors.dark,
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

export default Fonts;
