import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import QrCodeTwoToneIcon from '@mui/icons-material/QrCodeTwoTone';
const menuItems = [
  {
    items: [
      {
        name: 'Información General',
        icon: BackupTableTwoToneIcon,
        link: 'gestion/informacion-general',
      },
      {
        name: 'Empleados',
        icon: PeopleOutlineTwoToneIcon,
        link: 'gestion/empleados',
      },
      {
        name: 'Mesas',
        icon: TableRestaurantTwoToneIcon,
        link: 'gestion/mesas',
      },
      {
        name: 'QRs',
        icon: QrCodeTwoToneIcon,
        link: 'gestion/qrs',
      }
    ]
  }
];

export default menuItems;
