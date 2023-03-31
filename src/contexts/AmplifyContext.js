import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {Amplify, Auth } from 'aws-amplify';
import amplifyConfig from '../aws-config';

Amplify.configure(amplifyConfig);

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state) => ({ ...state }),
  VERIFY_CODE: (state) => ({ ...state }),
  RESEND_CODE: (state) => ({ ...state }),
  PASSWORD_RECOVERY: (state) => ({ ...state }),
  PASSWORD_RESET: (state) => ({ ...state })
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'Amplify',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       const user = await Auth.currentAuthenticatedUser();
  //       console.log("initialize:",user);
  //       dispatch({
  //         type: 'INITIALIZE',
  //         payload: {
  //           isAuthenticated: true,
  //           user: {
  //             id: user.sub,
  //             email: user.email,
  //             name: user.name,
  //             role: user.role,
  //             location: user.location,
  //             username: user.username,
  //           }
  //         }
  //       });
  //     } catch (error) {
  //       dispatch({
  //         type: 'INITIALIZE',
  //         payload: {
  //           isAuthenticated: false,
  //           user: null
  //         }
  //       });
  //     }
  //   };

  //   initialize();
  // }, []);

  const login = async (user) => {
    console.log("login:",user);
    console.log("token: ",`Bearer ${user.signInUserSession.idToken.jwtToken}`);
    
    const response = await axios.get(`https://gfze94t8g3.execute-api.us-east-1.amazonaws.com/prod/api/employees/${user.username}`,
    {
      headers: {
        Authorization : `Bearer ${user.signInUserSession.idToken.jwtToken}`
        }
      }
    );
    const {employeeRes} = response.data;
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          id: user.attributes.sub,
          email: user.attributes.email,
          firstName: employeeRes.firstName,
          lastName: employeeRes.lastName
        }
      }
    });
    localStorage.setItem('firstName',employeeRes.firstName);
    localStorage.setItem('lastName',employeeRes.lastName);
  };

  const logout = async () => {
    await Auth.signOut();
    dispatch({
      type: 'LOGOUT'
    });
  };


  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Amplify',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
