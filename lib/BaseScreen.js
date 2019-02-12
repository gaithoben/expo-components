import React from 'react';
import { Dimensions } from 'react-native';
import { ScreenOrientation } from 'expo';

export default class BaseScreen extends React.Component {
  static defaultProps = {
    onOrientationChange: () => {},
    sourceUri: '//',
    posterUri: '//'
  };
  constructor(props) {
    super(props);
    this.state = {
      isPortrait: true,
      loading: false
    };
  }
  componentDidMount = () => {
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    Dimensions.addEventListener('change', this.orientationChangeHandler);
  };

  componentWillUnmount = () => {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    Dimensions.removeEventListener('change', this.orientationChangeHandler);
  };

  orientationChangeHandler = dims => {
    const { width, height } = dims.window;
    const isLandscape = width > height;
    this.setState({ isPortrait: !isLandscape });
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    this.props.onOrientationChange(!isLandscape ? 'portrait' : 'landscape');
  };

  switchToLandscape() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
  }

  switchToPortrait() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
  }
}
