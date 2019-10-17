import React, { useState } from 'react';
import { Modal as RNModal } from 'react-native';
import Block from '../Block';
import Text from '../Text';

const Modal = ({ onClose, isVisible, children, ...props }) => {
  const [] = useState(0);

  return (
    <RNModal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
      {...props}
    >
      <Block>{children}</Block>
    </RNModal>
  );
};

Modal.defaultProps = {
  onClose: () => {}
};
export default Modal;
