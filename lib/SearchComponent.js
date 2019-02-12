import React, { Component, Fragment } from 'react';
import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Form, Field, FormSpy } from 'react-final-form';
import debounce from 'lodash/debounce';
import { ApplicationStyles, Fonts } from './Themes';

const styles = {
  ...ApplicationStyles.form,
  searchInput: {
    height: 45,
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 0.5,
  },
};

class SearchComponent extends Component {
  static defaultProps = {
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.onSearch = debounce(this.onSearch, 400);
  }

  componentDidMount() {}

  onSearch = ({ values }) => {
    if (values.search) {
      this.props.onChange(values.search);
    }
  };

  render() {
    const renderField = ({ placeholder, disabled, input }) => (
      <View
        style={{
          height: 35,
          borderWidth: 0.5,
          borderColor: '#CCC',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          {...input}
          style={{
            flex: 1,
            color: '#333',
            paddingHorizontal: 7,
            ...Fonts.style.medium,
          }}
          placeholder={placeholder || 'Search...'}
          underlineColorAndroid="transparent"
          autoFocus
          disabled={disabled}
        />

        <Ionicons name="ios-search" style={{ marginRight: 7, fontSize: 24 }} />
      </View>
    );

    return (
      <Form
        onSubmit={() => {}}
        onChange={this.props.onChange}
        render={({ values, handleSubmit }) => (
          <Fragment>
            <FormSpy onChange={this.onSearch} />
            <Field name="search" component={renderField} />
          </Fragment>
        )}
      />
    );
  }
}

export default SearchComponent;
