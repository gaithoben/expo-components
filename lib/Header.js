import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sizes, colors } from './theme';
import Block from './Block';
import StatusBar from './StatusBar';

class Header extends Component {
  static defaultProps = {
    style: {},
    barStyle: 'light-content',
    leftComponent: null,
    middleComponent: null,
    rightComponent: null,
    titlecenter: false,
    height: sizes.navBarHeight,
    onBack: () => {},
    onClose: () => {},
    hasHeight: true,
    dark: true,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onBack = () => {
    this.props.onBack();
    this.props.onClose();
  };

  renderLeft() {
    return (
      <Block flex={false} style={{ paddingRight: sizes.base }} middle>
        {typeof this.props.leftComponent === 'function' ? (
          this.props.leftComponent()
        ) : (
          <TouchableOpacity onPress={this.onBack}>
            <Ionicons name="md-arrow-back" size={32} color="black" />
          </TouchableOpacity>
        )}
      </Block>
    );
  }

  renderMiddle() {
    const { titlecenter } = this.props;
    return (
      <Block
        style={{ paddingHorizontal: sizes.base, position: 'relative' }}
        center={Boolean(titlecenter)}
        middle
      >
        {typeof this.props.middleComponent === 'function'
          ? this.props.middleComponent()
          : this.props.children}
      </Block>
    );
  }

  renderRight() {
    return (
      <Block flex={false} style={{ paddingLeft: sizes.base }} middle>
        {typeof this.props.rightComponent === 'function' ? (
          this.props.rightComponent()
        ) : (
          <Block flex={false} />
        )}
      </Block>
    );
  }

  render() {
    const {
      color,
      style,
      children,
      height,
      shadow,
      hasHeight,
      dark,
      light,
      borderBottom,
      ...props
    } = this.props;

    const headerStyles = [
      height && { height },
      borderBottom && {
        borderBottomColor: colors.gray2,
        borderBottomWidth: 0.5,
      },
      Array.isArray(style) ? [...style] : style,
    ];

    return (
      <Block flex={false}>
        <StatusBar
          dark={dark}
          light={light}
          hasHeight={hasHeight}
          color={color}
        />
        <Block
          row
          middle
          flex={false}
          style={headerStyles}
          padding={[0, sizes.padding]}
          {...props}
        >
          <Block row flex={false}>
            {this.renderLeft()}
            {this.renderMiddle()}
            {this.renderRight()}
          </Block>
        </Block>
      </Block>
    );
  }
}

export default Header;
