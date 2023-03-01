/* eslint-disable jsx-a11y/label-has-for */
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';

import axios from 'axios';
import useAuth from 'src/hooks/useAuth';
import { Auth } from 'aws-amplify';
import {
  styled,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Zoom,
  Typography,
  Divider,
  TextField,
  CircularProgress,
  Switch,
  Avatar,
  Autocomplete,
  IconButton,
  ListItem,
  ListItemText,
  Alert,
  List,
  Button,
  useTheme
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

const Input = styled('input')({
  display: 'none'
});


const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[50]};
      border-color: ${theme.colors.primary.main};
    }
`
);


const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarWrapper = styled(Box)(
  ({ theme }) => `

    position: relative;

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(6)};
    height: ${theme.spacing(6)};
    bottom: -${theme.spacing(2)};
    right: -${theme.spacing(2)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);


function PageHeader() {
  const { t } = useTranslation();
  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg']
    }
  });

  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));


  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();


  useEffect(()=>{
      setCategories([
        { name: 'TestCategory', id:"fa8d4de7-e815-4e1a-b50c-58ad65dc9fe8" },
        { name: 'TestCategory2', id: "9f9da674-2677-4c13-928f-1e0900a8f671"}
      ]);
      
    },[]);

  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
  };

  const handleCreateUserSuccess = () => {
    enqueueSnackbar('El producto fue creada exitosamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
          Gestión de productos
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateUserOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Crear producto
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateUserClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Agregar producto
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: '',
            description: '',
            categoryId: null,
            price:0,
            submit: null
          }}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const {idToken} = await Auth.currentSession();
              console.log("user =>", user);
              const locationIdS = localStorage.getItem('locationId');
              const response = await axios.post(`https://hk7e0xi2r9.execute-api.us-east-1.amazonaws.com/prod/api/products`,
              {
                locationId: locationIdS,
                categoryId: _values.categoryId,
                name: _values.name,
                description: _values.description,
                price: _values.price
              },
              {
                headers: {
                  Authorization : `Bearer ${idToken.jwtToken}`
                  }
                }
              );
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateUserSuccess();
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
                <Grid container spacing={0}>
                  <Grid  item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}>
                        <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}
                        alignSelf="center"
                      >
                        <b>Nombre:</b>
                      </Box>
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
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box
                            pr={3}
                            sx={{
                              pb: { xs: 1, md: 0 }
                            }}
                          >
                            <b>Descripción:</b>
                          </Box>
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
                          error={Boolean(touched.description && errors.description)}
                          fullWidth
                          helperText={touched.description && errors.description}
                          label="Descripción"
                          name="description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.description}
                          variant="outlined"
                        />
                    </Grid>
                    <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Categorías:</b>
                    </Box>
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
                    <Autocomplete
                      sx={{
                        m: 0
                      }}
                      limitTags={2}
                      getOptionLabel={(option) => option.name}
                      options={categories}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          placeholder="Selecciona una categoría para el producto"
                          onChange={handleChange}
                          value={values.categoryId}
                        />
                      )}
                    />
                  </Grid>
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box
                            pr={3}
                            sx={{
                              pb: { xs: 1, md: 0 }
                            }}
                          >
                            <b>Precio:</b>
                          </Box>
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
                          error={Boolean(touched.price && errors.price)}
                          fullWidth
                          helperText={touched.price && errors.price}
                          label="Precio"
                          name="price"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.price}
                          variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box
                        pr={3}
                        sx={{
                          pb: { xs: 1, md: 0 }
                        }}
                      >
                        <b>Subir imagen:</b>
                      </Box>
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
                    <BoxUploadWrapper {...getRootProps()}>
                      <input {...getInputProps()} />
                      {isDragAccept && (
                        <>
                          <AvatarSuccess variant="rounded">
                            <CheckTwoToneIcon />
                          </AvatarSuccess>
                          <Typography
                            sx={{
                              mt: 2
                            }}
                          >
                            {t('Drop the files to start uploading')}
                          </Typography>
                        </>
                      )}
                      {isDragReject && (
                        <>
                          <AvatarDanger variant="rounded">
                            <CloseTwoToneIcon />
                          </AvatarDanger>
                          <Typography
                            sx={{
                              mt: 2
                            }}
                          >
                            {t('You cannot upload these file types')}
                          </Typography>
                        </>
                      )}
                      {!isDragActive && (
                        <>
                          <AvatarWrapper variant="rounded">
                            <CloudUploadTwoToneIcon />
                          </AvatarWrapper>
                          <Typography
                            sx={{
                              mt: 2
                            }}
                          >
                            Arrastra y deja tu imagen aquí
                          </Typography>
                        </>
                      )}
                    </BoxUploadWrapper>
                    {files.length > 0 && (
                      <>
                        <Alert
                          sx={{
                            py: 0,
                            mt: 2
                          }}
                          severity="success"
                        >
                          {"Has subido"} <b>{files.length}</b>{' '}
                          {"imágene(s)"}!
                        </Alert>
                        <Divider
                          sx={{
                            mt: 2
                          }}
                        />
                        <List disablePadding component="div">
                          {files}
                        </List>
                      </>
                    )}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3
                }}
              >
                <Button color="secondary" onClick={handleCreateUserClose}>
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
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
