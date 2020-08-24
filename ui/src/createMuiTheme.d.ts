import * as createPalette from '@material-ui/core/styles/createMuiTheme';
import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    dashboard: {
      defaultColor: string;
      errorColor: string;
    };
  }

  interface ThemeOptions {
    dashboard: {
      defaultColor: string;
      errorColor: string;
    };
  }
}