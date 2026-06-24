import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5c6bc0',
      light: '#8e99f3',
      dark: '#26418f',
    },
    secondary: {
      main: '#ff7043',
      light: '#ffa270',
      dark: '#c63f17',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
})

export default theme
