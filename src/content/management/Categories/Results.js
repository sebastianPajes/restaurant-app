import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import numeral from 'numeral';
import Toggle from 'react-toggle'

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  Link,
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
  styled
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import Text from 'src/components/Text';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import '../../../components/toggle.css'
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

const Results = ({ categories }) => {
  const [selectedItems, setSelectedProducts] = useState([]);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllProducts = (event) => {
    setSelectedProducts(
      event.target.checked ? categories.map((product) => product.id) : []
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

  const filteredProducts = applyFilters(categories, query);
  const paginatedProducts = applyPagination(filteredProducts, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeProducts =
    selectedItems.length > 0 && selectedItems.length < categories.length;
  const selectedAllProducts = selectedItems.length === categories.length;
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    enqueueSnackbar("Se ha borrado exitosamente la categoría", {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
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
                  placeholder="Buscar categoría por nombre"
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
                    <TableCell> Descripción</TableCell>
                    <TableCell align="center"> Visible en menú</TableCell>
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
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <ImgWrapper src="" />
                            <Box
                              pl={1}
                              sx={{
                                width: 100
                              }}
                            >
                              <Link
                                component={RouterLink}
                                to={
                                  `/${
                                    location.pathname.split('/')[1]
                                  }/management/commerce/products/single/` +
                                  product.id
                                }
                                variant="h5"
                              >
                                {product.name}
                              </Link>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              pl={1}
                              sx={{
                                width: 250
                              }}
                            >
                                {product.description}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                              <Toggle
                                defaultChecked={true}
                                icons={false}
                                onChange={handleConfirmDelete} />
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title="Eliminar" arrow>
                              <IconButton
                                onClick={handleConfirmDelete}
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
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
            Realmente quieres borrar esta categoría?
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
  categories: PropTypes.array.isRequired
};

Results.defaultProps = {
  categories: []
};

export default Results;
