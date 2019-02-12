import React, { Component } from 'react';

import { View, Text, StyleSheet, TextInput } from 'react-native';
import PhoneNumber from 'awesome-phonenumber';
import PickCountry from './PickCountry';
import { Fonts, Colors, Metrics } from './Themes';

class PhoneInput extends Component {
  static defaultProps = {
    style: {},
    focused: false,
    isformcontrol: false,
    onPhoneChanged: () => {},
    phone: '',
    placeholder: 'Enter your phone number',
  };

  static focus = () => {
    console.log('We will focus');
  };

  state = {
    cca2: 'KE',
    callingCode: '254',
    placeholder: 'Enter your mobile number',
  };

  componentWillMount() {
    const { phone } = this.props;
    if (phone) {
      if (phone.length > 0) {
        const pn = new PhoneNumber(phone);
        if (pn.isValid()) {
          const phone = pn.getNumber('national');
          this.onPhoneChange(phone);
        } else {
          this.setState({ phone });
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focused) {
      this._mobilenumberInput.focus();
    }
    if (!nextProps.placeholder) {
      const placeholder = PhoneNumber.getExample(
        this.state.cca2,
        'mobile'
      ).getNumber('national');
      this.setState({ placeholder });
    } else {
      this.setState({ placeholder: nextProps.placeholder });
    }
    if (nextProps.phone) {
      if (nextProps.phone.length > 0) {
        const pn = new PhoneNumber(nextProps.phone);
        if (pn.isValid()) {
          const phone = pn.getNumber('national');
          this.onPhoneChange(phone);
        } else {
          this.setState({ phone: nextProps.phone });
        }
      }
    }
  }

  callingcodeChanged = ({ cca2, callingCode }) => {
    const placeholder = PhoneNumber.getExample(
      this.state.cca2,
      'mobile'
    ).getNumber('national');
    this.setState({ callingCode, cca2, placeholder });
    this._mobilenumberInput.focus();
  };

  onPhoneChange = phone => {
    const pn = new PhoneNumber(phone, this.state.cca2);

    if (pn.isValid()) {
      this.props.onPhoneChanged({ text: phone, phone: pn.getNumber() });
    } else {
      this.props.onPhoneChanged({ text: phone, phone: '' });
    }
    this.setState({ phone });
  };

  render() {
    return (
      <View
        pointerEvents={
          !this.props.isformcontrol && this.props.focused === false
            ? 'none'
            : 'auto'
        }
        style={[styles.inputView, this.props.style]}
      >
        <PickCountry
          callingcodeChanged={this.callingcodeChanged}
          callingCode={this.state.callingCode}
          cca2={this.state.cca2}
          fontSize={this.props.fontSize || 16}
        />
        <TextInput
          placeholder={this.props.placeholder}
          ref={node => {
            this._mobilenumberInput = node;
          }}
          keyboardType="numeric"
          underlineColorAndroid="transparent"
          onChangeText={this.onPhoneChange}
          value={this.state.phone}
          style={{ ...styles.TextInput, fontSize: this.props.fontSize || 16 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    // height: 45,
    // borderRadius: 5,
    // marginHorizontal: Metrics.section,
    // marginVertical: Metrics.baseMargin,
    // backgroundColor: Colors.silver,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  mobileInput: {
    flexGrow: 1,
    height: 45,
    borderWidth: 0,
    borderColor: Colors.silver,
    borderRadius: 5,
  },
  TextInput: {
    flex: 1,
  },
});

export default PhoneInput;
