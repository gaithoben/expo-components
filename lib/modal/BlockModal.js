import React from 'react';
import RNModal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';
import Block from '../Block';
import { colors, sizes, verticalScale, scale } from '../theme';

const BlockModal = ({
  children,
  margin,
  color,
  top,
  bottom,
  middle,
  roundedTop,
  roundedBottom,
  fill,
  showHandle,
  onClose,
  style,
  isVisible,
  minHeight,
  ...props
}) => {
  const [visible, setVisible] = React.useState(isVisible);

  React.useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  const modalstyles = {
    margin: margin || 0,
    ...(bottom && top && { justifyContent: 'flex-end' }),
    ...(top && { justifyContent: 'flex-start' }),
    ...(middle && { justifyContent: 'center' }),
    ...style,
  };

  const blockstyles = {
    ...(!fill && {
      position: 'absolute',
      right: 0,
      left: 0,
    }),
    ...(bottom && { bottom: verticalScale(-25) }),
    ...(top && { top: 0 }),
    ...(roundedTop && {
      borderTopLeftRadius: verticalScale(10),
      borderTopRightRadius: verticalScale(10),
    }),
    ...(roundedBottom && {
      borderBottomLeftRadius: verticalScale(10),
      borderBottomRightRadius: verticalScale(10),
    }),
    ...(minHeight && { minHeight: verticalScale(minHeight) }),
  };

  const onCloseModal = () => {
    setVisible(false);
    onClose();
  };

  return (
    <RNModal
      isVisible={visible}
      style={modalstyles}
      animationIn={top ? 'slideInDown' : 'slideInUp'}
      animationOut={top ? 'slideOutUp' : 'slideOutDown'}
      swipeDirection={top ? 'up' : 'down'} // 'none'
      onBackButtonPress={onCloseModal}
      onBackdropPress={onCloseModal}
      onSwipeComplete={onCloseModal}
      onModalHide={onCloseModal}
      {...props}
    >
      <Block shadow style={blockstyles} color={color}>
        {!top && showHandle && (
          <Block center>
            <MaterialIcons
              name="drag-handle"
              style={{ fontSize: scale(32), color: colors.darkGray }}
            />
          </Block>
        )}
        <Block>{children}</Block>
        {bottom && <Block flex={false} style={{ height: verticalScale(40) }} />}

        {top && showHandle && (
          <Block center>
            <MaterialIcons
              name="drag-handle"
              style={{ fontSize: scale(32), color: colors.darkGray }}
            />
          </Block>
        )}
      </Block>
    </RNModal>
  );
};

BlockModal.defaultProps = {
  margin: 0,
  color: colors.milkyWhite,
  onClose: () => {},
  showHandle: false,
  avoidKeyboard: true,
};
export default BlockModal;
