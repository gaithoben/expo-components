import React, { useState } from 'react';
import { Image } from 'react-native';

export default ({ size = 48, src, ...props }) => {
  return (
    <Image
      style={{ height: size, width: size, resizeMode: 'contain' }}
      source={src}
      {...props}
    />
  );
};
