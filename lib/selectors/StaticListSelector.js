import React, { Component } from 'react';
import {
  View,
  Text,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Right,
  Body,
  Left,
  Picker,
  Form
} from 'native-base';
import isObject from 'lodash/isObject';

const styles = {
  pickerStyle: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#CCC'
  },
  error: {
    color: '#F44336'
  }
};

export default class StaticListSelector extends Component {
  static defaultProps = {
    placeholder: 'Select...',
    input: {
      value: null,
      onChange: () => {}
    },
    onChange: () => {},
    value: null,
    displayField: '',
    list: [],
    returnkeys: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const value = nextProps.input.value || nextProps.value;
    if (value) {
      const selectedValue = isObject(value) ? value._id : value;

      const ind = nextProps.list.findIndex(
        i => i._id === selectedValue || i === selectedValue
      );

      if (ind !== prevState.selected) {
        return { ...prevState, selected: ind };
      }
      return { ...prevState };
    }
    return { ...prevState };
  }

  onValueChange(value: string) {
    const { returnkeys, list } = this.props;
    const val = list[value];
    if (isObject(val)) {
      if (returnkeys.length > 0) {
        const returnObj = {};
        returnkeys.forEach(key => {
          returnObj[key] = val[key];
        });
        this.props.onChange(returnObj);
        this.props.input.onChange(returnObj);
      } else {
        this.props.onChange(val);
        this.props.input.onChange(val);
      }
    } else {
      this.props.onChange(val);
      this.props.input.onChange(val);
    }
  }

  renderList = () => {
    const { displayField, list } = this.props;
    return list.map((item, index) => (
      <Picker.Item
        key={`item${index}`}
        label={isObject(item) ? item[displayField] : item}
        value={index}
      />
    ));
  };

  render() {
    const { meta } = this.props;
    return (
      <View>
        <Picker
          renderHeader={backAction => (
            <Header style={{ backgroundColor: '#f44242' }}>
              <Left>
                <Button transparent onPress={backAction}>
                  <Icon name="arrow-back" style={{ color: '#fff' }} />
                </Button>
              </Left>
              <Body style={{ flex: 3 }}>
                <Title style={{ color: '#fff' }}>
                  {this.props.placeholder}
                </Title>
              </Body>
              <Right />
            </Header>
          )}
          mode="dropdown"
          iosIcon={<Icon name="ios-arrow-down" />}
          selectedValue={this.state.selected}
          onValueChange={this.onValueChange.bind(this)}
          style={styles.pickerStyle}
          placeholder={this.props.placeholder}
        >
          {this.renderList()}
        </Picker>
        {meta.touched && meta.error && (
          <Text style={styles.error}>{meta.error}</Text>
        )}
      </View>
    );
  }
}
