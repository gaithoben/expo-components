import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

const KeyboardView = ({ children, ...props }) => (
  //   const [] = useState(0);

  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : null}
    style={{ flex: 1 }}
    {...props}
  >
    {children}
  </KeyboardAvoidingView>
);
export default KeyboardView;
