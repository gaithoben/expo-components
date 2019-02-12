import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

class ImageTile extends React.PureComponent {
  static defaultProps = {
    onSelectImage: () => {}
  };

  render() {
    const { item, index, selected, onSelectImage, showCount } = this.props;
    if (!item) return null;
    return (
      <TouchableHighlight
        style={{ opacity: selected ? 0.8 : 1, padding: 1 }}
        underlayColor="transparent"
        onPress={() => onSelectImage(item)}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Image
            style={{ width: width / 4, height: width / 4 }}
            source={{ uri: item.uri }}
          />
          {selected && (
            <AntDesign
              name="check"
              color="#FFFCFF"
              size={32}
              style={{
                position: 'absolute',
                left: 'auto',
                top: 'auto',
                marginLeft: 'auto'
              }}
            />
          )}
          {item.mediaType === 'video' && (
            <View
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                justifyContent: 'flex-end'
              }}
            >
              <Text style={{ fontSize: 9, color: '#FFFCFF' }}>
                {Number(item.duration).toFixed(2)}
              </Text>
            </View>
          )}
          {showCount && (
            <View
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#001529',
                height: 14,
                width: 14,
                borderRadius: 5
              }}
            >
              <Text
                style={{ fontSize: 9, color: '#FFFCFF', fontWeight: 'bold' }}
              >
                {item.selectCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}
export default ImageTile;
