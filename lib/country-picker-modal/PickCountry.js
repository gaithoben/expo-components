import React, { Component } from 'react';

import { fonts } from '../theme';
import Text from '../Text';

import CountryPicker from './CountryPicker';

import countries from './data/countries.json';

class PickCountry extends Component {
  static defaultProps = {
    callingCode: '254',
    cca2: 'KE',
    callingcodeChanged: () => {},
    showCallingCode: false,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const country = countries[this.props.cca2] || {};
    const { showCallingCode } = this.props;
    return (
      <CountryPicker
        closeable
        filterable
        onChange={({ cca2, callingCode }) => {
          if (cca2 && callingCode) {
            this.props.callingcodeChanged({ cca2, callingCode });
          }
        }}
        cca2={this.props.cca2}
        translation="eng"
        style={{ flexDirection: 'row' }}
        animationType="slide"
        filterPlaceholder="Search Country"
        flagType="flat"
      >
        {showCallingCode && <Text body>{`+${country.callingCode} `}</Text>}
      </CountryPicker>
    );
  }
}

export default PickCountry;
