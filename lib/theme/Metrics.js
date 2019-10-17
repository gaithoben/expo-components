import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Used via Metrics.baseMargin
const metrics = {
  width: width < height ? width : height,
  height: width < height ? height : width
};

export default metrics;
