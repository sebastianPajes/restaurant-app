import { useState, forwardRef, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';

import {
  Box,
  CardHeader,
  Card,
  Slide,
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
  Dialog,
  styled,
  Zoom,
  useTheme
} from '@mui/material';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useRefMounted from 'src/hooks/useRefMounted';

import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';



import Scrollbar from 'src/components/Scrollbar';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
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

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
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


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


const CardWrapper = styled(Card)(
  ({ theme }) => `
      background: ${alpha(theme.colors.alpha.black[10], 0.10)};
  `
);

function RightSide({selectedParty}) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const isMountedRef = useRefMounted();


  const [currentTab, setCurrentTab] = useState('details');
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmSit, setOpenConfirmSit] = useState(false);
  const [tables, setTables] = useState([]);


  const getTables = useCallback(async () => {
    try {
      const {idToken} = await Auth.currentSession();
      const response = await axios.get(`${process.env.REACT_APP_API}api/tables`,
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
      });
      if (isMountedRef.current) {
        setTables(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);;

  
  useEffect(() => {
    getTables();
  }, [getTables]);

  const tabs = [
    { value: 'details', label: 'Detalles' },
    { value: 'notifications', label: 'Notificaciones' },
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const handleEdit = () =>{
    navigate(`actualizacion`, { state: {selectedParty}});
  }

  const handleSit = async() =>{
    const {idToken} = await Auth.currentSession();
    
    const response = await axios.post(`${process.env.REACT_APP_API}api/parties/booking`,
      {...selectedParty, id: selectedParty.sk.split('#')[2], seated:true},
    {
      headers: {
        Authorization : `Bearer ${idToken.jwtToken}`
        }
    });
    window.location.reload(false);//backend should list just not seated
  }

  const handleConfirmSit = () => {
    setOpenConfirmSit(true);
  };

  const closeConfirmSit = () => {
    setOpenConfirmSit(false);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async() => {
    setOpenConfirmDelete(false);
    const {idToken} = await Auth.currentSession();
    const response = await axios.delete(`${process.env.REACT_APP_API}api/parties/${selectedParty.sk.split('#')[1].split('-')[0]}/${selectedParty.sk.split('#')[2]}`,
    {
      headers: {
        Authorization : `Bearer ${idToken.jwtToken}`
        }
      });
    enqueueSnackbar("Se ha borrado exitosamente la party", {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    window.location.reload(false);
  };

  const actualDate = new Date(selectedParty.dateTime);
  return (
    <>
    <Card>
      <Grid container spacing={0}>
              <Grid item xs={6} sm={2}>
                  <CardWrapper
                        elevation={0}
                              sx={{
                                textAlign: 'center',
                                pt: 3,
                                pb: 2.5,
                              }}
                            >
                              <Typography
                                variant="h4"
                                sx={{
                                  pt: 1
                                }}
                              >
                                {selectedParty.waitingTime || actualDate.getDate()+ '/' + parseInt(actualDate.getMonth()+1) + '/' + actualDate.getFullYear()}
                              </Typography>
                              { selectedParty.dateTime && 

                                                <Typography
                                                      variant="h6"
                                                      sx={{
                                                        pt: 1
                                                      }}
                                                      >
                                                  { actualDate.getHours()+ ':' + actualDate.getMinutes()}
                                        </Typography>
                              }
                     
                    </CardWrapper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CardHeader
                    sx={{
                      p: 3
                    }}
                    disableTypography
                    title={
                      <>
                        <Typography variant="h4"> {selectedParty.customer.name} </Typography>
                      </>
                    }
                  />
                </Grid>
          </Grid>
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
                  <PhoneIphoneIcon fontSize="large" />
                {selectedParty.customer.phone}
              </TimelineItem>
              <TimelineItem
                sx={{
                  p: 0
                }}
              >
                <DescriptionIcon fontSize="large"/>
                {selectedParty.notes}
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
                  {selectedParty.customer.partySize}
                </Typography>
              </CardWrapper>
            </Grid>
            {selectedParty.tableCodes?.map((tableCode) => (
              <Grid item xs={12} sm={4}>
                <CardWrapper
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 2.5
                  }}
                >
                  <TableRestaurantTwoToneIcon fontSize="large" />
                  <Typography
                    variant="h4"
                    sx={{
                      pt: 1
                    }}
                  >
                    {tables.find( t=> t.sk.split('#')[1] === tableCode)?.size}
                  </Typography>
                </CardWrapper>
              </Grid>
              ))}
           
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
          <Button variant="contained"
          onClick={handleConfirmDelete}
          >
            Eliminar
          </Button>
          <Button variant="contained"
            onClick={handleEdit}
          >
            Editar
          </Button>
          <Button variant="contained" >
            Mesa
          </Button>
          <Button variant="contained" onClick={handleConfirmSit}>
            Sentar
          </Button>
      </Box>
    </Card>
          <DialogWrapper
          open={openConfirmDelete}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Transition}
          keepMounted
          onClose={closeConfirmDelete}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={5}
          >
            <AvatarError>
              <CloseIcon />
            </AvatarError>
  
            <Typography
              align="center"
              sx={{
                pt: 4,
                px: 6
              }}
              variant="h3"
            >
              Realmente quieres borrar esta party?
            </Typography>
  
            <Box>
              <Button
                variant="text"
                size="large"
                sx={{
                  mx: 1
                }}
                onClick={closeConfirmDelete}
              >
                Cancelar
              </Button>
              <ButtonError
                onClick={handleDeleteCompleted}
                size="large"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="contained"
              >
                Eliminar
              </ButtonError>
            </Box>
          </Box>
        </DialogWrapper>

        <DialogWrapper
          open={openConfirmSit}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Transition}
          keepMounted
          onClose={closeConfirmSit}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={5}
          >  
            <Typography
              align="center"
              sx={{
                pt: 4,
                px: 6
              }}
              variant="h3"
            >
              Realmente quieres sentar esta party?
            </Typography>
  
            <Box>
              <Button
                variant="text"
                size="large"
                sx={{
                  mx: 1
                }}
                onClick={closeConfirmSit}
              >
                Cancelar
              </Button>
              <ButtonError
                onClick={handleSit}
                size="large"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="contained"
              >
                Sentar
              </ButtonError>
            </Box>
          </Box>
        </DialogWrapper>
        </>
  );
}

export default RightSide;
