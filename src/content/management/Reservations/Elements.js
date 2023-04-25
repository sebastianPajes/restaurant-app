import {
  Box,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  List,
  Card,
  Tooltip,
  alpha,
  LinearProgress,
  Typography,
  Avatar,
  Button,
  styled,
  ListItemButton,
  useTheme,
  linearProgressClasses
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Text from 'src/components/Text';
import { Link as RouterLink, useLocation} from 'react-router-dom';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      background: ${alpha(theme.colors.alpha.black[10], 0.10)};
  `
);

const ListItemButtonWrapper = styled(ListItemButton)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['transform', 'box-shadow'])};
    transform: scale(1);
    background: ${theme.colors.alpha.white[100]};
    position: relative;
    z-index: 5;

    &:hover {
        border-radius: ${theme.general.borderRadius};
        background: ${theme.colors.alpha.white[100]};
        z-index: 6;
        box-shadow: 
            0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
            0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
            0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
            0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
        transform: scale(1.08);
    }
  `
);



function Elements({parties, handleSelectParty}) {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Card
      // sx={{
      //   overflow: 'visible'
      // }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <Box>
          <Typography variant="h4">Reservas</Typography>
        </Box>
        <IconButton
          size="small"
          color="primary"
          sx={{
            alignSelf: 'center',
            backgroundColor: `${theme.colors.primary.lighter}`,
            transition: `${theme.transitions.create(['all'])}`,

            '&:hover': {
              backgroundColor: `${theme.colors.primary.main}`,
              color: `${theme.palette.getContrastText(
                theme.colors.primary.main
              )}`
            }
          }}
        >
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            // onClick={handleCreateUserOpen}
            component={RouterLink}
            to={`/${
              location.pathname.split('/')[1]
            }/registro`}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          />
        </IconButton>
      </Box>
      <List disablePadding>
        <Divider />
          {
          parties?.map( p =>{
            const actualDate = new Date(p.dateTime);
            return (<ListItemButtonWrapper
              sx={{
                display: { xs: 'block', sm: 'flex' },
                py: 2,
                px: 2.5
              }}
              onClick={() => {handleSelectParty(p)}}
              key={p.sk}
            >
              <ListItemAvatar
                sx={{
                  minWidth: 'auto',
                  mr: 2,
                  mb: { xs: 2, sm: 0 }
                }}
              >
                  <Avatar
                    sx={{
                      fontSize: `${theme.typography.pxToRem(15)}`,
                      background: `${theme.colors.warning.main}`,
                      color: `${theme.palette.getContrastText(
                        theme.colors.warning.dark
                      )}`,
                      width: 56,
                      height: 56
                    }}
                  >
                    {p.customer.partySize}
                  </Avatar>
              </ListItemAvatar>
              <CardWrapper
                        elevation={0}
                              sx={{
                                textAlign: 'center',
                                p: 1,
                              }}
                            >
                              <Typography
                                variant="h4"
                                sx={{
                                  p: 1
                                }}
                              >
                                {actualDate.getDate()+ '/' + parseInt(actualDate.getMonth()+1) + '/' + actualDate.getFullYear()}
                              </Typography>
                              { p.dateTime && 

                                                <Typography
                                                      variant="h6"
                                                      sx={{
                                                        pt: 1
                                                      }}
                                                      >
                                                  { actualDate.getHours()+ ':' + actualDate.getMinutes()}
                                        </Typography>
                              }
                     
                    </CardWrapper>
              <ListItemText
                disableTypography
                primary={
                  <Typography color="text.primary" variant="h5" sx={{
                    pl: 2
                  }}>
                    {p.customer.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        sx={{
                          fontSize: `${theme.typography.pxToRem(12)}`,
                          pl:2
                        }}
                        variant="subtitle2" 
                      >
                        <Text color="success">{p.notes}</Text>
                      </Typography>
                    </Box>
                  </>
                }
              />
               </ListItemButtonWrapper>)
              })
          }
      </List>
    </Card>
  );
}

export default Elements;
