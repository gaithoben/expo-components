import React from 'react';

import { StyleSheet, TextInput, Platform } from 'react-native';
import PhoneNumber from 'awesome-phonenumber';
import PickCountry from './country-picker-modal/PickCountry';
import Block from './Block';
import Text from './Text';
import ThemeContext from './theme/ThemeContext';

const PhoneInput = React.forwardRef(
  (
    {
      bordered,
      meta,
      showErrors,
      disabled,
      allowFontScaling,
      showCountryPicker,
      trailingIcon,
      ...props
    },
    ref
  ) => {
    const phonevalue = props.input.value || props.value;

    const [cca2, setCca2] = React.useState(props.cca2 || 'KE');
    const [callingCode, setCallingCode] = React.useState(
      props.callingCode || '254'
    );
    const [phone, setPhone] = React.useState('');
    const [placeholder, setPlaceholder] = React.useState('');

    const mobilenumberInput = React.useRef();

    function getPlaceHolder() {
      if (!props.placeholder) {
        const placeholder = PhoneNumber.getExample(
          cca2 || 'KE',
          'mobile'
        ).getNumber('national');
        setPlaceholder(placeholder);
      }
    }

    function getPhone() {
      const pn = new PhoneNumber(phonevalue || '', cca2);

      if (pn.isValid()) {
        const newphone = pn.getNumber();
        setPhone(newphone);
        setCca2(pn.getRegionCode());
        onPhoneChange(newphone);
      }
    }

    React.useEffect(() => {
      getPlaceHolder();
      getPhone();
    }, [phonevalue]);

    const callingcodeChanged = ({ cca2, callingCode }) => {
      const placeholder = PhoneNumber.getExample(
        cca2 || 'KE',
        'mobile'
      ).getNumber('national');

      setCallingCode(callingCode || '254');
      setCca2(cca2 || 'KE');
      setPlaceholder(placeholder);

      mobilenumberInput.current.focus();
    };

    const onPhoneChange = phone => {
      if (phone) {
        const pn = new PhoneNumber(phone, cca2);
        if (pn.isValid()) {
          props.onPhoneChanged({ text: phone, phone: pn.getNumber() });
          props.input.onChange(pn.getNumber());
          props.input.onBlur();
          props.onChange(pn.getNumber());
        } else {
          props.onPhoneChanged({ text: phone, phone: '' });
          props.input.onChange('');
          props.onChange('');
          props.input.onBlur();
        }
      }
      setPhone(phone);
    };

    React.useImperativeHandle(ref, () => ({
      clearInput: () => {
        setPhone('');
      }
    }));
    const { error } = meta;

    return (
      <ThemeContext.Consumer>
        {({ fonts, sizes, colors }) => {
          const styles = StyleSheet.create({
            error: {
              marginTop: 5,
              height: 14,
              marginBottom: 2.5
            },
            inputContainer: {
              height: sizes.inputHeight,
              marginTop: 5
            },
            labeledContainer: {
              paddingHorizontal: sizes.padding,
              borderWidth: 0.5,
              borderRadius: 5
            }
          });

          return (
            <Block flex={false}>
              <Block
                flex={false}
                row
                middle
                style={{
                  height: sizes.inputHeight,
                  minWidth: '100%',
                  borderWidth: 1,
                  borderColor: error ? colors.error : colors.gray,
                  borderRadius: 5,
                  paddingHorizontal: 2.5
                }}
              >
                {showCountryPicker && (
                  <PickCountry
                    callingcodeChanged={callingcodeChanged}
                    cca2={cca2}
                    fontSize={sizes.body}
                  />
                )}
                <TextInput
                  placeholder={placeholder}
                  ref={mobilenumberInput}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  onChangeText={onPhoneChange}
                  value={phone}
                  editable={!disabled}
                  allowFontScaling={allowFontScaling}
                  style={{
                    paddingTop: Platform.OS === 'android' ? 0 : '1%',
                    flex: 1
                  }}
                />
                {trailingIcon && (
                  <Block flex={false} padding={2.5}>
                    {trailingIcon}
                  </Block>
                )}
              </Block>
              {showErrors && (
                <Text small error style={styles.error}>
                  {error && meta.error}
                </Text>
              )}
            </Block>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
);

PhoneInput.defaultProps = {
  style: {},
  meta: {},
  showErrors: true,
  input: {
    onChange: () => {},
    onBlur: () => {},
    value: ''
  },
  focused: false,
  onPhoneChanged: () => {},
  onChange: () => {},
  phone: '',
  placeholder: 'Enter your phone number',
  bordered: true,
  disabled: false,
  allowFontScaling: false,
  showCountryPicker: true,
  cca2: 'KE',
  callingCode: '254'
};

export default PhoneInput;
