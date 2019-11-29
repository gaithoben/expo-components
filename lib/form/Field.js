import React from 'react';
import { Field as FinalFormField } from 'react-final-form';
import isNaN from 'lodash/isNaN';
import FieldBlock from '../FieldBlock';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

const requiredField = value => (value ? undefined : 'Required');
const notEmptyField = value => (isEmpty(value) ? undefined : 'Required');
const mustBeNumber = value =>
  !isNumber(value) ? 'Must be a number' : undefined;

const minFieldValue = min => value => {
  if (Number(value) > Number(min) || isNaN(value)) {
    return `Should be greater than ${min}`;
  }
  return undefined;
};

const maxFieldValue = max => value => {
  if (Number(value) > Number(max) || isNaN(value)) {
    return `Should be less than ${max}`;
  }
  return undefined;
};

const minFieldLength = min => value => {
  if (`${value}`.length < Number(min) || !value) {
    return `Should be more than ${min} characters`;
  }
  return undefined;
};
const maxFieldLength = max => value => {
  if (`${value}`.length > Number(max) || !value) {
    return `Should be less than ${max} characters`;
  }
  return undefined;
};

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

const Field = ({
  required,
  notEmpty,
  number,
  minValue,
  maxValue,
  minLength,
  maxLength,
  label,
  showLabel = true,
  row,
  component,
  type,
  flex = false,
  style,
  ...props
}) => {
  let validators = [];

  if (required) {
    validators = [...validators, requiredField];
  }
  if (notEmpty) {
    validators = [...validators, notEmptyField];
  }
  if (number) {
    validators = [...validators, mustBeNumber];
  }
  if (minValue || minValue === 0) {
    validators = [...validators, minFieldValue(minValue)];
  }
  if (maxValue || maxValue === 0) {
    validators = [...validators, maxFieldValue(maxValue)];
  }

  if (minLength) {
    validators = [...validators, minFieldLength(minLength)];
  }
  if (maxLength) {
    validators = [...validators, maxFieldLength(maxLength)];
  }

  return (
    <FieldBlock
      row={row}
      style={style}
      label={showLabel ? `${required ? '*' : ''}${label}` : null}
      flex={flex}
    >
      <FinalFormField
        validate={composeValidators(...validators)}
        component={component}
        label={label}
        props={{ type }}
        keyboardType={number ? 'numeric' : 'default'}
        {...props}
      />
    </FieldBlock>
  );
};

export default Field;
