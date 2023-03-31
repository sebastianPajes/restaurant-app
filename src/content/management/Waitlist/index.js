import { useState, useEffect, useCallback } from 'react';
import axios from 'src/utils/axios';

import { Helmet } from 'react-helmet-async';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';


import RighSide from './RightSide';
import Elements from './Elements';

function Waitlist() {
  const isMountedRef = useRefMounted();
  const [parties, setParties] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/parties/booking');

      if (isMountedRef.current) {
        setParties(response.data.employee);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    // getUsers();
  }, [getUsers]);

  return (
    <>
      <Helmet>
        <title>Lista de espera</title>
      </Helmet>
     <Elements/>
     <RighSide/>
    </>
  );
}

export default Waitlist;
