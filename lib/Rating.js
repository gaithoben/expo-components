import React from 'react';
import { Rating as RnRating, AirbnbRating } from 'react-native-ratings';
import Block from './Block';

const Rating = ({
  color,
  showRating,
  readOnly,
  value,
  input,
  onChange,
  style,
  ...props
}) => {
  const ratingProps = {
    ...(color && { selectedColor: color })
  };
  const val = input.value || value;

  const finishRating = value => {
    onChange(value);
    input.onChange(value);
  };

  return (
    <Block flex={false}>
      <AirbnbRating
        type="custom"
        showRating={showRating}
        isDisabled={readOnly}
        onFinishRating={finishRating}
        starContainerStyle={{
          paddingVertical: 0,
          ...style
        }}
        defaultRating={val || 4}
        {...ratingProps}
        {...props}
      />
    </Block>
  );
};

Rating.defaultProps = {
  size: 12,
  showRating: false,
  readOnly: false,
  onChange: () => {},
  input: {
    value: null,
    onChange: () => {}
  }
};

export default Rating;
