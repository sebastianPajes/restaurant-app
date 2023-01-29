import {
  Box,
  useTheme,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useNavigate } from 'react-router-dom';


function SidebarFooter() {
  const { t } = useTranslation();
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
      }}>Página principal</Button>
    </Box>
  );
}

export default SidebarFooter;
