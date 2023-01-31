// import Authenticated from 'src/components/Authenticated';
// import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/';

import managementRoutes from './management';

const router = [
  {
    path: '',
    element: (
      // <Authenticated>
        <SidebarLayout />
      // </Authenticated>
    ),
    children: [
      {
        path: 'gestion',
        children: managementRoutes
      }
    ]
  }
];

export default router;
