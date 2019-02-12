import React, { Component } from 'react';
import {
  View,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Right,
  Body,
  Left,
  Picker,
  Form,
} from 'native-base';

const styles = {
  pickerStyle: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#CCC',
  },
};

export default class CountySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
  }

  componentDidMount() {
    // axiosinstance().get(`${CONFIG.API_ENDPOINT}/`);
  }

  onValueChange(value: string) {
    this.setState({
      selected: value,
    });
  }

  render() {
    return (
      <View>
        <Content>
          <Form>
            <Picker
              renderHeader={backAction => (
                <Header style={{ backgroundColor: '#f44242' }}>
                  <Left>
                    <Button transparent onPress={backAction}>
                      <Icon name="arrow-back" style={{ color: '#fff' }} />
                    </Button>
                  </Left>
                  <Body style={{ flex: 3 }}>
                    <Title style={{ color: '#fff' }}>Select Country</Title>
                  </Body>
                  <Right />
                </Header>
              )}
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              selectedValue={this.state.selected}
              onValueChange={this.onValueChange.bind(this)}
              style={styles.pickerStyle}
              placeholder="Select Your County"
            >
              <Picker.Item label="Wallet" value="key0" />
              <Picker.Item label="ATM Card" value="key1" />
              <Picker.Item label="Debit Card" value="key2" />
              <Picker.Item label="Credit Card" value="key3" />
              <Picker.Item label="Net Banking" value="key4" />
            </Picker>
          </Form>
        </Content>
      </View>
    );
  }
}
