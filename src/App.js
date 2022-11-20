import './App.css';

import { Amplify, I18n } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


import awsconfig from './aws-config';

I18n.setLanguage('es');
const dict = {
  es: {
    'Sign in': 'Iniciar Sesión',
    'Forgot your password?': 'Olvido su contraseña?',
    'Enter your Email': 'Ingrese su email',
    'Enter your Password': 'Ingrese su password'
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
    <Authenticator 
    // formFields={formFields}
    loginMechanisms={['email']}
    hideSignUp={true} >
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
