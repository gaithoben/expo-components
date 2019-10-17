import React, { Component } from 'react';
import { Keyboard, Animated, Platform } from 'react-native';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

import Block from './Block';
import { sizes } from './theme';

const android = Platform.OS === 'android';

const additionalHeight = android ? 0.5 : 0;

class KeyboardAvoidingView extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.KeyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.KeyboardWillShow
    );
    this.KeyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.KeyboardWillHide
    );
    this.KeyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.KeyboardWillShow
    );
    this.KeyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.KeyboardWillHide
    );
    this.keyboardHeight = new Animated.Value(0);
  }

  KeyboardWillShow = event => {
    let duration = 100;
    if (Platform.OS === 'android') {
      duration = 100;
    } else {
      duration = event.duration;
    }

    Animated.timing(this.keyboardHeight, {
      duration: duration + 100,
      toValue: event.endCoordinates.height,
    }).start();
  };

  KeyboardWillHide = event => {
    let duration = 100;
    if (Platform.OS === 'android') {
      duration = 100;
    } else {
      duration = event.duration;
    }

    Animated.timing(this.keyboardHeight, {
      duration: duration + 100,
      toValue: 0,
    }).start();
  };

  render() {
    const { children, flex, style, ...rest } = this.props;

    return (
      <Block
        animated
        style={[
          styles.container,
          flex && { bottom: this.keyboardHeight },
          isObject(style) && { ...style },
          isArray(style) && [...style],
        ]}
        {...rest}
      >
        {
          // this.props.children
          // ? this.props.children({ keyboardheight: this.keyboardHeight })
          // : null
          children
        }
      </Block>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
};

KeyboardAvoidingView.defaultProps = {
  style: [],
  flex: true,
};

export default KeyboardAvoidingView;
