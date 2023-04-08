import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';

import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Results from './Results';

function ManagementUsers() {
  const isMountedRef = useRefMounted();
  const [employees, setEmployees] = useState([]);

  const getEmployees = useCallback(async () => {
    try {
      const {idToken} = await Auth.currentSession();
      const response = await axios.get(`${process.env.REACT_APP_API}api/employees`,
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
        });

      if (isMountedRef.current) {
        setEmployees(response.data.employees);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return (
    <>
      <Helmet>
        <title>Gestión de empleados</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

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
        <Grid item xs={12}>
          <Results users={employees} />
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementUsers;
