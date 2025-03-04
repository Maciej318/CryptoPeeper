import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TrendingCoins } from '../config/api';
import { CryptoState } from '../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    carousel: {
        height: '50%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 35,
    },
    courselItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointier",
        textTransform: "uppercase",
        color: "#fff",
        padding: 20,
        "&:hover": {
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 20,
            transition: 'background-color 0.5s ease',
        },
    }
}));

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function Carousel() {

    const [trending, setTrending] = useState([]);
    const classes = useStyles();

    const { currency, symbol } = CryptoState();

    const fetchTrendingCoins = async () => {
        const { data } = await axios.get(TrendingCoins(currency));

    setTrending(data);
    };

    useEffect(() => {
        fetchTrendingCoins();

    }, [currency]);


    const items = trending.map((coin) => {
        let profit = parseFloat(coin?.price_change_percentage_24h) >= 0;

        return(
            <Link className={classes.courselItem} to={`/coins/${coin.id}`}> 
                <img 
                    src={coin?.image}
                    alt={coin.name}
                    height='80'
                    style={{marginBottom: 10}}
                />
                <span>
                    {coin?.symbol}
                    &nbsp;
                    <span style={{color: profit > 0 ? "rgb(14, 203, 129)" : "red", fontWeight: 500,}}>
                    {profit && '+'}
                    {coin?.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                </span>
                
                <span style={{ fontSize: 22, fontWeight: 500, }}>
                    {numberWithCommas(coin?.current_price.toFixed(2))} {symbol}
                </span>
            </Link>
        )
    });

    const responsive = {
        0: {
            items: 2,
        },
        512: {
            items: 5,
        },
    };
    
  return (
    <div className={classes.carousel}>
        <AliceCarousel 
            mouseTracking
            infinite
            autoPlayInterval={1000}
            animationDuration={1500}
            disableDotsControls
            disableButtonsControls
            responsive={responsive}
            autoPlay
            items={items}
        />
    </div>
  );
}

export default Carousel