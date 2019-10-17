import React, { useState } from 'react';
import { Thumbnail as NBThumbnail } from 'native-base';

const Thumbnail = props => {
  const [] = useState(0);

  return <NBThumbnail {...props} />;
};

export default Thumbnail;
