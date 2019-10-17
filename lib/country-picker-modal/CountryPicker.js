import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SafeAreaView from 'react-native-safe-area-view';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';

import Fuse from 'fuse.js';
import { sizes, colors } from '../theme';

import cca2List from './data/cca2.json';
import { getHeightPercent } from './ratio';
import CloseButton from './CloseButton';
import countryPickerStyles from './CountryPicker.style';
import StatusBar from '../StatusBar';
import Text from '../Text';

import Block from '../Block';

let countries = null;
let Emoji = null;
let styles = {};

let isEmojiable = Platform.OS === 'ios';

const FLAG_TYPES = {
  flat: 'flat',
  emoji: 'emoji',
};

const setCountries = flagType => {
  if (typeof flagType !== 'undefined') {
    isEmojiable = flagType === FLAG_TYPES.emoji;
  }

  if (isEmojiable) {
    countries = require('./data/countries-emoji.json');
    Emoji = require('./emoji').default;
  } else {
    countries = require('./data/countries.json');
    Emoji = <View />;
  }
};

setCountries();

export const getAllCountries = () =>
  cca2List.map(cca2 => ({ ...countries[cca2], cca2 }));

export default class CountryPicker extends Component {
  static propTypes = {
    cca2: PropTypes.string.isRequired,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    filterable: PropTypes.bool,
    children: PropTypes.node,
    countryList: PropTypes.array,
    excludeCountries: PropTypes.array,
    styles: PropTypes.object,
    filterPlaceholder: PropTypes.string,
    autoFocusFilter: PropTypes.bool,
    // to provide a functionality to disable/enable the onPress of Country Picker.
    disabled: PropTypes.bool,
    filterPlaceholderTextColor: PropTypes.string,
    closeButtonImage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    transparent: PropTypes.bool,
    animationType: PropTypes.oneOf(['slide', 'fade', 'none']),
    flagType: PropTypes.oneOf(Object.values(FLAG_TYPES)),
    hideAlphabetFilter: PropTypes.bool,
    hideCountryFlag: PropTypes.bool,
    renderFilter: PropTypes.func,
    showCallingCode: PropTypes.bool,
    filterOptions: PropTypes.object,
    showCountryNameWithFlag: PropTypes.bool,
  };

  static defaultProps = {
    translation: 'eng',
    countryList: cca2List,
    hideCountryFlag: false,
    excludeCountries: [],
    filterPlaceholder: 'Filter',
    autoFocusFilter: true,
    transparent: false,
    animationType: 'none',
  };

  static renderEmojiFlag(cca2, emojiStyle) {
    return (
      <Text
        style={[countryPickerStyles.emojiFlag, emojiStyle]}
        allowFontScaling={false}
      >
        {cca2 !== '' && countries[cca2.toUpperCase()] ? (
          <Emoji name={countries[cca2.toUpperCase()].flag} />
        ) : null}
      </Text>
    );
  }

  static renderImageFlag(cca2, imageStyle) {
    return cca2 !== '' ? (
      <Image
        style={[countryPickerStyles.imgStyle, imageStyle]}
        source={{ uri: countries[cca2].flag }}
      />
    ) : null;
  }

