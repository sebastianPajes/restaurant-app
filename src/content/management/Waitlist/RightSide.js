import { useState } from 'react';
import {
  Box,
  CardHeader,
  Card,
  Typography,
  alpha,
  Tooltip,
  CardActionArea,
  CardMedia,
  ButtonGroup,
  Avatar,
  AvatarGroup,
  Tab,
  Tabs,
  Grid,
  Badge,
  Button,
  styled,
  useTheme
} from '@mui/material';
import Text from 'src/components/Text';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';


import Scrollbar from 'src/components/Scrollbar';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

const BoxComposed = styled(Box)(
  () => `
    position: relative;
  `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
        background-color: ${theme.colors.success.lighter};
        color: ${theme.colors.success.main};
        width: ${theme.spacing(14)};
        height: ${theme.spacing(14)};
        margin-right: ${theme.spacing(1)};
  `
);

const BoxComposedContent = styled(Box)(
  ({ theme }) => `
    position: relative;
    z-index: 7;

    .MuiTypography-root {
        color: ${theme.palette.primary.contrastText};

        & + .MuiTypography-root {
            color: ${alpha(theme.palette.primary.contrastText, 0.7)};
        }
    }
    
  `
);

const BoxComposedImage = styled(Box)(
  () => `
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    filter: grayscale(80%);
    background-size: cover;
    height: 100%;
    width: 100%;
    border-radius: inherit;
  `
);

const BoxComposedBg = styled(Box)(
  () => `
    position: absolute;
    left: 0;
    top: 0;
    z-index: 6;
    height: 100%;
    width: 100%;
    border-radius: inherit;
  `
);

const TabsWrapper = styled(Tabs)(
  () => `
        overflow: visible !important;

        .MuiTabs-scroller {
            overflow: visible !important;
        }
    `
);
const CardWrapper = styled(Card)(
  ({ theme }) => `
      background: ${alpha(theme.colors.alpha.black[10], 0.05)};
  `
);

function RighSide() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [currentTab, setCurrentTab] = useState('details');

  const tabs = [
    { value: 'details', label: 'Detalles' },
    { value: 'notifications', label: 'Notificaciones' },
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <Card>
      <CardHeader
        sx={{
          p: 3
        }}
        disableTypography
        title={
          <>
            <Typography variant="h4">Party name</Typography>
          </>
        }
      />
      <Box p={2}>
        <TabsWrapper
          centered
          onChange={handleTabsChange}
          value={currentTab}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </TabsWrapper>
      </Box>
      {currentTab === 'details' && (
        <Box
          sx={{
            height: 300
          }}
        >
          <Scrollbar>
            <Timeline
              sx={{
                m: 0
              }}
            >
              <TimelineItem
                sx={{
                  p: 0
                }}
              >
                numeroTelefono
              </TimelineItem>
              <TimelineItem
                sx={{
                  p: 0
                }}
              >
                Nota
              </TimelineItem>
            </Timeline>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4}>
              <CardWrapper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  pt: 3,
                  pb: 2.5
                }}
              >
                <PersonTwoToneIcon fontSize="large" />
                <Typography
                  variant="h4"
                  sx={{
                    pt: 1
                  }}
                >
                  4
                </Typography>
              </CardWrapper>
            </Grid>
          </Grid>
          </Scrollbar>
        </Box>
      )}
      {currentTab === 'notifications' && (
        <>
          <Box
            sx={{
              height: 300
            }}
          >
            <Scrollbar>
              <Box
                display="flex"
                py={4}
                flexDirection="column"
                alignItems="center"
                sx={{
                  textAlign: 'center'
                }}
              >
                <AvatarSuccess
                  sx={{
                    mb: 3
                  }}
                >
                  <CheckTwoToneIcon fontSize="large" />
                </AvatarSuccess>
                <Typography variant="h3" gutterBottom>
                  Pendientes
                </Typography>
                <Typography variant="subtitle2">
                  No existen notificaciones pendientes.
                </Typography>
              </Box>
            </Scrollbar>
          </Box>
        </>
      )}
      <Box
        p={3}
        sx={{
          textAlign: 'center'
        }}
      >
          <Button variant="contained">
            Editar
          </Button>
          <Button variant="contained" >
            Mesa
          </Button>
          <Button variant="contained" >
            Sentar
          </Button>
      </Box>
    </Card>
  );
}

export default RighSide;
