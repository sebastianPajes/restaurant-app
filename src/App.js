import { CssBaseline } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useRoutes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import '@aws-amplify/ui-react/styles.css';


import awsconfig from './aws-config';
import ThemeProvider from './theme/ThemeProvider';
import router from 'src/router';


export default function App() {
  const content = useRoutes(router);
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
        <CssBaseline />
        {content}
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
