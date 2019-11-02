import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Animated, View, Platform } from 'react-native';
import { State, PanGestureHandler } from 'react-native-gesture-handler';
import Block from './Block';
import Text from './Text';

import ThemeContext from './theme/ThemeContext';

const android = Platform.OS === 'android';

const LabeledSwitch = ({
  value,
  input,
  onLabel,
  offLabel,
  textStyles,
  height,
  ...props
}) => {
  const { colors, sizes } = React.useContext(ThemeContext);
  const propsvalue = value || input.value;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(Boolean(propsvalue));
  }, [propsvalue]);

  const [animatedvalue, setAnimatedValue] = useState(
    new Animated.Value(checked ? 100 : 0)
  );

  const componentLeft = animatedvalue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '50%'],
    extrapolate: 'clamp',
  });

  function logChange(val) {
    props.onChange(val);
    input.onChange(val);
    input.onBlur();
  }

  useEffect(() => {
    if (checked) {
      Animated.timing(animatedvalue, {
        duration: 500,
        toValue: 100,
      }).start();
    } else {
      Animated.timing(animatedvalue, {
        duration: 500,
        toValue: 0,
      }).start();
    }
  }, [checked]);

  const switchOn = () => {
    setChecked(true);
    logChange(true);
  };

  const switchOff = () => {
    setChecked(false);
    logChange(false);
  };

  const onPanGestureEvent = e => {
    const { x } = e.nativeEvent;
    animatedvalue.setValue(x);
    if (!checked) {
      if (x >= 50) {
        switchOn();
      }
    }
    if (x <= 50 && checked) {
      switchOff();
    }
  };

  const handleStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (checked) {
        animatedvalue.setValue(96);
      } else {
        animatedvalue.setValue(0);
      }
    }
  };

  const selectedBackGroundStyles = {
    left: componentLeft,
    // transform: [{ translateX: dragX }],
    backgroundColor: checked ? colors.success : colors.danger,
  };

  const textStyle = {
    ...textStyles,
  };

  return (
    <PanGestureHandler
      style={{ flexDirection: 'row' }}
      maxPointers={1}
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={handleStateChange}
    >
      <View style={[styles.root({ checked }), { height }]}>
        <Block
          animated
          shadow
          style={[styles.selectedBg, selectedBackGroundStyles]}
        >
          {
            <Text cropped bold milkyWhite>
              {`${checked ? onLabel : offLabel}`}
            </Text>
          }
        </Block>

        <Block row middle center style={{ elevation: 20 }}>
          <Block flex={false} pointerEvents={checked ? 'box-none' : 'none'}>
            <TouchableOpacity onPress={switchOff} style={styles.button}>
              <Block flex={false}>
                <Text
                  cropped
                  bold={!checked}
                  transparent={!checked}
                  gray={checked}
                  style={textStyle}
                >
                  {`${offLabel}`}
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
          <Block flex={false} pointerEvents={!checked ? 'box-none' : 'none'}>
            <TouchableOpacity onPress={switchOn} style={styles.button}>
              <Block flex={false}>
                <Text
                  cropped
                  bold={checked}
                  transparent={checked}
                  gray={!checked}
                  style={textStyle}
                >
                  {`${onLabel}`}
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </View>
    </PanGestureHandler>
  );
};

LabeledSwitch.defaultProps = {
  textStyles: {},
  offLabel: 'Off',
  onLabel: 'On',
  onChange: () => {},
  input: {
    onChange: () => {},
    onBlur: () => {},
  },
  height: sizes.inputHeight,
};

const styles = {
  root: ({ checked }) => ({
    height: 46,
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: checked ? colors.success : colors.danger,
  }),
  selectedBg: {
    position: 'absolute',
    margin: 1,
    top: 0,
    bottom: 0,
    borderRadius: 20,

    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: sizes.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default LabeledSwitch;
