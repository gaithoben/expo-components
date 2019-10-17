import React from 'react';
import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useDebounce from './useDebounce';
import { useFonts } from './theme';

const SearchComponent = ({ placeholder, disabled, onChange = () => {} }) => {
  const { fonts } = useFonts();
  const [text, setText] = React.useState('');

  const debouncedtext = useDebounce(text, 400);

  React.useEffect(() => {
    onChange(debouncedtext);
  }, [debouncedtext]);

  const onSearch = text => {
    setText(text);
  };

  return (
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
        onChangeText={onSearch}
        style={{
          flex: 1,
          color: '#333',
          paddingHorizontal: 7,
          ...fonts.body,
        }}
        placeholder={placeholder || 'Search...'}
        underlineColorAndroid="transparent"
        autoFocus
        disabled={disabled}
      />

      <Ionicons name="ios-search" style={{ marginRight: 7, fontSize: 24 }} />
    </View>
  );
};

export default SearchComponent;
