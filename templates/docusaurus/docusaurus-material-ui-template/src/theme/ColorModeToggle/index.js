// /**
//  * Copyright @ by Code Lyoko Team. All rights reserved.
//  * Author: Thành Nam Nguyễn
//  */

import React, { useEffect } from 'react';
import ColorModeToggle from '@theme-original/ColorModeToggle';
import { useColorScheme } from '@mui/material/styles';

export default function ColorModeToggleWrapper(props) {
  const { setMode } = useColorScheme();
  const { value } = props;

  useEffect(() => {
    setMode(value);
  }, [value]);

  return (
    <>
      <ColorModeToggle {...props} />
    </>
  );
}
