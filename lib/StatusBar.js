import React from 'react';
import Constants from 'expo-constants';
import { StatusBar as RNStatusBar, View } from 'react-native';

const StatusBar = ({ light, dark, color, hasHeight, style, ...props }) => {
  const statusBarProps = {
    ...{},
    ...(light && { barStyle: 'light-content' }),
    ...(dark && { barStyle: 'dark-content' }),
    ...(color && { backgroundColor: color })
  };

  const containerStyles = {
    height: Constants.statusBarHeight,
    ...(color && { backgroundColor: color })
  };

  if (hasHeight) {
    return (
      <View
        style={[containerStyles, Array.isArray(style) ? [...style] : style]}
      >
        <RNStatusBar {...statusBarProps} {...props} style />
      </View>
    );
  }

  return <RNStatusBar {...statusBarProps} {...props} style />;
};

export default StatusBar;
