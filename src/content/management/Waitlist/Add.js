import { Formik } from 'formik';
import axios from 'axios';
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
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import InputAdornment from '@mui/material/InputAdornment';


function Add(){
    const theme = useTheme();

return (
    <Formik
    initialValues={{
    partyPeople:0,
      name: '',
      phone: '',
      note:'',
      submit: null
    }}
    onSubmit={async (
      _values,
      { resetForm, setErrors, setStatus, setSubmitting }
    ) => {
      try {
        const {idToken} = await Auth.currentSession();
        const newProduct = {
            partyPeople: _values.partyPeople,
        //   categoryId: selectedCategory.sk.split('#')[1],
          name: _values.name,
          note: _values.note
        };
        const response = await axios.post(`${process.env.REACT_APP_API}api/`,
        newProduct,
        {
          headers: {
            Authorization : `Bearer ${idToken.jwtToken}`
            }
          }
        );
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        //handleCreatePartySuccess(newProduct);
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
                   InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon />
                      </InputAdornment>
                    ),
                  }}
                    error={Boolean(touched.partyPeople && errors.partyPeople)}
                    fullWidth
                    helperText={touched.partyPeople && errors.partyPeople}
                    label="Números de persona"
                    name="partyPeople"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.partyPeople}
                    variant="outlined"
                  />
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
                   InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
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
                     InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIphoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    error={Boolean(touched.phone && errors.phone)}
                    fullWidth
                    helperText={touched.phone && errors.phone}
                    label="Número de celular"
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    variant="outlined"
                  />
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
                     InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon />
                          </InputAdornment>
                        ),
                      }}
                    error={Boolean(touched.note && errors.note)}
                    fullWidth
                    helperText={touched.note && errors.note}
                    label="Notas"
                    name="note"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.note}
                    variant="outlined"
                  />
              </Grid>
            {/* <Grid
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
                onChange={(event,newValue)=> setSelectedCategory(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    placeholder="Selecciona una categoría para el producto"
                  />
                )}
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3
          }}
        >
          <Button color="secondary">
          {/*onClick={handleCreateUserClose}>*/}
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
  </Formik>);
}

export default Add;