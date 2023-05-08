import { useCallback, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Formik } from 'formik';

import {
  Avatar,
  Box,
  Card,
  Slide,
  CircularProgress,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  DialogActions,
  DialogTitle,
  DialogContent,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  Dialog,
  useMediaQuery,
  useTheme,
  Zoom,
  ListItem,
  ListItemText,
  Alert,
  List,
  styled
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { Auth } from 'aws-amplify';
import axios from 'axios';

import { useDropzone } from 'react-dropzone';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

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

const AvatarWrapper = styled(Box)(
  ({ theme }) => `

    position: relative;

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);


const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const ImgWrapper = styled('img')(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: auto;
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (products, query) => {
  return products.filter((product) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (product[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (products, page, limit) => {
  return products.slice(page * limit, page * limit + limit);
};

const Results = ({ products, categories}) => {
  const [selectedItems, setSelectedProducts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');


  
  const onDrop = useCallback((acceptedFiles, rejectFiles)=>{
    acceptedFiles.forEach(file =>{
      const reader = new FileReader();
      reader.onload = (e) => {
       setImage(e.target.result);
      }
      reader.readAsDataURL(file);
    });

  });

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
    },
    onDrop
  });

  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));


  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  
  const handleEditUserOpen = () => {
    setEditOpen(true);
  };

  const handleEditUserClose = () => {
    setEditOpen(false);
  };

  const handleSelectAllProducts = (event) => {
    setSelectedProducts(
      event.target.checked ? products.map((product) => product.id) : []
    );
  };

  const handleSelectOneProduct = (event, productId) => {
    if (!selectedItems.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProducts = applyFilters(products, query);
  const paginatedProducts = applyPagination(filteredProducts, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeProducts =
    selectedItems.length > 0 && selectedItems.length < products.length;
  const selectedAllProducts = selectedItems.length === products.length;
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async() => {
    console.log(`${selectedProduct.sk.split('/')[1].split('#')[1]}?categoryId=${selectedProduct.sk.split('/')[0].split('#')[1]}`)
    setOpenConfirmDelete(false);
    const {idToken} = await Auth.currentSession();
    const response = await axios.delete(`${process.env.REACT_APP_API}api/products/${selectedProduct.sk.split('/')[1].split('#')[1]}?categoryId=${selectedProduct.sk.split('/')[0].split('#')[1]}`,
    {
      headers: {
        Authorization : `Bearer ${idToken.jwtToken}`
        }
    });
    enqueueSnackbar("Se ha eliminado exitosamente el producto", {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    window.location.reload(false);

  };

  const handleEditProduct = () => {

  };

  return (
    <>
      <Card>
        <Box display="flex" alignItems="center">
          {selectedBulkActions && (
            <Box flex={1} p={2}>
              <BulkActions />
            </Box>
          )}
          {!selectedBulkActions && (
            <Box
              flex={1}
              p={2}
              display={{ xs: 'block', md: 'flex' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                sx={{
                  mb: { xs: 2, md: 0 }
                }}
              >
                <TextField
                  size="small"
                  fullWidth={mobile}
                  onChange={handleQueryChange}
                  value={query}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Buscar producto por nombre"
                />
              </Box>
              <TablePagination
                component="div"
                count={filteredProducts.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          )}
        </Box>
        <Divider />

        {paginatedProducts.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
                No hay data con ese criterio de búsqueda
          </Typography>
        ) : (
          <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Nombre </TableCell>
                  <TableCell> Descripción </TableCell>
                  <TableCell> Categoría </TableCell>
                  <TableCell> Precio </TableCell>
                  <TableCell align="center"> Acciones </TableCell>  
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product) => {
                  const isProductSelected = selectedItems.includes(
                    product.id
                  );
                  return (
                    <TableRow
                      hover
                      key={product.id}
                      selected={isProductSelected}
                      style={{background:'#FFE159'}}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <ImgWrapper src="/static/defaultImage.png" />
                          <Box
                            pl={1}
                            sx={{
                              width: 100
                            }}
                          >
                              {product.name}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            pl={1}
                            sx={{
                              width: 200
                            }}
                          >
                              {product.description}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            pl={1}
                            sx={{
                              width: 60
                            }}
                          >
                              {product.categoryName}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                          <Typography>
                              {`S/.${product.price}`}
                          </Typography>
	                    </TableCell>
                      <TableCell align="center">
                        <Typography noWrap>
                          <Button
                            sx={{
                              mt: { xs: 2, sm: 0 }
                            }}
                            onClick={() => {
                                setSelectedProduct(product)
                                handleConfirmDelete()
                              }
                            }
                            variant="contained"
                          >
                            Editar
                          </Button>
                                                      
                          {/* <Tooltip title="Editar" arrow>
                            <IconButton
                              onClick={handleEditCategory}
                              color="primary"
                            >
                              <EditIcon fontSize="medium" />
                            </IconButton>
                          </Tooltip> */}
                          <Tooltip title="Eliminar" arrow>
                            <IconButton
                              color="primary"
                              onClick={() => {
                                handleConfirmDelete()
                                setSelectedProduct(product)}
                              }
                            >
                              <DeleteTwoToneIcon fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
      
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={2}>
            <TablePagination
              component="div"
              count={filteredProducts.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </Box>
        </>
        )}
      </Card>
      <Dialog
        fullWidth
        maxWidth="md"
        open={editOpen}
        onClose={handleEditUserClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Editar producto
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: selectedProduct?.name,
            description: selectedProduct?.description,
            price:selectedProduct?.price,
            submit: null
          }}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const {idToken} = await Auth.currentSession();
              const editedProduct = {
                ...selectedProduct,
                id: selectedProduct.sk.split('#')[1],
                categoryId: selectedProduct.sk.split('#')[1],
                name: _values.name,
                description: _values.description,
                price: _values.price
              }
              const response = await axios.put(`${process.env.REACT_APP_API}api/products`,
                editedProduct,
              {
                headers: {
                  Authorization : `Bearer ${idToken.jwtToken}`
                  }
                }
              );
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleEditProduct();
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
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box
                        pr={3}
                        sx={{
                          pb: { xs: 1, md: 0 }
                        }}
                      >
                        <b>Imagen:</b>
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
                <Button color="secondary" onClick={handleEditUserClose}>
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
      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            Realmente quieres borrar este producto?
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              Cancelar
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              Eliminar
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  products: PropTypes.array.isRequired
};

Results.defaultProps = {
  products: []
};

export default Results;