  static renderFlag(cca2, emojiStyle, imageStyle) {
    return (
      <Block flex={false} style={{ marginRight: sizes.margin }}>
        {isEmojiable
          ? CountryPicker.renderEmojiFlag(cca2, emojiStyle)
          : CountryPicker.renderImageFlag(cca2, imageStyle)}
      </Block>
    );
  }

  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);

    setCountries(props.flagType);
    let countryList = [...props.countryList];
    const excludeCountries = [...props.excludeCountries];

    excludeCountries.forEach(excludeCountry => {
      const index = countryList.indexOf(excludeCountry);

      if (index !== -1) {
        countryList.splice(index, 1);
      }
    });

    // Sort country list
    countryList = countryList
      .map(c => [c, this.getCountryName(countries[c])])
      .sort((a, b) => {
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      })
      .map(c => c[0]);

    this.state = {
      modalVisible: false,
      cca2List: countryList,
      flatListMap: countryList.map(n => ({ key: n })),
      dataSource: countryList,
      filter: '',
      letters: this.getLetters(countryList),
    };

    if (this.props.styles) {
      Object.keys(countryPickerStyles).forEach(key => {
        styles[key] = StyleSheet.flatten([
          countryPickerStyles[key],
          this.props.styles[key],
        ]);
      });
      styles = StyleSheet.create(styles);
    } else {
      styles = countryPickerStyles;
    }

    const options = Object.assign(
      {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['name'],
        id: 'id',
      },
      this.props.filterOptions
    );
    this.fuse = new Fuse(
      countryList.reduce(
        (acc, item) => [
          ...acc,
          { id: item, name: this.getCountryName(countries[item]) },
        ],
        []
      ),
      options
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.countryList !== this.props.countryList) {
      this.setState({
        cca2List: nextProps.countryList,
        dataSource: nextProps.countryList,
      });
    }
  }

  onSelectCountry(cca2) {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: this.state.cca2List,
    });

    this.props.onChange({
      cca2,
      ...countries[cca2],
      flag: undefined,
      name: this.getCountryName(countries[cca2]),
    });
  }

  onClose = () => {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: this.state.cca2List,
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  getCountryName(country, optionalTranslation) {
    if (!country) {
      return '';
    }
    const translation = optionalTranslation || this.props.translation || 'eng';
    return country.name[translation] || country.name.common;
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset;
  }

  getLetters(list) {
    return Object.keys(
      list.reduce(
        (acc, val) => ({
          ...acc,
          [this.getCountryName(countries[val])
            .slice(0, 1)
            .toUpperCase()]: '',
        }),
        {}
      )
    ).sort();
  }

  openModal = this.openModal.bind(this);

  // dimensions of country list and window
  itemHeight = getHeightPercent(7);

  listHeight = countries.length * this.itemHeight;

  openModal() {
    this.setState({ modalVisible: true });
  }

  scrollTo(letter) {
    // find position of first country that starts with letter
    const index = this.state.cca2List
      .map(country => this.getCountryName(countries[country])[0])
      .indexOf(letter);
    if (index === -1) {
      return;
    }
    let position = index * this.itemHeight;

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight;
    }

    this._flatList.scrollToIndex({ index });
  }

  handleFilterChange = value => {
    const filteredCountries =
      value === '' ? this.state.cca2List : this.fuse.search(value);
    this._flatList.scrollToIndex({ index: 0 });

    this.setState({
      filter: value,
      dataSource: filteredCountries,
      flatListMap: filteredCountries.map(n => ({ key: n })),
    });
  };

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectCountry(country)}
      >
        {this.renderCountryDetail(country)}
      </TouchableOpacity>
    );
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.scrollTo(letter)}
        activeOpacity={0.6}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText} allowFontScaling={false}>
            {letter}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCountryDetail(cca2) {
    const country = countries[cca2];
    return (
      <Block
        row
        style={{
          height: 45,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.gray,
        }}
        middle
      >
        {!this.props.hideCountryFlag && CountryPicker.renderFlag(cca2)}
        <Block style={styles.itemCountryName}>
          <Text small allowFontScaling>
            {this.getCountryName(country)}
          </Text>
          {this.props.showCallingCode && country.callingCode && (
            <Text style={styles.countryCode}>{`+${country.callingCode}`}</Text>
          )}
        </Block>
      </Block>
    );
  }

  renderFilter = () => {
    const {
      renderFilter,
      autoFocusFilter,
      filterPlaceholder,
      filterPlaceholderTextColor,
    } = this.props;

    const value = this.state.filter;
    const onChange = this.handleFilterChange;
    const { onClose } = this;

    return renderFilter ? (
      renderFilter({ value, onChange, onClose })
    ) : (
      <TextInput
        autoFocus={autoFocusFilter}
        autoCorrect={false}
        placeholder={filterPlaceholder}
        placeholderTextColor={filterPlaceholderTextColor}
        style={[styles.input, !this.props.closeable && styles.inputOnly]}
        onChangeText={onChange}
        value={value}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        >
          <Block flex={false} style={{ minWidth: 32 }}>
            {!this.props.showCountryNameWithFlag &&
              CountryPicker.renderFlag(
                this.props.cca2,
                styles.emojiFlag,
                styles.imgStyle
              )}
          </Block>
          <Block flex={false}>{this.props.children}</Block>
        </TouchableOpacity>
        <Modal
          transparent={this.props.transparent}
          animationType={this.props.animationType}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
          style={{ backgroundColor: colors.accent }}
        >
          <Block pointerEvents="box-none">
            <StatusBar hasHeight />
            <Block
              row
              middle
              flex={false}
              padding={[0, sizes.padding]}
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: colors.gray,
              }}
            >
              <Block>{this.props.filterable && this.renderFilter()}</Block>
              {this.props.closeable && (
                <CloseButton
                  image={this.props.closeButtonImage}
                  styles={[styles.closeButton, styles.closeButtonImage]}
                  onPress={() => this.onClose()}
                />
              )}
            </Block>

            <Block row margin={[sizes.margin, 0]} pointerEvents="box-none">
              <Block
                style={{ marginLeft: sizes.margin }}
                pointerEvents="box-none"
              >
                <FlatList
                  data={this.state.flatListMap}
                  ref={flatList => (this._flatList = flatList)}
                  initialNumToRender={30}
                  renderItem={country => this.renderCountry(country.item.key)}
                  keyExtractor={item => item.key}
                  getItemLayout={(data, index) => ({
                    length: this.itemHeight,
                    offset: this.itemHeight * index,
                    index,
                  })}
                  keyboardShouldPersistTaps="always"
                />
              </Block>
              <Block flex={false} padding={[0, sizes.padding]}>
                {!this.props.hideAlphabetFilter && (
                  <ScrollView
                    contentContainerStyle={styles.letters}
                    keyboardShouldPersistTaps="always"
                  >
                    {this.state.filter === '' &&
                      this.state.letters.map((letter, index) =>
                        this.renderLetters(letter, index)
                      )}
                  </ScrollView>
                )}
              </Block>
            </Block>
          </Block>
        </Modal>
      </View>
    );
  }
}
