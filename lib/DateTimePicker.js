import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import RNMDateTimePicker from 'react-native-modal-datetime-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import isString from 'lodash/isString';
import Block from './Block';
import Text from './Text';
import IconButton from './IconButton';
import { sizes, colors } from './theme';

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

  error: {
    marginTop: 2.5,
    height: 14,
    marginBottom: 2.5,
  },
};

export default class DateTimePicker extends Component {
  static defaultProps = {
    placeholder: 'select...',
    format: 'DD MMM, YYYY',
    value: null,
    onChange: () => {},
    input: {
      value: null,
      onChange: () => {},
      onBlur: () => {},
    },
    meta: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      selectedDate: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, input, format } = nextProps;
    let val = input.value || value;

    if (isString(val)) {
      val = moment(val, format).getTime();
    }

    if (!val) {
      return {
        ...prevState,
        selectedDate: null,
      };
    }

    if (val !== prevState.selectedDate) {
      return {
        ...prevState,
        selectedDate: val,
      };
    }
    return { ...prevState };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    const newdate = new Date(date).getTime();
    this.logChange(newdate);
    this.hideDateTimePicker();
  };

  logChange = date => {
    if (date) {
      const formateddate = moment(date).format(this.props.format);
      this.props.onChange(date, formateddate);
      this.props.input.onChange(date, formateddate);
      this.props.input.onBlur();
    }
  };

  removeDate = () => {
    this.props.onChange(null, null);
    this.props.input.onChange(null, null);
    this.props.input.onBlur();
  };

  render() {
    const { placeholder, meta } = this.props;
    const { selectedDate } = this.state;

    const error = meta.touched && meta.error;

    const defaultDate = this.state.selectedDate
      ? new Date(this.state.selectedDate)
      : new Date();

    return (
      <Block>
        <TouchableOpacity
          onPress={() => {
            this.showDateTimePicker();
          }}
          style={styles.textField(meta)}
        >
          {selectedDate ? (
            <Block row middle>
              <Text style={{ normal, flex: 1, color: '#333' }}>
                {`${moment(selectedDate).format('DD MMM, YYYY')}`}
              </Text>

              <IconButton size={32} onPress={this.removeDate}>
                <MaterialIcons name="close" style={{ fontSize: 16 }} />
              </IconButton>
            </Block>
          ) : (
            <Text style={{ normal, flex: 1, color: '#BBB' }}>
              {placeholder}
            </Text>
          )}
          <Ionicons
            name="ios-arrow-down"
            style={{ fontSize: 16, marginHorizontal: 7 }}
          />
        </TouchableOpacity>
        <Block flex={false} style={styles.error}>
          <Text small error>
            {error && meta.error}
          </Text>
        </Block>

        <RNMDateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          date={defaultDate}
        />
        <Block />
      </Block>
    );
  }
}
