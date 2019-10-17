export { default as useFonts } from './useFonts';
export { default as sizes } from './Sizes';
export { default as colors } from './Colors';
export { default as backgroundColors } from './backgroundColors';
export { default as Images } from './Images';
export { default as Metrics } from './Metrics';
export { default as Sounds } from './Sounds';
export { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const hexToRgb = hexcolor => {
  let input = hexcolor;
  input += '';
  input = input.replace('#', '');
  const hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error('input is not a valid hex color.');
  }
  if (input.length === 3) {
    const first = input[0];
    const second = input[1];
    const last = input[2];
    input = first + first + second + second + last + last;
  }
  input = input.toUpperCase(input);
  const first = input[0] + input[1];
  const second = input[2] + input[3];
  const last = input[4] + input[5];
  return `${parseInt(first, 16)}, ${parseInt(second, 16)}, ${parseInt(
    last,
    16
  )}`;
};
