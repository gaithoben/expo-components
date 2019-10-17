import React, { useState } from 'react';
import { Keyboard } from 'react-native';

const minHeight = 30;
const useKeyboard = props => {
  const [height, changeHeight] = useState(minHeight);

  const keyboardDidShow = event => {
    const keyboardheight = event.endCoordinates.height;
    changeHeight(keyboardheight);
  };

  const keyboardDidHide = () => {
    changeHeight(minHeight);
  };

  Keyboard.addListener('keyboardDidShow', keyboardDidShow);
  Keyboard.addListener('keyboardDidHide', keyboardDidHide);

  return [height];
};

export default useKeyboard;
