import {
  Box,
  useTheme,
  Button
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useNavigate } from 'react-router-dom';


function SidebarFooter() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
  };

  return (
    <Box
      sx={{
        height: 60
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Button startIcon={<HomeIcon />} sx={{            
        color: `${theme.colors.alpha.trueWhite[70]}`
         }}
         component={RouterLink}
         to={`/configuracion`}
      >Configuración</Button>
    </Box>
  );
}

export default SidebarFooter;
