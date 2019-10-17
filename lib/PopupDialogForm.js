import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import BlockModal from './modal/BlockModal';

import Block from './Block';
import Text from './Text';
import { verticalScale, sizes, colors } from './theme';
import { IconButton } from '.';

const PopupDialogForm = ({ title = '', isVisible, onClose, children }) => {
  const [visible, setVisible] = React.useState(isVisible);

  React.useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  return (
    <BlockModal
      isVisible={visible}
      onClose={onClose}
      swipeDirection="down"
      bottom
      roundedTop
      fill
      propagateSwipe
      avoidKeyboard
      style={{ marginTop: verticalScale(20) }}
    >
      <Block>
        <Block
          flex={false}
          margin={[sizes.margin, sizes.margin, 0, sizes.margin]}
          row
          middle
        >
          <Block>
            <Text h5>{title}</Text>
          </Block>
          <Block flex={false}>
            <IconButton onPress={() => setVisible(false)}>
              <MaterialIcons
                name="close"
                style={{
                  fontSize: 24,
                  marginHorizontal: 7,
                  color: colors.darkGray,
                }}
              />
            </IconButton>
          </Block>
        </Block>
        <Block margin={[0, sizes.margin, 0, sizes.margin]}>{children}</Block>
      </Block>
    </BlockModal>
  );
};

export default PopupDialogForm;
