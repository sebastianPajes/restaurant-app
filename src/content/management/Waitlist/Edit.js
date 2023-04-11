import { useState, useEffect, useCallback} from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import {
  styled,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Typography,
  Divider,
  TextField,
  Zoom,
  CircularProgress,
  Autocomplete,
  IconButton,
  ListItem,
  ListItemText,
  List,
  Button,
  useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import DatePicker from '@mui/lab/DatePicker';
import { useSnackbar } from 'notistack';
import { TimePicker } from '@mui/x-date-pickers';

import InputAdornment from '@mui/material/InputAdornment';

import useRefMounted from 'src/hooks/useRefMounted';
import { useLocation } from 'react-router-dom';

function Edit(){
    const theme = useTheme();
    const location = useLocation();
    const selectedParty = location.state.selectedParty;
    console.log(selectedParty);
    // console.log(new Date(selectedParty.dateTime))
    const isMountedRef = useRefMounted();
    const { enqueueSnackbar } = useSnackbar();
    const [partyType, setPartyType] = useState('waitlist');
    const [tableType, setTableType] = useState('');
    const [reservationDate, setReservationDate] = useState(new Date(selectedParty.dateTime?.split('T')[0]));
    const [reservationHour, setReservationHour] = useState(new Date(selectedParty.dateTime));
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

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
          const foundTable = response.data.find( t=> t.sk.split('#')[1] === selectedParty.tableCodes[0]);
          console.log(foundTable);
          setSelectedTable(foundTable);
          setTables(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    }, [isMountedRef]);;

    
    useEffect(() => {
      getTables();
    }, [getTables]);
    

        
    const handleCreatePartySuccess = ()=>{
      enqueueSnackbar('La party fue actualizada exitosamente', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    };
    
    return (
      <Formik
      initialValues={{
        name: selectedParty.customer.name,
        phone: selectedParty.customer.phone,
        partySize:selectedParty.customer.partySize,
        tableCodes: selectedParty.tableCodes,
        // tags:[],
        notes: selectedParty.notes,
        duration: selectedParty.duration,
        date: selectedParty.duration,
        time:  selectedParty.duration,
        waitingTime: selectedParty.waitingTime,
        dateTime: selectedParty.dateTime,
        submit: null
      }}
      onSubmit={async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
            const {idToken} = await Auth.currentSession();
            let existingProduct = {
              id: selectedParty.sk.split('#')[2],
              source:"manual",
              customer:{
                name: _values.name,
                phone: _values.phone,
                partySize: parseInt(_values.partySize),
              } ,
              tableCodes: [selectedTable?.sk.split('#')[1]],
              tags: [tableType],//TODO: make sure
              notes: _values.notes,
            };
            if(partyType === "booking"){  //only for booking
              existingProduct.duration = parseInt(_values.duration);
              const reservationDateTime = new Date(reservationDate.toISOString().split('T')[0] + 'T' + reservationHour.toISOString().split('T')[1]);
              // console.log(test);
              // console.log(test.toISOString());
              existingProduct.dateTime = reservationDateTime ;
            }else{//only for waitlist
              existingProduct.waitingTime =  _values.waitingTime; 
          }
          const response = await axios.post(`${process.env.REACT_APP_API}api/parties/${partyType}`,
          existingProduct,
          {
            headers: {
              Authorization : `Bearer ${idToken.jwtToken}`
            }
          }
          );
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          handleCreatePartySuccess();
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
      >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <DialogContent
            dividers
            sx={{
              p: 3
            }}
            >
            <Grid container spacing={1}>
            <Grid  item
                    xs={12}
                    sm={8}
                    md={9} >
              <Button variant="outlined" sx={{width:'50%'}}
                onClick ={()=> setPartyType('waitlist')}
                >  
              Walk-in
              </Button>
              <Button variant="outlined" sx={{width:'50%'}}
                onClick ={()=> setPartyType('booking')}
                >
                Reserva
              </Button>
            </Grid>
            <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleIcon />
                        </InputAdornment>
                      ),
                    }}
                      error={Boolean(touched.partySize && errors.partySize)}
                      fullWidth
                      helperText={touched.partySize && errors.partySize}
                      label="Números de personas"
                      name="partySize"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.partySize}
                      variant="outlined"
                    />
              </Grid>
              <Grid
                sx={{
                  mb: `${theme.spacing(3)}`
                }}
                item
                xs={12}
                sm={8}
                md={9}
              >
                    <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                      error={Boolean(
                        touched.name && errors.name
                      )}
                      fullWidth
                      helperText={touched.name && errors.name}
                      label="Nombre"
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      variant="outlined"
                    />
                </Grid>   
                <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIphoneIcon />
                            </InputAdornment>
                          ),
                        }}
                      error={Boolean(touched.phone && errors.phone)}
                      fullWidth
                      helperText={touched.phone && errors.phone}
                      label="Número de celular"
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      variant="outlined"
                    />
                </Grid>
                <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon />
                            </InputAdornment>
                          ),
                        }}
                      error={Boolean(touched.notes && errors.notes)}
                      fullWidth
                      helperText={touched.notes && errors.notes}
                      label="Notas"
                      name="notes"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.notes}
                      variant="outlined"
                    />
                </Grid>
                {partyType === "waitlist"?
                                <Grid
                                sx={{
                                  mb: `${theme.spacing(3)}`
                                }}
                                item
                                xs={12}
                                sm={8}
                                md={9}
                              >
                                <TextField
                                  InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <AccessTimeIcon />
                                        </InputAdornment>
                                      ),
                                    }}
                                  error={Boolean(touched.waitingTime && errors.waitingTime)}
                                  helperText={touched.waitingTime && errors.waitingTime}
                                  label="Rango de tiempo aproximado de espera"
                                  name="waitingTime"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.waitingTime}
                                  variant="outlined"
                                />
                            </Grid>
                  :
                  <>
                          <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                            <DatePicker
                              value={reservationDate}
                              label="Fecha para la reserva"
                              onChange={(newValue) => {
                                setReservationDate(newValue);
                                // console.log("fecha: ", newValue.toLocalDateString());
                              }}
                              renderInput={(params) => (
                                <TextField
                                {...params}
                                  placeholder="Seleccione una fecha"
                                  // TODO: latin date format
                                />
                              )}
                    />
                      </Grid>
                          <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                            <TimePicker 
                              ampm={false}
                              value={reservationHour}
                              label="Hora para la reserva"
                              onChange={(newValue) => {
                                setReservationHour(newValue);
                                // console.log("hora: ", newValue.toLocalDateString());
                              }}
                              renderInput={(params) => (
                                <TextField
                                {...params}
                                  placeholder="Seleccione una hora (formato 24 horas)"
                                  // TODO: latin date format
                                />
                              )}
                            />
                      </Grid>
                      <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                          <TextField
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <TimelapseIcon />
                              </InputAdornment>
                            ),
                          }}
                            error={Boolean(touched.duration && errors.duration)}
                            helperText={touched.duration && errors.duration}
                            label="Duración"
                            name="duration"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.duration}
                            variant="outlined"
                          />
                    </Grid>
                    </>
                }

              <Grid
                sx={{
                  mb: `${theme.spacing(3)}`
                }}
                item
                xs={12}
                sm={8}
                md={9}
              >
                <Autocomplete
                  sx={{
                    m: 0
                  }}
                  limitTags={2}
                  getOptionLabel={(option) => `Mesa ${option.sk.split('#')[1]} para ${option.size} personas`}
                  options={tables}
                  value={selectedTable}
                  onChange={(event,newValue)=> setSelectedTable(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Selecciona la mesa a utilizar"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <TableRestaurantTwoToneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid  item
                    xs={12}
                    sm={8}
                    md={9} >
              <Button variant="outlined" sx={{width:'50%'}}
                onClick ={()=> setTableType('interior')}
              >  
              Interior
              </Button>
              <Button variant="outlined" sx={{width:'50%'}}
                onClick ={()=> setTableType('exterior')}
              >
                Exterior
              </Button>
            </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              p: 3
            }}
          >
            <Button color="secondary">
            {/*onClick={handleCreateUserClose}>*/}
              Cancelar
            </Button>
            <Button
              type="submit"
              startIcon={
                isSubmitting ? <CircularProgress size="1rem" /> : null
              }
              disabled={Boolean(errors.submit) || isSubmitting}
              variant="contained"
            >
              Actualizar
            </Button>
          </DialogActions>
        </form>
      )}
    </Formik>);
}

export default Edit;