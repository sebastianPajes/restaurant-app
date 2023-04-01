import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
const menuItems = [
  {
    items: [
      {
        name: 'Usuarios activos',
        icon: PeopleOutlineOutlinedIcon,
        link: 'usuarios-activos',
      },
      {
        name: 'Lista de espera',
        icon: HourglassEmptyOutlinedIcon,
        link: 'waitlist',
      },
      {
        name: 'Reservas',
        icon: CalendarTodayIcon,
        link: 'reservas',
      },
      {
        name: 'Productos',
        icon: InventoryIcon,
        link: 'productos',
      },
      {
        name: 'Empleados',
        icon: PeopleOutlineOutlinedIcon,
        link: 'empleados',
      },
      {
        name: 'Categorías',
        icon: CategoryOutlinedIcon,
        link: 'categorias',
      },
      {
        name: 'Historial',
        icon: HistoryOutlinedIcon,
        link: 'historial',
      },
      {
        name: 'Reportes',
        icon: AssessmentOutlinedIcon,
        link: 'reportes',
      }
    ]
  }
];

export default menuItems;
