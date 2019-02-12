import React from 'react';
import { Button, Header, Title, View } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ApplicationStyles } from '../Themes';

const HomeHeaderComponent = props => {
  const { title, drawerNavigator } = props;

  return (
    <View style={styles.header}>
      <View>
        <Button transparent onPress={() => drawerNavigator.openDrawer()}>
          <MaterialIcons name="menu" size={28} />
        </Button>
      </View>
      <View style={styles.leftalignedTitleContainer}>
        <Title style={styles.titleText}>{title}</Title>
      </View>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
};

export default HomeHeaderComponent;
