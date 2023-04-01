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
        name: 'QRs',
        icon: QrCodeTwoToneIcon,
        link: 'qrs',
      }
    ]
  }
];

export default menuItems;
