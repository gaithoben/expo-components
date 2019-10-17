import React, { useState, useEffect } from 'react';
import ModalDropdown from './modal/ModalDropdown';
import { colors } from './theme';

const Dropdown = ({
  options,
  placeholder,
  onChange,
  defaultValue,
  value,
  input,
  ...props
}) => {
  const [selected, setSelected] = useState(value || defaultValue);

  const selectItem = item => {
    setSelected(item);
  };

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selected);
    }
  }, [selected]);

  return (
    <ModalDropdown
      data={options}
      value={selected}
      onChange={selectItem}
      containerStyle={{
        borderBottomColor: colors.gray,
        borderBottomWidth: 0.5,
      }}
      {...input}
      {...props}
    />
  );
};

Dropdown.defaultProps = {
  options: [],
};

export default Dropdown;
