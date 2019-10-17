import React, { useState } from 'react';
import { Checkbox } from 'material-bread';
import Block from './Block';
import Text from './Text';
import { sizes, colors, useFonts } from './theme';

const CheckBox = ({
  value,
  meta = {},
  label = 'Check',
  input,
  onChange,
  ...props
}) => {
  const { fonts } = useFonts();
  const val = input.value || value;
  const error = meta.touched && meta.error;

  const [checked, setChecked] = useState(val);

  React.useEffect(() => {
    if (onChange && typeof onChange === 'function') {
      onChange(checked);
    }

    if (input && input.onChange && typeof input.onChange === 'function') {
      input.onChange(checked);
    }
  }, [checked]);

  return (
    <Block flex={false} style={{ minHeight: sizes.inputHeight }}>
      <Checkbox
        rippleMatchesCheckbox
        checkboxColor="#009688"
        checked={checked}
        label={label}
        onPress={() => setChecked(!checked)}
        labelStyle={{ ...fonts.body, color: colors.darkGray }}
        {...input}
        {...props}
      />

      <Block flex={false} style={styles.error}>
        <Text small error>
          {error && meta.error}
        </Text>
      </Block>
    </Block>
  );
};

const styles = {
  error: {
    marginTop: 2.5,
    height: 14,
    marginBottom: 2.5,
  },
  inputContainer: {
    borderBottomWidth: 0,
    flexShrink: 1,
  },
};

export default CheckBox;
