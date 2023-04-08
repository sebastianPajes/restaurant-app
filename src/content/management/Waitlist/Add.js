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
import DatePicker from '@mui/lab/DatePicker';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';

import InputAdornment from '@mui/material/InputAdornment';

import useRefMounted from 'src/hooks/useRefMounted';


function Add(){
    const theme = useTheme();
    const isMountedRef = useRefMounted();
    const [partyType, setPartyType] = useState('waitlist');
    const [tableType, setTableType] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [reservationHour, setReservationHour] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const handleCreatePartySuccess = ()=>{
    };

    const getTables = useCallback(async () => {
      try {
        const {idToken} = await Auth.currentSession();
        const response = await axios.get(`${process.env.REACT_APP_API}api/tables`,
        {
          headers: {
            Authorization : `Bearer ${idToken.jwtToken}`
            }
        });
       console.log(response.data)
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
    
    
  return (
      <Formik
      initialValues={{
        name: '',
        phone: '',
        partySize:0,
        note:'',
        duration:0,
        waitingTime:'',
        dateTime:'',
        submit: null
      }}
      onSubmit={async (
        _values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          const {idToken} = await Auth.currentSession();
          const newProduct = {
              source:"manual",
              customer:{
                name: _values.name,
                phone: _values.phone,
                partySize: _values.partySize,
              } ,
              //   categoryId: selectedCategory.sk.split('#')[1],
              // note: _values.note,
              //only for booking
              duration:_values.duration,
              dateTime: _values.dateTime,
              //only for waitlist
              waitingTime: _values.waitingTime, 
          };
          const response = await axios.post(`${process.env.REACT_APP_API}api/parties/${partyType}`,
          newProduct,
          {
            headers: {
              Authorization : `Bearer ${idToken.jwtToken}`
              }
          }
          );
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          handleCreatePartySuccess(newProduct);
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
                      error={Boolean(touched.note && errors.note)}
                      fullWidth
                      helperText={touched.note && errors.note}
                      label="Notas"
                      name="note"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.note}
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
                                  label="Tiempo de espera"
                                  name="waitingTime"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.waitingTime}
                                  variant="outlined"
                                />
                            </Grid>
                  :
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
                              onChange={(newValue) => {
                                setReservationDate(newValue);
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
                  getOptionLabel={(option) => "Para "+ option.size+ " personas"}
                  options={tables}
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
              Agregar
            </Button>
          </DialogActions>
        </form>
      )}
    </Formik>);
}

export default Add;