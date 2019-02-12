import React, { Component } from 'react';
import { Icon } from 'native-base';
import { StyleSheet, Text, View, PixelRatio } from 'react-native';

import CountryPicker, { getAllCountries } from 'rn-country-picker-modal';
import PhoneNumber from 'awesome-phonenumber';

class PickCountry extends Component {
  static defaultProps = {
    callingCode: '254',
    cca2: 'KE',
    callingcodeChanged: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.flag}>
          <CountryPicker
            closeable
            filterable
            onChange={({ cca2, callingCode }) => {
              this.props.callingcodeChanged({ cca2, callingCode });
            }}
            cca2={this.props.cca2}
            translation="eng"
            style={{ flexDirection: 'row' }}
            animationType="slide"
            filterPlaceholder="Search Country"
            flagType="flat"
          >
            <View style={styles.callingCodeContainer}>
              <Text style={{ fontSize: this.props.fontSize || 16 }}>
                {`+${this.props.callingCode} `}
              </Text>
            </View>
          </CountryPicker>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  flag: {
    justifyContent: 'center',
    marginLeft: 5
  },
  dropIcon: {
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'center',
    fontSize: 22,
    color: '#888'
  },
  callingCodeContainer: {
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default PickCountry;
