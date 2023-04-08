import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';

import { Helmet } from 'react-helmet-async';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';


import RighSide from './RightSide';
import Elements from './Elements';

function Waitlist() {
  const isMountedRef = useRefMounted();
  const [parties, setParties] = useState([]);

  const getParties = useCallback(async () => {
    try {
      const {idToken} = await Auth.currentSession();
      const response = await axios.get(`${process.env.REACT_APP_API}api/parties/booking`,
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
        });

      if (isMountedRef.current) {
        setParties(response.data.data.parties);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getParties();
  }, [getParties]);

  return (
    <>
      <Helmet>
        <title>Lista de espera</title>
      </Helmet>
      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item md={6} xs={12}>
          <Elements parties={parties}/>
        </Grid>
        <Grid item md={6} xs={12}>
          <RighSide/>
        </Grid>
      </Grid>
    </>
  );
}

export default Waitlist;
