import React, { useState } from 'react';
import { FlatList, Platform, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import * as IntentLauncherAndroid from 'expo-intent-launcher';

import APhoneNumber from 'awesome-phonenumber';

import Fuse from 'fuse.js';

import { Ripple } from 'material-bread';

import Block from './Block';
import Text from './Text';

import IconButton from './IconButton';
import Header from './Header';
import BlockModal from './modal/BlockModal';
import Button from './Button';
import SearchComponent from './SearchComponent';
import { colors, sizes } from './theme';
import PhoneInput from './PhoneInput';

const PhoneNumber = props => {
  const [visible, setVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [permissions, setPermissions] = useState(true);
  const [val, setVal] = useState('');

  const thisFlatlist = React.useRef();

  const getContacts = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CONTACTS);
      if (status !== 'granted') {
        setPermissions(false);
      }
    } catch (error) {
      // do nothing
      setPermissions(false);
    }

    if (permissions) {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const contacts = data
          .map(c => {
            const phone = [...(c.phoneNumbers || [])][0] || {};
            return {
              id: c.id,
              name: c.name,
              phone: phone.number,
            };
          })
          .filter(f => !!f.phone);

        setContacts(contacts);
        setFiltered(contacts);
      }
    }
  };
  const options = {
    keys: ['name', 'phone'],
  };

  const thisfuse = new Fuse(contacts, options);

  const handleFilterChange = value => {
    const filtered = value === '' ? contacts : thisfuse.search(value);
    if (thisFlatlist) {
      // thisFlatlist.scrollToIndex({ index: 0 });
    }

    setFiltered(filtered);
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    }

    if (Platform.OS === 'android') {
      IntentLauncherAndroid.startActivityAsync(
        IntentLauncherAndroid.ACTION_MANAGE_APPLICATIONS_SETTINGS
      );
    }
  };

  React.useEffect(() => {
    if (visible) {
      getContacts();
    }
  }, [visible]);

  const onSelectContact = contact => {
    if (contact && contact.phone) {
      const pn = new APhoneNumber(contact.phone, 'KE');
      if (pn.isValid()) {
        props.input.onChange(pn.getNumber());
        props.input.onBlur();
      } else {
        props.input.onChange('');
        props.input.onBlur();
      }
    }
    setVisible(false);
  };

  const renderContact = ({ item }) => (
    <Ripple onPress={() => onSelectContact(item)}>
      <Block
        flex={false}
        row
        style={{
          height: 45,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.gray2,
        }}
        padding={[sizes.padding / 3, 0]}
      >
        <Block>
          <Text semibold>{`${item.name}`}</Text>
          <Text darkGray>{`${item.phone}`}</Text>
        </Block>
      </Block>
    </Ripple>
  );

  const icon = (
    <IconButton onPress={() => setVisible(true)}>
      <MaterialIcons name="contacts" size={24} />
    </IconButton>
  );

  return (
    <React.Fragment>
      <PhoneInput
        showCountryPicker={false}
        placeholder="0712 123456"
        number
        trailingIcon={icon}
        value={val}
        onChange={val => setVal(val)}
        {...props}
      />
      <BlockModal
        fill
        isVisible={visible}
        onClose={() => setVisible(false)}
        swipeDirection="down"
        propagateSwipe
      >
        <Block pointerEvents="box-none">
          <Header dark onBack={() => setVisible(false)}>
            <SearchComponent onChange={handleFilterChange} />
          </Header>
          <Block padding={sizes.padding} pointerEvents="box-none">
            {!permissions && (
              <Block
                color={colors.milkyWhite}
                card
                shadow
                padding={sizes.padding}
                flex={false}
              >
                <Block flex={false}>
                  <Text error>Please enable permission to access contacts</Text>
                </Block>

                <Block row right padding={[sizes.padding / 2, 0]} flex={false}>
                  <Button onPress={openSettings}>
                    <Text cropped milkyWhite>
                      grant permissions
                    </Text>
                  </Button>
                </Block>
              </Block>
            )}
            <FlatList
              data={filtered}
              renderItem={renderContact}
              keyExtractor={(item, index) => `index-${item.id}`}
              ref={thisFlatlist}
              keyboardShouldPersistTaps="always"
            />
          </Block>
        </Block>
      </BlockModal>
    </React.Fragment>
  );
};

export default PhoneNumber;
