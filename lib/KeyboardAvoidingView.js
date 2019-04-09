import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { sizes } from './theme';

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
    const styles = getStyles({
      keyboardHeight: this.keyboardHeight,
    });

    return (
      <Animated.View style={[styles.container, this.props.style]}>
        {this.props.children({ keyboardheight: this.keyboardHeight })}
      </Animated.View>
    );
  }
}

export default KeyboardAvoidingView;

const getStyles = ({ keyboardHeight }) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: keyboardHeight,
    backgroundColor: 'transparent',
  },
});
