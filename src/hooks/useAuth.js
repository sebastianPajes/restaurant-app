import { useContext } from 'react';
import AmplifyContext from 'src/contexts/AmplifyContext';

const useAuth = () => useContext(AmplifyContext);

export default useAuth;
