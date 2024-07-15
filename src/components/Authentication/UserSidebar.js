import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { CryptoState } from '../../CryptoContext';
import { Avatar, Tab, Tabs } from '@material-ui/core';
import { TabPanel } from '@material-ui/lab';
import { TabContext } from '@material-ui/lab';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../fierbase';
import { numberWithCommas } from '../Carousel';
import {AiFillDelete} from 'react-icons/ai';
import { doc, setDoc } from 'firebase/firestore';

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Jost",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    height: "90%",
    gap: "28px",
  },
  picture:{
    width: 150,
    height: 150,
    cursor: "pointer",
    objectFit: "contain",
    backgroundColor: "#f0be2f",
  },
  logout: {
    position: "absolute",
    right: 19,
    bottom: 25,
    width: "90%",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      backgroundColor: '#f0be2f',
      padding: 17,
      fontFamily: "Jost",
      cursor: 'pointer',
      "&:hover, &:focus": {
        background: '#ad8a24',
        transition: 'background-color 0.9s ease',
      },
  },
  watchlist: {
    width: "100%",
    height: "60vh",
    marginTop: 30,
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    overflowY: "scroll",
  },
  coinlist: {
    width: 350,
    height: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  coin: {
    padding: 10,
    backgroundColor: "#e0b12b",
    color: "#fff",
    borderRadius: 5,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
});


export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const [value, setValue] = React.useState("account");

  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const logOut = () => {
    signOut(auth);

    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull!",
    })

    toggleDrawer();
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the  Coin List!`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar onClick={toggleDrawer(anchor, true)} style={{ height: 42, width: 42, cursor: "pointer", backgroundColor: "#f0be2f" }} src={user.photoURL} alt={user.displayName || user.email} />
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <TabContext value={value}>
              <Tabs value={value} onChange={handleTabChange} variant='fullWidth' TabIndicatorProps={{ style: { background: '#f0be2f' } }} style={{ borderRadius: 10 }}>
                <Tab value="account" label="Account" />
                <Tab value="coinList" label="Coin List" />
              </Tabs>
              <TabPanel value="account">
                <div className={classes.container}>
                  <div className={classes.profile}>
                    <Avatar className={classes.picture} src={user.photoURL} alt={user.displayName || user.email} />
                    <span style={{ width: "100%", fontSize: 25, textAlign: "center", fontWeight: "bolder", wordWrap: "break-word" }}>
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <Button variant='contained' className={classes.logout} onClick={logOut}>
                    Log Out
                  </Button>
                </div>
              </TabPanel>
              <TabPanel value="coinList">
                <div className={classes.coinlist}>
                    <span style={{fontSize: 20, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", fontFamily: "Jost",}}>
                      Your Personal Crypto Coin List
                    </span>
                    <div className={classes.watchlist}>
                        {coins.map((coin) => {
                        if (watchlist.includes(coin.id))
                          return (
                            <div className={classes.coin}>
                              <span>{coin.name}</span>
                              <span style={{ display: "flex", gap: 8 }}>
                                {symbol}{" "}
                                {numberWithCommas(coin.current_price.toFixed(2))}
                                <AiFillDelete
                                  style={{ cursor: "pointer", marginTop: 3,}}
                                  fontSize="16"
                                  onClick={() => removeFromWatchlist(coin)}
                                />
                              </span>
                            </div>
                          );
                            else return <></>;
                          })}
                    </div>
                    <Button variant='contained' className={classes.logout} onClick={logOut}>
                    Log Out
                    </Button>
                </div>
              </TabPanel>
            </TabContext>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
