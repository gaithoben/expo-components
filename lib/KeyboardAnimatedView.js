import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Keyboard, Platform } from 'react-native';

class KeyboardAnimatedView extends Component {
  static defaultProps = {
    onKeyboardShow: () => {},
    onKeyboardHide: () => {},
  };
  constructor(props) {
    super(props);
    this.state = { duration: 100, keyboardheight: 0 };

    this.KeyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.KeyboardWillShow);
    this.KeyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.KeyboardWillHide);
    this.KeyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.KeyboardWillShow);
    this.KeyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.KeyboardWillHide);

    this.keyboardHeight = new Animated.Value(0);
    this.viewOpacity = new Animated.Value(0);
  }

  KeyboardWillShow = event => {
    let duration = 100;
    if (Platform.OS === 'android') {
      duration = 100;
    } else {
      duration = event.duration;
    }
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: duration + 100,
        toValue: event.endCoordinates.height + 30,
      }),
      Animated.timing(this.viewOpacity, {
        duration: duration + 100,
        toValue: 1,
      }),
    ]).start();
  };

  KeyboardWillHide = event => {
    let duration = 100;
    if (Platform.OS === 'android') {
      duration = 100;
    } else {
      duration = event.duration;
    }
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: duration + 100,
        toValue: 0,
      }),
      Animated.timing(this.viewOpacity, {
        duration: duration + 100,
        toValue: 0,
      }),
    ]).start();
  };

  render() {
    const styles = getStyles({
      keyboardHeight: this.keyboardHeight,
      viewOpacity: this.viewOpacity,
    });
    return (
      <Animated.View style={[styles.container, this.props.style]}>
        {this.props.children({
          keyboardheight: this.keyboardHeight,
          opacity: this.viewOpacity,
        })}
      </Animated.View>
    );
  }
}

export default KeyboardAnimatedView;

const getStyles = ({ keyboardHeight, viewOpacity }) => ({
  container: {
    flex: 1,
    bottom: keyboardHeight,
    opacity: viewOpacity,
  },
});
