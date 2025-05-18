import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fba919', // NoBroker's accent button color
      light: '#ffc046',
      dark: '#c47a00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#212121', // NoBroker's text color
      light: '#484848',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f5f6fa', // NoBroker's background color
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // NoBroker's text color
      secondary: '#666666',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA000',
    },
    success: {
      main: '#388E3C',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: 'Poppins, Inter, sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
      color: '#212121',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
      color: '#212121',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
      color: '#212121',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#212121',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#212121',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#212121',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#212121',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#666666',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: '#fba919',
          '&:hover': {
            background: '#ffc046',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          border: '1px solid #eeeeee',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fba919',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fba919',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(251, 169, 25, 0.04)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#212121',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          backgroundColor: '#f5f6fa',
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#fba919',
            color: '#ffffff',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme; 