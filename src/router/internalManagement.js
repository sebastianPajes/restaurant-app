import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Management

const Users = Loader(lazy(() => import('src/content/management/Users')));

const managementRoutes = [
  {
    path: '',
    element: <Navigate to="empleados" replace />
  },
  {
    path: 'empleados',
    element: <Users />
  }
];

export default managementRoutes;
