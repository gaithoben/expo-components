import React from 'react';
import { Button, Title, View } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

const DialogHeaderComponent = props => {
  const { title, onClose, right, left } = props;

  return (
    <View style={styles.header}>
      <View>
        {left || (
          <Button transparent onPress={() => onClose()}>
            <AntDesign name="arrowleft" size={24} />
          </Button>
        )}
      </View>
      <View style={styles.title}>
        <Title style={styles.titleText}>{title}</Title>
      </View>
      <View>{right}</View>
    </View>
  );
};

DialogHeaderComponent.defaultProps = {
  onClose: () => {}
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    paddingHorizontal: 10,
    marginTop: 15
  },
  title: {
    flex: 1
  }
};

export default DialogHeaderComponent;
