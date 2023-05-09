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
      const response = await axios.get(`${process.env.REACT_APP_API}api/categories`,
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
      });
      // response.data = response.data.filter(c => c.isVisibleInMenu === true) if u want to just show visible categories
     
      if (isMountedRef.current) {
        setCategories(response.data);
      }
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);;

  const getProducts = useCallback(async (categoriesResponse) => {
    try {
      const {idToken} = await Auth.currentSession();
      const response = await axios.get(`${process.env.REACT_APP_API}api/products`,
      {
        headers: {
          Authorization : `Bearer ${idToken.jwtToken}`
          }
      });
      
      if (isMountedRef.current) {
        response.data.forEach((p) => {
          p.categoryName = categoriesResponse.find( c => c.sk === p.sk.split('/')[0])?.name;
        })
        setProducts(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);
  

  useEffect(() => {
    getCategories().then(
      categoriesResponse => {
        console.log(categoriesResponse);
        getProducts(categoriesResponse);
      }
    );
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
