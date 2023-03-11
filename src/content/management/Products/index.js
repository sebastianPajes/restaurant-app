import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import Results from './Results';

function ManagementProducts() {
  const isMountedRef = useRefMounted();
  const [products, setProducts] = useState([]);

  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get('https://7himojg8g9.execute-api.us-east-1.amazonaws.com/prod/api/products',
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
      });
      
      console.log("response->", response);
      if (isMountedRef.current) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <>
      <Helmet>
        <title>Gestión de productos</title>
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
          <Results products={products} />
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementProducts;
