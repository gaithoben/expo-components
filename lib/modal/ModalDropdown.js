import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View,
  FlatList,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  I18nManager,
  StyleSheet,
} from 'react-native';

import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';

import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import Block from '../Block';
import Text from '../Text';

import { colors, sizes, fonts } from '../theme';

export default class Dropdown extends PureComponent {
  static defaultProps = {
    hitSlop: { top: 6, right: 4, bottom: 6, left: 4 },

    disabled: false,

    data: [],
    placeholder: 'Select...',

    valueExtractor: value => value,
    keyExtractor: value => value,
    labelExtractor: label => label,
    propsExtractor: () => null,

    absoluteRTLLayout: false,

    dropdownOffset: {
      top: 32,
      left: 0,
    },

    dropdownMargins: {
      min: 8,
      max: 16,
    },
    animationDuration: 225,

    fontSize: sizes.h5,
    color: colors.darkGray,

    itemCount: 3,
    itemPadding: 8,
    supportedOrientations: [
      'portrait',
      'portrait-upside-down',
      'landscape',
      'landscape-left',
      'landscape-right',
    ],

    useNativeDriver: false,
  };

  static propTypes = {
    ...TouchableWithoutFeedback.propTypes,

    disabled: PropTypes.bool,

    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ])
    ),
    placeholder: PropTypes.string,

    valueExtractor: PropTypes.func,
    keyExtractor: PropTypes.func,
    labelExtractor: PropTypes.func,
    propsExtractor: PropTypes.func,

    absoluteRTLLayout: PropTypes.bool,

    dropdownOffset: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
    }),

    dropdownMargins: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }),

    dropdownPosition: PropTypes.number,
    shadeOpacity: PropTypes.number,

    animationDuration: PropTypes.number,

    color: PropTypes.string,
    fontSize: PropTypes.number,
    itemCount: PropTypes.number,
    itemPadding: PropTypes.number,

    onLayout: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,

    renderBase: PropTypes.func,
    renderAccessory: PropTypes.func,

    containerStyle: PropTypes.object,
    overlayStyle: PropTypes.object,
    pickerStyle: PropTypes.object,

    supportedOrientations: PropTypes.arrayOf(PropTypes.string),

    useNativeDriver: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onLayout = this.onLayout.bind(this);

    this.updateContainerRef = this.updateRef.bind(this, 'container');
    this.updateScrollRef = this.updateRef.bind(this, 'scroll');

    this.renderAccessory = this.renderAccessory.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.keyExtractor = this.keyExtractor.bind(this);

    this.blur = () => this.onClose();
    this.focus = this.onPress;

    const { value } = this.props;

    this.mounted = false;
    this.focused = false;

    this.state = {
      opacity: new Animated.Value(0),
      selected: -1,
      modal: false,
      data: [],
      value,
    };
  }

  static getDerivedStateFromProps(
    { value, data, labelExtractor, keyExtractor },
    prevState
  ) {
    if (!isEqual(data, prevState.data) || !isEqual(value, prevState.selected)) {
      const options = [...(data || [])].map((item, index) => ({
        item,
        label: labelExtractor(item, index),
        value: keyExtractor(item, index),
      }));

      let ind;
      let selected = {};

      if (value) {
        ind = options.findIndex(i => isEqual(i.item, value));
        selected = options[ind];
      }

      return { ...prevState, options, data, selected };
    }
    return prevState;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPress(event) {
    const {
      data,
      disabled,
      onFocus,
      itemPadding,
      dropdownOffset,
      dropdownMargins: { min: minMargin, max: maxMargin },
      animationDuration,
      absoluteRTLLayout,
      useNativeDriver,
    } = this.props;

    if (disabled) {
      return;
    }

    const itemCount = data.length;
    const timestamp = Date.now();

    if (!itemCount) {
      return;
    }

    this.focused = true;

    if (typeof onFocus === 'function') {
      onFocus();
    }

    const dimensions = Dimensions.get('window');

    this.container.measureInWindow((x, y, containerWidth, containerHeight) => {
      const { opacity } = this.state;

      /* Adjust coordinates for relative layout in RTL locale */
      if (I18nManager.isRTL && !absoluteRTLLayout) {
        x = dimensions.width - (x + containerWidth);
      }
      const selected = this.selectedIndex();

      let leftInset;
      let left = x + dropdownOffset.left - maxMargin;

      if (left > minMargin) {
        leftInset = maxMargin;
      } else {
        left = minMargin;
        leftInset = minMargin;
      }

      let right = x + containerWidth + maxMargin;
      let rightInset;

      if (dimensions.width - right > minMargin) {
        rightInset = maxMargin;
      } else {
        right = dimensions.width - minMargin;
        rightInset = minMargin;
      }

      const top = y + dropdownOffset.top - itemPadding;

      this.setState({
        modal: true,
        width: right - left,
        top,
        left,
        leftInset,
        rightInset,
        selected,
      });

      setTimeout(() => {
        if (this.mounted) {
          this.resetScrollOffset();

          Animated.timing(opacity, {
            duration: animationDuration,
            toValue: 1,
            useNativeDriver,
          }).start(() => {
            if (this.mounted && Platform.OS === 'ios') {
              const { flashScrollIndicators } = this.scroll || {};

              if (typeof flashScrollIndicators === 'function') {
                flashScrollIndicators.call(this.scroll);
              }
            }
          });
        }
      }, 100);
    });
  }

  onClose() {
    const { onBlur, animationDuration, useNativeDriver } = this.props;
    const { opacity } = this.state;

    Animated.timing(opacity, {
      duration: animationDuration,
      toValue: 0,
      useNativeDriver,
    }).start(() => {
      this.focused = false;

      if (typeof onBlur === 'function') {
        onBlur();
      }

      if (this.mounted) {
        this.setState({ modal: false });
      }
    });
  }

  onSelect(item, index) {
    const { valueExtractor, onChange, animationDuration } = this.props;

    const value = valueExtractor(item.item, index);
    const delay = animationDuration;

    if (typeof onChange === 'function') {
      onChange(value, index);
    }

    setTimeout(() => this.onClose(value), delay);
  }

  onLayout(event) {
    const { onLayout } = this.props;

    if (typeof onLayout === 'function') {
      onLayout(event);
    }
  }

  value() {
    const { value } = this.state;

    return value;
  }

  selectedIndex() {
    const { selected, options } = this.state;
    return options.findIndex((item, index) => item.value === selected.value);
  }

  selectedItem() {
    const { options } = this.state;
    return options[this.selectedIndex()];
  }

  isFocused() {
    return this.focused;
  }

  itemSize() {
    const { fontSize, itemPadding } = this.props;

    return Math.ceil(fontSize * 1.5 + itemPadding * 2);
  }

  visibleItemCount() {
    const { data, itemCount } = this.props;

    return Math.min(data.length, itemCount);
  }

  tailItemCount() {
    return Math.max(this.visibleItemCount() - 2, 0);
  }

  resetScrollOffset() {
    const { selected } = this.state;
    const { data, dropdownPosition } = this.props;

    let offset = 0;
    const itemCount = data.length;
    const itemSize = this.itemSize();
    const tailItemCount = this.tailItemCount();
    const visibleItemCount = this.visibleItemCount();

    if (itemCount > visibleItemCount) {
      if (dropdownPosition == null) {
        switch (selected) {
          case -1:
            break;

          case 0:
          case 1:
            break;

          default:
            if (selected >= itemCount - tailItemCount) {
              offset = itemSize * (itemCount - visibleItemCount);
            } else {
              offset = itemSize * (selected - 1);
            }
        }
      } else {
        let index = selected - dropdownPosition;

        if (dropdownPosition < 0) {
          index -= visibleItemCount;
        }

        index = Math.max(0, index);
        index = Math.min(index, itemCount - visibleItemCount);

        if (~selected) {
          offset = itemSize * index;
        }
      }
    }

    if (this.scroll) {
      this.scroll.scrollToOffset({ offset, animated: false });
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  keyExtractor(item, index) {
    return `${index}-${item.value}`;
  }

  renderBase(props) {
    const { selected } = this.state;

    const {
      color,
      fontSize,
      placeholder,
      renderBase,
      renderAccessory = this.renderAccessory,
    } = this.props;

    const title = selected ? selected.label : null;

    if (typeof renderBase === 'function') {
      return renderBase({ ...props, title, selected, renderAccessory });
    }

    const textStyle = { color, fontSize };

    return (
      <Block
        row
        style={{
          minWidth: 100,
          marginLeft: 7,
        }}
        pointerEvents="box-only"
        middle
      >
        {!title && (
          <Text style={{ ...fonts.normal, flex: 1, color: '#BBB' }}>
            {placeholder}
          </Text>
        )}
        {title && (
          <Text style={{ ...fonts.normal, flex: 1, color: '#333' }}>
            {`${title} `}
          </Text>
        )}

        {renderAccessory()}
      </Block>
    );
  }

  renderAccessory = () => (
    <Block flex={false}>
      <Ionicons
        name="ios-arrow-down"
        style={{ fontSize: 16, marginHorizontal: 7, color: colors.darkGray }}
      />
    </Block>
  );

  renderItem({ item, index }) {
    if (item == null) {
      return null;
    }

    const { color, fontSize } = this.props;

    const { label, value } = item;

    const title = label == null ? value : label;
    const textStyle = { color, fontSize };

    return (
      <Button
        color={colors.milkyWhite}
        onPress={() => this.onSelect(item, index)}
        block
      >
        <Block>
          <Text style={textStyle}>{title}</Text>
        </Block>
      </Button>
    );
  }

  render() {
    const {
      renderBase,
      renderAccessory,
      containerStyle,
      overlayStyle: overlayStyleOverrides,
      pickerStyle: pickerStyleOverrides,

      hitSlop,
      pressRetentionOffset,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,

      supportedOrientations,
      ...props
    } = this.props;

    const { disabled, itemPadding, dropdownPosition } = props;

    const { options, left, top, width, opacity, selected, modal } = this.state;

    const itemCount = options.length;
    const visibleItemCount = this.visibleItemCount();
    const tailItemCount = this.tailItemCount();
    const itemSize = this.itemSize();

    const height = 2 * itemPadding + itemSize * visibleItemCount;
    let translateY = -itemPadding;

    if (dropdownPosition == null) {
      switch (selected) {
        case -1:
          translateY -= itemCount === 1 ? 0 : itemSize;
          break;

        case 0:
          break;

        default:
          if (selected >= itemCount - tailItemCount) {
            translateY -=
              itemSize * (visibleItemCount - (itemCount - selected));
          } else {
            translateY -= itemSize;
          }
      }
    } else if (dropdownPosition < 0) {
      translateY -= itemSize * (visibleItemCount + dropdownPosition);
    } else {
      translateY -= itemSize * dropdownPosition;
    }

    const overlayStyle = { opacity };

    const pickerStyle = {
      width,
      height,
      top,
      left,
      transform: [{ translateY }],
    };

    const touchableProps = {
      disabled,
      hitSlop,
      pressRetentionOffset,
      onPress: this.onPress,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,
    };

    return (
      <View
        onLayout={this.onLayout}
        ref={this.updateContainerRef}
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <TouchableWithoutFeedback {...touchableProps} style={{ flex: 1 }}>
          {this.renderBase(props)}
        </TouchableWithoutFeedback>

        <Modal
          visible={modal}
          transparent
          onRequestClose={this.blur}
          supportedOrientations={supportedOrientations}
        >
          <Animated.View
            style={[styles.overlay, overlayStyle, overlayStyleOverrides]}
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.blur}
          >
            <View
              style={[styles.picker, pickerStyle, pickerStyleOverrides]}
              onStartShouldSetResponder={() => true}
            >
              <FlatList
                ref={this.updateScrollRef}
                data={options}
                style={styles.scroll}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                scrollEnabled={visibleItemCount < itemCount}
                contentContainerStyle={styles.scrollContainer}
              />
            </View>
          </Animated.View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accessory: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  triangle: {
    width: 8,
    height: 8,
    transform: [
      {
        translateY: -4,
      },
      {
        rotate: '45deg',
      },
    ],
  },

  triangleContainer: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent' /* XXX: Required */,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  picker: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 2,

    position: 'absolute',

    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: 'rgba(0, 0, 0, 1.0)',
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 2 },
      },

      android: {
        elevation: 2,
      },
    }),
  },

  item: {
    textAlign: 'left',
  },

  scroll: {
    flex: 1,
    borderRadius: 2,
  },

  scrollContainer: {},
});
