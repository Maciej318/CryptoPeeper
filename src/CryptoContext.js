import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { CoinList } from './config/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './fierbase';
import { doc, onSnapshot } from 'firebase/firestore';

const Crypto = createContext()

const CryptoContext = ({children}) => {

const [currency, setCurrency] = useState("PLN");
const [symbol, setSymbol] = useState("zł");
const [coins, setCoins] = useState([]);
const [loading, setLoading] = useState(false);
const [user, setUser] = useState(null);
const [alert, setAlert] = useState({
  open: false,
  message: "",
  type: 'success',
});

  const [watchlist, setWatchlist] = useState([])

useEffect(() => {
  if(user) {
    const coinRef = doc(db, "watchlist", user.uid);

  const unsubscribe = onSnapshot(coinRef, coin => {
      if(coin.exists()) {
        setWatchlist(coin.data().coins);
      }
    });
    return () => {
      unsubscribe();
    }
  }
}, [user])


useEffect(() => {
  onAuthStateChanged(auth, user => {
    if(user) setUser(user);
    else setUser();
  })
}, [])

const fetchCoins = async () => {
  setLoading(true);
  try {
    const { data } = await axios.get(CoinList(currency));
    console.log(data);

    setCoins(data);
    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

useEffect(()=>{
    if (currency === "PLN") setSymbol("zł");
    else if (currency === "USD") setSymbol("$");
    else if (currency === "EUR") setSymbol("€")
}, [currency])


  return (
    <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, fetchCoins,alert, setAlert, user, watchlist}}>
        {children}
    </Crypto.Provider>
  )
}

export default CryptoContext

export const CryptoState = () => {
    return useContext(Crypto);
}