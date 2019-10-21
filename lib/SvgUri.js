import * as React from 'react';
import { SvgUri } from 'react-native-svg';

export default ({
  size = '100%',
  uri = 'http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg',
  ...props
}) => <SvgUri width={size} height={size} uri={uri} {...props} />;
