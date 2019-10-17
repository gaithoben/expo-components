import { StyleSheet, PixelRatio } from 'react-native';
import { colors } from '../theme';
import { getHeightPercent } from './ratio';

export default StyleSheet.create({
  container: {},
  modalContainer: {
    backgroundColor: colors.white,
    flex: 1,
  },
  input: {
    height: 48,
    width: '70%',
  },
  inputOnly: {
    marginLeft: '15%',
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 19,
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8,
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    width: 30,
    height: 30,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  itemCountry: {
    flexDirection: 'row',
    height: 55,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  countryName: {
    fontSize: getHeightPercent(2.2),
  },
  countryCode: {
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  letters: {
    marginRight: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    height: 25,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    textAlign: 'center',
    fontSize: getHeightPercent(2.2),
  },
  closeButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
});
