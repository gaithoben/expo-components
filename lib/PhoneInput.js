import React, { Component } from 'react';

import { StyleSheet, TextInput, Platform } from 'react-native';
import PhoneNumber from 'awesome-phonenumber';
import PickCountry from './country-picker-modal/PickCountry';
import Block from './Block';
import Text from './Text';
import ThemeContext from './theme/ThemeContext';

class PhoneInput extends Component {
  static defaultProps = {
    style: {},
    meta: {},
    showErrors: true,
    input: {
      onChange: () => {},
      onBlur: () => {},
      value: '',
    },
    focused: false,
    onPhoneChanged: () => {},
    phone: '',
    placeholder: 'Enter your phone number',
    bordered: true,
    disabled: false,
    allowFontScaling: false,
    showCountryPicker: true,
    cca2: 'KE',
    callingCode: '254',
  };

  constructor(props) {
    super(props);
    this.state = {
      cca2: props.cca2 || 'KE',
      callingCode: props.callingCode || '254',
      placeholder: 'Enter your mobile number',
      phone: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let phone = nextProps.input.value || nextProps.value;

    function getPhone() {
      const pn = new PhoneNumber(phone || '', prevState.cca2);

      if (pn.isValid()) {
        phone = pn.getNumber();
        return { phone, cca2: pn.getRegionCode() };
      }
      return {};
    }

    function getPlaceHolder() {
      if (!nextProps.placeholder) {
        const placeholder = PhoneNumber.getExample(
          prevState.cca2 || 'KE',
          'mobile'
        ).getNumber('national');
        return { placeholder };
      }

      return {};
    }

    const newstate = {
      ...prevState,
      ...getPhone(),
      ...getPlaceHolder(),
    };
    return newstate;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.focused && !prevProps.focused) {
  //     this._mobilenumberInput.focus();
  //   }
  // }

  componentDidMount() {
    const phone = this.props.input.value || this.props.value;
    this.onPhoneChange(phone);
  }

  callingcodeChanged = ({ cca2, callingCode }) => {
    const placeholder = PhoneNumber.getExample(
      cca2 || 'KE',
      'mobile'
    ).getNumber('national');

    this.setState({
      callingCode: callingCode || '254',
      cca2: cca2 || 'KE',
      placeholder,
    });
    this._mobilenumberInput.focus();
  };
  onPhoneChange = phone => {
    if (phone) {
      const pn = new PhoneNumber(phone, this.state.cca2);
      if (pn.isValid()) {
        this.props.onPhoneChanged({ text: phone, phone: pn.getNumber() });
        this.props.input.onChange(pn.getNumber());
        this.props.input.onBlur();
      } else {
        this.props.onPhoneChanged({ text: phone, phone: '' });
        this.props.input.onChange('');
        this.props.input.onBlur();
      }
    }
    this.setState({ phone });
  };

  render() {
    const {
      bordered,
      meta,
      showErrors,
      disabled,
      allowFontScaling,
      showCountryPicker,
      trailingIcon,
    } = this.props;
    const { error } = meta;

    return (
      <ThemeContext.Consumer>
        {({ fonts, sizes, colors }) => {
          const styles = StyleSheet.create({
            error: {
              marginTop: 5,
              height: 14,
              marginBottom: 2.5,
            },
            inputContainer: {
              height: sizes.inputHeight,
              marginTop: 5,
            },
            labeledContainer: {
              paddingHorizontal: sizes.padding,
              borderWidth: 0.5,
              borderRadius: 5,
            },
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
                  paddingHorizontal: 2.5,
                }}
              >
                {showCountryPicker && (
                  <PickCountry
                    callingcodeChanged={this.callingcodeChanged}
                    cca2={this.state.cca2}
                    fontSize={sizes.body}
                  />
                )}
                <TextInput
                  placeholder={this.props.placeholder}
                  ref={node => {
                    this._mobilenumberInput = node;
                  }}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  onChangeText={this.onPhoneChange}
                  value={this.state.phone}
                  editable={!disabled}
                  allowFontScaling={allowFontScaling}
                  style={{
                    paddingTop: Platform.OS === 'android' ? 0 : '1%',
                    flex: 1,
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
}

export default PhoneInput;
