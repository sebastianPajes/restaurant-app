import { Box, alpha, Button, lighten, Typography, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Auth } from 'aws-amplify';

import Sidebar from './Sidebar';

const SidebarLayout = ({ items }) => {
  const theme = useTheme();

  const handleLogout = () => {
    Auth.signOut()
      .then(() => {
        console.log('User signed out')
        window.location.href = '/';
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',

        '.MuiPageTitle-wrapper': {
          background:
            theme.palette.mode === 'dark'
              ? theme.colors.alpha.trueWhite[5]
              : theme.colors.alpha.white[50],
          marginBottom: `${theme.spacing(4)}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 1px 0 ${alpha(lighten(theme.colors.primary.main, 0.7), 0.15)}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
              : `0px 2px 4px -3px ${alpha(theme.colors.alpha.black[100], 0.1)}, 0px 5px 12px -4px ${alpha(
                  theme.colors.alpha.black[100],
                  0.05
                )}`,
        },
      }}
    >
      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
        }}
      >
        <Typography variant="h6" component="div">
          My App
        </Typography>
        <Button variant="contained" startIcon={<ExitToAppIcon />} onClick={handleLogout}>
          Log out
        </Button>
      </Box>
      <Sidebar items={items} />
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          display: 'block',
          flex: 1,
          pt: `${theme.header.height}`,
          [theme.breakpoints.up('lg')]: {
            ml: `${theme.sidebar.width}`,
          },
        }}
      >
        <Box display="block">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarLayout;
