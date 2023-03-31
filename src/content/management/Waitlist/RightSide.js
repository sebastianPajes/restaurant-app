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
  Badge,
  Button,
  styled,
  useTheme
} from '@mui/material';
import Text from 'src/components/Text';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';

import Scrollbar from 'src/components/Scrollbar';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
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

function RighSide() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [currentTab, setCurrentTab] = useState('timeline');

  const tabs = [
    { value: 'timeline', label: t('Timeline') },
    { value: 'tasks', label: t('Tasks') },
    { value: 'reports', label: t('Reports') }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const chart1Options = {
    chart: {
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      stacked: true
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '65%'
      }
    },
    stroke: {
      show: false,
      width: 0,
      colors: ['transparent']
    },
    theme: {
      mode: theme.palette.mode
    },
    colors: [theme.colors.secondary.dark, theme.colors.secondary.light],
    fill: {
      opacity: 1
    },
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
      'Last week',
      'Last month',
      'Last year',
      'Last quarter'
    ],
    legend: {
      show: false
    }
  };
  const chart1Data = [
    {
      name: 'Net Profit',
      data: [2.3, 3.1, 4.0, 3.8, 5.1, 3.6, 4.0, 3.8, 5.1, 3.6, 3.2]
    },
    {
      name: 'Net Loss',
      data: [2.1, 2.1, 3.0, 2.8, 4.0, 3.8, 5.1, 3.6, 4.1, 2.6, 1.2]
    }
  ];

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
      {currentTab === 'detalles' && (
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
            IconButton
            IconButton
            IconButton
          </Scrollbar>
        </Box>
      )}
      {currentTab === 'notificationes' && (
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
                  {t('Incoming messages')}
                </Typography>
                <Typography variant="subtitle2">
                  {t("You don't have any pending actions to look at.")}
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
          <Button variant="contained" endIcon={<ArrowForwardTwoToneIcon />}>
            Editar
          </Button>
          <Button variant="contained" endIcon={<ArrowForwardTwoToneIcon />}>
            Mesa
          </Button>
          <Button variant="contained" endIcon={<ArrowForwardTwoToneIcon />}>
            Sentar
          </Button>
      </Box>
    </Card>
  );
}

export default RighSide;
