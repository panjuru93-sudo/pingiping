import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2d6a4f',
      light: '#52b788',
      dark: '#1b4332',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#40916c',
      light: '#74c69d',
      dark: '#1b4332',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0fdf4',
      paper: '#ffffff',
    },
    success: {
      main: '#52b788',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
})

export default theme
