import {
  createUnifiedTheme,
  palettes,
  genPageTheme,
  shapes,
} from '@backstage/theme';

const unifiedPageHeaderTemplate = () => ({
  colors: ['#005A9E', '#00A4EF'],
  shape: shapes.wave2,
});

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
      background: '#FFFFFF',
      indicator: '#0078D4',
      color: '#666666',
      selectedColor: '#00A4EF',
      navItem: {
        hoverBackground: '#F5F5F5',
      },
    },
  },
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme(unifiedPageHeaderTemplate()),
    documentation: genPageTheme(unifiedPageHeaderTemplate()),
    tool: genPageTheme(unifiedPageHeaderTemplate()),
    service: genPageTheme(unifiedPageHeaderTemplate()),
    website: genPageTheme(unifiedPageHeaderTemplate()),
    library: genPageTheme(unifiedPageHeaderTemplate()),
    other: genPageTheme(unifiedPageHeaderTemplate()),
    app: genPageTheme(unifiedPageHeaderTemplate()),
    apis: genPageTheme(unifiedPageHeaderTemplate()),
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
      background: '#FFFFFF',
      indicator: '#0078D4',
      color: '#666666',
      selectedColor: '#00A4EF',
      navItem: {
        hoverBackground: '#F5F5F5',
      },
    },
  },
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme(unifiedPageHeaderTemplate()),
    documentation: genPageTheme(unifiedPageHeaderTemplate()),
    tool: genPageTheme(unifiedPageHeaderTemplate()),
    service: genPageTheme(unifiedPageHeaderTemplate()),
    website: genPageTheme(unifiedPageHeaderTemplate()),
    library: genPageTheme(unifiedPageHeaderTemplate()),
    other: genPageTheme(unifiedPageHeaderTemplate()),
    app: genPageTheme(unifiedPageHeaderTemplate()),
    apis: genPageTheme(unifiedPageHeaderTemplate()),
  },
});
