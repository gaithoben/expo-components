import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const sizes = {
  // global sizes
  base: 10,
  font: 14,
  border: 15,
  padding: 15,
  margin: 15,

  // font sizes
  h1: 39,
  h2: 29,
  h3: 19,
  title: 18,
  header: 24,
  body: 12,
  caption: 12,
  small: 8,

  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === 'ios' ? 64 : 54,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50,
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200,
  },
};

export default sizes;
