import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Block from './Block';
import Text from './Text';
import { sizes, colors, verticalScale } from './theme';
import BlockModal from './modal/BlockModal';

import IconButton from './IconButton';
import Form from './form/Form';

const styles = {
  textField: meta => ({
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: meta.touched && meta.error ? colors.error : colors.gray,
    height: sizes.inputHeight,
    padding: 7,
    alignItems: 'center',
    marginBottom: 7,
  }),
  inputContainer: {
    borderBottomWidth: 0,
    flexShrink: 1,
  },
};

const FormField = ({
  value,
  input,
  onChange,
  labelExtractor = () => null,
  render = () => null,
  meta,
  placeholder,
}) => {
  const [visible, setVisible] = React.useState(false);
  const values = input ? input.value || {} : value || {};

  const error = meta.touched && meta.error;

  const onSubmit = values => {
    if (input && input.onChange) {
      input.onChange(values);
    }
    if (onChange) {
      onChange(values);
    }
    setVisible(false);
  };

  return (
    <Block flex={false} style={styles.inputContainer}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.textField(meta)}
      >
        <Text style={{ color: '#333' }}>
          {labelExtractor(values) || <Text gray>{`${placeholder || ''}`}</Text>}
        </Text>
      </TouchableOpacity>
      <Block flex={false} style={styles.error}>
        <Text small error>
          {error && meta.error}
        </Text>
      </Block>
      <BlockModal
        isVisible={visible}
        swipeDirection={null}
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
              <Text h5>Next of Kin details</Text>
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
          <Block>
            <Form
              onSubmit={onSubmit}
              initialValues={values || {}}
              render={render}
            />
          </Block>
        </Block>
      </BlockModal>
    </Block>
  );
};

FormField.defaultProps = {
  meta: {},
};

export default FormField;
