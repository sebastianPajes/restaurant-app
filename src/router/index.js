import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/';

import internalManagementRoutes from './internalManagement';
import insideItems from '../layouts/Sidebar/SidebarMenu/insideItems';
import outsideItems from '../layouts/Sidebar/SidebarMenu/outsideItems';


import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Waitlist from 'src/content/management/Waitlist';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Management

const Categories = Loader(lazy(() => import('src/content/management/Categories')));
const Products = Loader(lazy(() => import('src/content/management/Products')));
const Users = Loader(lazy(() => import('src/content/management/Users')));


const router = [
  {
    path: '',
    element: (
      <Authenticated>
        <SidebarLayout items={outsideItems}/>
        <Navigate to="waitlist" replace />
      </Authenticated>
    ),
    children: [
      {
        path: 'categorias',
        element: <Categories/>
      },
      {
        path: 'productos',
        element: <Products/>
      },
      {
        path:'waitlist',
        element:<Waitlist/>
      }
    ]
  },
  {
    path: 'configuracion',
    element: (
      <Authenticated>
        <SidebarLayout items={insideItems}/>
      </Authenticated>
    ),
    children: [
      {
        path: 'empleados',
        element: <Users />
      }
    ]
  }
];

export default router;
