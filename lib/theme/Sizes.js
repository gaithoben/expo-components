import Constants from 'expo-constants';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

const sizes = {
  // global sizes
  base: 10,
  font: 12,
  border: 12,
  padding: moderateScale(12),
  margin: moderateScale(12),

  // font sizes
  h1: 24,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,

  title: 14,
  subTitle: 12,

  header: 16,
  subHeader: 14,

  body: 12,
  caption: 10,
  small: 9,
  tiny: 8,
  button: 14,

  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  navBarHeight: 65,
  adminNavBarHeight: 65,
  buttonRadius: 4,
  icons: {
    tiny: moderateScale(12),
    small: moderateScale(20),
    medium: moderateScale(30),
    large: moderateScale(24),
    xl: moderateScale(48),
  },
  images: {
    small: moderateScale(20),
    medium: moderateScale(40),
    large: moderateScale(60),
    logo: moderateScale(200),
  },

  // InputSharp,

  inputHeight: moderateScale(36),
  inputMinWidth: moderateScale(120),
  statusBarHeight: Constants.statusBarHeight,
};

export default sizes;
