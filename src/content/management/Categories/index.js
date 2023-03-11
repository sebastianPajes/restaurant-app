import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Auth } from 'aws-amplify';
import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import Results from './Results';

function ManagementProducts() {
  const isMountedRef = useRefMounted();
  const [categories, setCategories] = useState([]);

  const getCategories = useCallback(async () => {
    try {
      const {idToken} = await Auth.currentSession();
      const response = await axios.get('https://7himojg8g9.execute-api.us-east-1.amazonaws.com/prod/api/categories',
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
      });

      console.log(response);
      if (isMountedRef.current) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <>
      <Helmet>
        <title>Gestión de categorías</title>
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
          <Results categories={categories} />
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementProducts;
