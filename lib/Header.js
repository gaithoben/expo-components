import React, { Component, Fragment } from 'react';
import { StatusBar, View } from 'react-native';
import Block from './Block';
import { sizes, colors } from './theme';

class Header extends Component {
  static defaultProps = {
    style: {},
    barStyle: 'light-content',
    leftComponent: () => <Block flex={false} />,
    middleComponent: () => <Block flex={false} />,
    rightComponent: () => <Block flex={false} />,
    titlecenter: false,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderLeft() {
    return (
      <Block flex={false} style={{ paddingRight: sizes.base }}>
        {this.props.leftComponent()}
      </Block>
    );
  }
  renderMiddle() {
    const { titlecenter } = this.props;
    return (
      <Block
        style={{ paddingHorizontal: sizes.base }}
        center={Boolean(titlecenter)}
      >
        {this.props.middleComponent()}
      </Block>
    );
  }

  renderRight() {
    return (
      <Block flex={false} style={{ paddingLeft: sizes.base }}>
        {this.props.rightComponent()}
      </Block>
    );
  }

  render() {
    const { style, children, shadow } = this.props;
    return (
      <Fragment>
        <StatusBar
          translucent
          barStyle={this.props.barStyle}
          backgroundColor="rgba(0, 0, 0, 0.251)"
        />
        <Block
          {...this.props}
          row
          flex={false}
          style={[
            {
              paddingTop: sizes.padding * 2,
              height: sizes.navBarHeight,
              borderBottomColor: colors.dark,
              paddingHorizontal: sizes.padding,
            },
            style,
          ]}
        >
          {this.renderLeft()}
          {this.renderMiddle()}
          {this.renderRight()}
        </Block>
      </Fragment>
    );
  }
}

export default Header;
