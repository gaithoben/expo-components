import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Modal } from 'react-native';

class ModalComponent extends Component {
  static defaultProps = {
    visible: false,
  };
  state = {};

  onRequestClose = () => {};
  render() {
    return (
      <Modal visible={this.props.visible} style={styles.modal} onRequestClose={this.onRequestClose}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFF' }}>I am the modal content!</Text>
        </View>
      </Modal>
    );
  }
}

export default ModalComponent;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
