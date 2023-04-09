import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import PhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  // Add your custom styles here
  phoneNumberInput: {
    width: '100%',
    maxWidth: '300px',
    '& .react-phone-number-input__input': {
      width: '100%',
    },
  },
}));

const LocationDetail = () => {
  const [location, setLocation] = useState(null);
  const [updatedLocation, setUpdatedLocation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [waitingTimeError, setWaitingTimeError] = useState('');
  const [error, setError] = useState(null)
  const classes = useStyles();


  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { idToken } = await Auth.currentSession();
        const response = await axios.get(`${process.env.REACT_APP_API}api/locations`, {
          headers: {
            Authorization: `Bearer ${idToken.jwtToken}`,
          },
        });

        console.log(response)
        if (response.data.message !== 'Success') {
          setError(response.data.message)
          return;
        }

        const location = response.data.data.location;
        setLocation(location);
        setUpdatedLocation(location);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocation();
  }, []);

  const isValidWaitingTime = (value) => {
    const regex = /^\d+-\d+$/;
    return regex.test(value) ? '' : 'El formato debe ser "min-max" (ejemplo: 15-60)';
  };  

  const handleChange = (event, field, day = null) => {
    const value = event.target.value;
  
    if (field === 'defaultWaitingTime') {
      const errorMessage = isValidWaitingTime(value);
      setWaitingTimeError(errorMessage);
    }
  
    if (day) {
      setUpdatedLocation({
        ...updatedLocation,
        businessHours: {
          ...updatedLocation.businessHours,
          [day]: value,
        },
      });
    } else {
      setUpdatedLocation({ ...updatedLocation, [field]: value });
    }
  };

  const handlePhoneNumberChange = (value) => {
    setUpdatedLocation({ ...updatedLocation, phone: value });
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setUpdatedLocation(location);
    setError(null)
  };

  const handleSave = async () => {
    try {
      const { idToken } = await Auth.currentSession();
      const response = await axios.put(
        `${process.env.REACT_APP_API}api/locations`,
        updatedLocation,
        {
          headers: {
            Authorization: `Bearer ${idToken.jwtToken}`,
          },
        }
      );
      if (response.status === 200) {
        setLocation(updatedLocation);
        setIsEditMode(false);
        setError(null)
      } else {
        setError(response.data.message)
        console.error('Error updating the locationzzz');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error updating the location');
      }
      console.error('Error updating the location:', error);
    }
  };
  

  if (!location) return <div>Cargando...</div>;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          {error && <FormHelperText error>{error}</FormHelperText>}
         </Grid>
          <Grid item xs={12} container justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">
                {!isEditMode ? (
                  location.name
                ) : (
                  <>
                    <Typography variant="subtitle1" display="inline">
                      Nombre:{' '}
                    </Typography>
                    <TextField
                      value={updatedLocation.name}
                      onChange={(event) => handleChange(event, 'name')}
                    />
                  </>
                )}
              </Typography>
            </Grid>
            <Grid item>
              {!isEditMode ? (
                <Button color="primary" onClick={handleEdit}>
                  Editar
                </Button>
              ) : (
                <>
                  <Button color="secondary" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button color="primary" 
                  onClick={handleSave}
                  disabled={Boolean(waitingTimeError)}
                  >
                    Guardar
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" display="inline">
              Dirección:{' '}
            </Typography>
            {!isEditMode ? (
              <Typography variant="body1" display="inline">
                {location.address}
              </Typography>
            ) : (
              <TextField
                value={updatedLocation.address}
                onChange={(event) => handleChange(event, 'address')}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" display="inline">
              Tiempo de espera por defecto:{' '}
            </Typography>
            {!isEditMode ? (
              <Typography variant="body1" display="inline">
                {location.defaultWaitingTime}
              </Typography>
            ) : (
              <>
                <TextField
                  value={updatedLocation.defaultWaitingTime}
                  onChange={(event) => handleChange(event, 'defaultWaitingTime')}
                  error={Boolean(waitingTimeError)}
                />
                {waitingTimeError && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    {waitingTimeError}
                  </Typography>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" display="inline">
              Teléfono:{' '}
            </Typography>
            {!isEditMode ? (
              <Typography variant="body1" display="inline">
                {location.phone}
              </Typography>
            ) : (
              <PhoneNumberInput
                defaultCountry="PE"
                value={updatedLocation.phone}
                onChange={handlePhoneNumberChange}
                className={classes.phoneNumberInput}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Horario de atención:</Typography>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <div key={day}>
                  <Typography variant="body1" display="inline">
                    {day}:{' '}
                  </Typography>
                  {!isEditMode ? (
                    <Typography variant="body1" display="inline">
                      {location.businessHours[day]}
                    </Typography>
                  ) : (
                    <TextField
                      value={updatedLocation.businessHours[day]}
                      onChange={(event) => handleChange(event, 'businessHours', day)}
                    />
                  )}
                </div>
              )
            )}
          </Grid>

          {location.qrCodeWaitlist && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Código QR de la lista de espera:</Typography>
              <Box>
                <img src={location.qrCodeWaitlist} alt="QR Code" />
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LocationDetail;
