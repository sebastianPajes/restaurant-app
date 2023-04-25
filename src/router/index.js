import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/';

import insideItems from '../layouts/Sidebar/SidebarMenu/insideItems';
import outsideItems from '../layouts/Sidebar/SidebarMenu/outsideItems';


import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Waitlist from 'src/content/management/Waitlist';
import Reservations from 'src/content/management/Reservations';
import AddReservation from 'src/content/management/Reservations/Add';
import EditReservation from 'src/content/management/Reservations/Edit';
import Add from 'src/content/management/Waitlist/Add';
import Edit from 'src/content/management/Waitlist/Edit';
import EmployeeList from 'src/content/management/Employees/EmployeeList';
import LocationDetail from 'src/content/management/Location/LocationDetail';
import TableList from 'src/content/management/Tables/TableList';

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
      </Authenticated>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="waitlist" replace />
      },
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
        children:[
          {
            path:'',
            element:<Waitlist/>,
          },
          {
            path:'registro',
            element:<Add/>
          },
          {
            path:'actualizacion',
            element:<Edit/>
          }
        ]
      },
      {
        path:'reservas',
        children:[
          {
            path:'',
            element:<Reservations/>,
          },
          {
            path:'registro',
            element:<AddReservation/>
          },
          {
            path:'actualizacion',
            element:<EditReservation/>
          }
        ]
      },
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
        path: '',
        element: <Navigate to="informacion-general" replace />
      },
      {
        path: 'waitlist',
        element: <Navigate to="/waitlist" replace />
      },
      {
        path: 'empleados',
        element: <EmployeeList />
      },
      {
        path: 'informacion-general',
        element: <LocationDetail />
      },
      {
        path: 'mesas',
        element: <TableList />
      }
    ]
  }
];

export default router;
