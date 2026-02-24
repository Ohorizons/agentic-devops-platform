import {
  createUnifiedTheme,
  palettes,
  genPageTheme,
  shapes,
} from '@backstage/theme';

export const microsoftLightTheme = createUnifiedTheme({
  palette: {
    ...palettes.light,
    primary: {
      main: '#0078D4',
      light: '#50E6FF',
      dark: '#005A9E',
    },
    secondary: {
      main: '#00B7C3',
    },
    navigation: {
      background: '#1B1B1F',
      indicator: '#0078D4',
      color: '#FFFFFF',
      selectedColor: '#50E6FF',
      navItem: {
        hoverBackground: '#2D2D30',
      },
    },
  },
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme({
      colors: ['#0078D4', '#005A9E'],
      shape: shapes.wave,
    }),
    documentation: genPageTheme({
      colors: ['#00B7C3', '#006C6E'],
      shape: shapes.wave2,
    }),
    tool: genPageTheme({
      colors: ['#0078D4', '#00B7C3'],
      shape: shapes.round,
    }),
    service: genPageTheme({
      colors: ['#005A9E', '#0078D4'],
      shape: shapes.wave,
    }),
    website: genPageTheme({
      colors: ['#00B7C3', '#0078D4'],
      shape: shapes.wave,
    }),
    library: genPageTheme({
      colors: ['#005A9E', '#0078D4'],
      shape: shapes.wave,
    }),
    other: genPageTheme({
      colors: ['#0078D4', '#005A9E'],
      shape: shapes.wave,
    }),
    app: genPageTheme({
      colors: ['#0078D4', '#00B7C3'],
      shape: shapes.wave,
    }),
    apis: genPageTheme({
      colors: ['#005A9E', '#00B7C3'],
      shape: shapes.wave2,
    }),
  },
});

export const microsoftDarkTheme = createUnifiedTheme({
  palette: {
    ...palettes.dark,
    primary: {
      main: '#50E6FF',
      light: '#7CF3FF',
      dark: '#0078D4',
    },
    secondary: {
      main: '#00B7C3',
    },
    navigation: {
      background: '#1B1B1F',
      indicator: '#50E6FF',
      color: '#FFFFFF',
      selectedColor: '#50E6FF',
      navItem: {
        hoverBackground: '#2D2D30',
      },
    },
  },
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme({
      colors: ['#0078D4', '#005A9E'],
      shape: shapes.wave,
    }),
    documentation: genPageTheme({
      colors: ['#00B7C3', '#006C6E'],
      shape: shapes.wave2,
    }),
    tool: genPageTheme({
      colors: ['#0078D4', '#00B7C3'],
      shape: shapes.round,
    }),
    service: genPageTheme({
      colors: ['#005A9E', '#0078D4'],
      shape: shapes.wave,
    }),
    website: genPageTheme({
      colors: ['#00B7C3', '#0078D4'],
      shape: shapes.wave,
    }),
    library: genPageTheme({
      colors: ['#005A9E', '#0078D4'],
      shape: shapes.wave,
    }),
    other: genPageTheme({
      colors: ['#0078D4', '#005A9E'],
      shape: shapes.wave,
    }),
    app: genPageTheme({
      colors: ['#0078D4', '#00B7C3'],
      shape: shapes.wave,
    }),
    apis: genPageTheme({
      colors: ['#005A9E', '#00B7C3'],
      shape: shapes.wave2,
    }),
  },
});
