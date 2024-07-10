// /**
//  * Copyright @ by Code Lyoko Team. All rights reserved.
//  * Author: Thành Nam Nguyễn
//  */

import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const extTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        info: {
          main: '#cce5ff',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#8b8bc6',
        },
        background: {
          paper: '#1d2144',
        },
      },
    },
  },
});

export default extTheme;
