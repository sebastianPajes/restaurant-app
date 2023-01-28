import './App.css';

import { CssBaseline } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { Amplify, I18n } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { SnackbarProvider } from 'notistack';
import '@aws-amplify/ui-react/styles.css';

import awsconfig from './aws-config';
import ThemeProvider from './theme/ThemeProvider';
import SidebarLayout from './layouts';


I18n.setLanguage('es');
const dict = {
  es: {
    'Sign in': 'Iniciar Sesión',
    'Forgot your password?': 'Olvidó su contraseña?',
    'Enter your Email': 'Ingrese su email',
    'Enter your Password': 'Ingrese su contraseña',
    'Reset Password': 'Restablecer Contraseña',
    'Enter your email': 'Ingrese su email',
    'Send code': 'Enviar código',
    'Back to Sign In': 'Regresar a Iniciar Sesión',
    'Signing in': 'Iniciando...',
    'Incorrect username or password.': 'Email o contraseña incorrecta.',
    'Sending': 'Enviando',
    'Submitting': 'Enviando',
    'Attempt limit exceeded, please try after some time.': 'Se excedió el límite de intentos, intente después de un tiempo.',
    'Code': 'Código',
    'Code *': 'Código *',
    'New Password': 'Nueva Contraseña',
    'Confirm Password': 'Confirmar Contraseña',
    'Submit': 'Enviar',
    'Resend Code': 'Reenviar Código'
  }
};

I18n.putVocabularies(dict);

Amplify.configure(awsconfig);


// export declare type FormFieldComponents = 'signIn' | 'signUp' | 'forceNewPassword' | 'confirmResetPassword' | 'confirmSignIn' | 'confirmSignUp' | 'confirmVerifyUser' | 'resetPassword' | 'setupTOTP';

// const formFields = {
//   signIn: {
//     username: {
//       placeholder: 'Ingrese su email',
//     },
//   },
// }

export default function App() {
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

        {/* <Authenticator 
        // formFields={formFields}
        variation='modal'
        loginMechanisms={['email']}
        hideSignUp={true} >
          {({ signOut, user }) => (
            <main>
              <h1>Codigo de usuario: {user.username}</h1>
              <button onClick={signOut}>Cerrar Sesión</button>
            </main>
          )}
        </Authenticator> */}
                <SidebarLayout />
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
