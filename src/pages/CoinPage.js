import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import { Button, LinearProgress, Typography, makeStyles } from '@material-ui/core';
import CoinInfo from '../components/CoinInfo';
import ReactHtmlParser from 'react-html-parser'
import { numberWithCommas } from '../components/Carousel';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../fierbase';

function CoinPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  
  const { currency, symbol, user, setAlert, watchlist } = CryptoState();

  const fetchCoins = async () => {
    const { data } = await axios.get(SingleCoin(id));

    setCoin(data);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const useStyles = makeStyles(() => ({
    container: {
      display: 'flex',
      // [theme.breakpoints.down('md')]: {
      //   flexDirection: "column",
      //   alignItems: 'center',
      // },
    },
    sidebar: {
      width: '30%',
      // [theme.breakpoints.down('md')]: {
      //   width: '100%', 
      // },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 25,
      borderRight: "3px solid #f0be2f",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: 'Jost',
    },
    description: {
      width: '100%',
      fontFamily: "Jost",
      padding: 25,
      paddingBottom: 15,
      textAlign: 'justify',
    },
    marketData: {
      alignSelf: 'start',
      padding: 25,
      paddingBottom: 10,
      width: '100%'
    },
    buttonAdd: {
      marginTop: 30,
      width: "100%",
      height: 40,
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
      padding: 30,
      fontFamily: "Jost",
      cursor: 'pointer',
      "&:hover, &:focus": {
        backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
        transition: 'background-color 0.9s ease',
      },
    }
  }));

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Coin List!`,
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

  const removeFromWatchlist = async () => {
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

  const classes = useStyles();

  if (!coin) return <LinearProgress style={{backgroundColor: '#f0be2f',}}/>

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img src={coin?.image.large} alt={coin?.name} height='200' style={{ marginBottom: 20 }}/>
      <Typography variant='h3' className={classes.heading}>
        {coin?.name}
      </Typography>
      <Typography variant='subtitle1' className={classes.description}>
        {ReactHtmlParser(coin?.description.en.split('. ')[0])}.
      </Typography>

      <div className={classes.marketData}>
        <span style={{display:'flex'}}>
          <Typography variant='h5' className={classes.heading}>
              Rank:
          </Typography>
          &nbsp; &nbsp;
          <Typography variant='h5' style={{fontFamily: 'Jost', color: "#f0be2f",}}>
            {coin?.market_cap_rank}
          </Typography>
        </span>
        <span style={{display:'flex'}}>
          <Typography variant='h5' className={classes.heading}>
              Current Price:
          </Typography>
          &nbsp; &nbsp;
          <Typography variant='h5' style={{fontFamily: 'Jost', color: "#f0be2f",}}>
            {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
            {symbol}{" "}
          </Typography>
        </span>
        <span style={{display:'flex'}}>
          <Typography variant='h5' className={classes.heading}>
              Market Cap:{" "}
          </Typography>
          &nbsp; &nbsp;
          <Typography variant='h5' style={{fontFamily: 'Jost', color: "#f0be2f",}}>
            {numberWithCommas(
              coin?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .slice(0, -6)
            )}
            {symbol}{" "}M
          </Typography>
        </span>

        {user && (
            <Button
              variant="outlined"
              className={classes.buttonAdd}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Coin List" : "Add to Coin List"}
            </Button>
          )}
      </div>
      </div>
      <CoinInfo coin={coin}/>
    </div>
  )
}

export default CoinPage