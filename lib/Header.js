import React, { Component } from 'react';
import Block from './Block';
import { sizes } from './theme';

class Header extends Component {
  static defaultProps = {
    style: {},
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { style, children } = this.props;
    return (
      <Block row style={{ height: sizes.navBarHeight, ...props.style }}>
        {children}
      </Block>
    );
  }
}

export default connect(
  null,
  {}
)(Header);
