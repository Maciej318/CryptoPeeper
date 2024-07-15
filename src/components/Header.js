import { AppBar, Container, MenuItem, Select, ThemeProvider, Toolbar, Typography, createTheme, makeStyles } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "#f0be2f",
    fontFamily: "Jost",
    fontWeight: "bold",
    cursor:  "pointer",
    fontSize: 25,
  },
  select: {
    width: 100, 
    height: 40, 
    marginRight: 15,
  },
  section: {
    marginLeft: "auto",
  },
}));

function Header() {
  const classes = useStyles();

  const { currency, setCurrency, user } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary:{
        main: "#fff",
      },
      type: "dark",
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position='sticky'>
        <Container>
          <Toolbar>
            <Link to='/'>
              <Typography className={classes.title}>
                Crypto Peeker<FontAwesomeIcon icon={faCoins} style={{marginLeft: 10, }} bounce/>
              </Typography>
            </Link>
            <div className={classes.section}>
              <Select variant='outlined' className={classes.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <MenuItem value={"PLN"}>PLN</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"EUR"}>EUR</MenuItem>
              </Select>
            </div>

            {user ? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;