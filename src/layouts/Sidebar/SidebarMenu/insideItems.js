import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const menuItems = [
  {
    items: [
      {
        name: 'Información General',
        icon: BackupTableTwoToneIcon,
        link: 'informacion-general',
      },
      {
        name: 'Empleados',
        icon: PeopleOutlineTwoToneIcon,
        link: 'empleados',
      },
      {
        name: 'Mesas',
        icon: TableRestaurantTwoToneIcon,
        link: 'mesas',
      },
      {
        name: 'Back',
        icon: ArrowBackIcon,
        link: 'waitlist',
      }
    ]
  }
];

export default menuItems;
