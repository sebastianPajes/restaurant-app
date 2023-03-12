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
  const [products, setProducts] = useState([]);
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

      if (isMountedRef.current) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  const getProducts = useCallback(async () => {
    try {
      const {idToken} = await Auth.currentSession();
      const response = await axios.get('https://7himojg8g9.execute-api.us-east-1.amazonaws.com/prod/api/products',
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
      });
      
      if (isMountedRef.current) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);
  

  useEffect(() => {
    getCategories();
    getProducts();
    products.forEach((p) => {
      p.categoryName = categories.find( c => c.sk === p.sk.split('/')[0]);
      console.log(p)
    })
  }, [getProducts, getCategories]);

  return (
    <>
      <Helmet>
        <title>Gestión de productos</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader handleAddProduct={setProducts} categories={categories}/>
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
          <Results products={products} categories={categories}/>
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementProducts;
