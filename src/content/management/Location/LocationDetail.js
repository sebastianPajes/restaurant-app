import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { LocationOn, Schedule } from '@mui/icons-material';

const LocationDetail = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { idToken } = await Auth.currentSession();
        const response = await axios.get(`${process.env.REACT_APP_API}api/locations`, {
          headers: {
            Authorization: `Bearer ${idToken.jwtToken}`,
          },
        });

        const location = response.data.data.location;
        setLocation(location);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocation();
  }, []);

  if (!location) return <div>Cargando...</div>;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">{location.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Tiempo de espera por defecto:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {location.defaultWaitingTime}
          </Typography>
        </Grid>
          <Grid item xs={12}>
            <LocationOn />
            <Typography variant="body1">{location.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Schedule />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell>Horario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(location.businessHours)
                    .sort((a, b) => {
                      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                      return daysOfWeek.indexOf(a[0]) - daysOfWeek.indexOf(b[0]);
                    })
                    .map(([day, hours]) => (
                      <TableRow key={day}>
                        <TableCell>{day}</TableCell>
                        <TableCell>{hours}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {location.qrCodeWaitlist && (
            <Grid item xs={12}>
              <Typography variant="h6">Código QR de la lista de espera:</Typography>
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
