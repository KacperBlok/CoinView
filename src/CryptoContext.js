import React, {  createContext, useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Crypto = createContext()
const CryptoContext = ( {children}) => {
const[currency, setCurrency] = useState("USD")
const[symbol, setSymbol] = useState("$")

const [coins, setCoins] = useState([]);
const [loading, setLoading] = useState(false);
const [user, setUser] = useState(null);

const [alert, setAlert] = useState({
    open: false,
    Message: '',
    type: 'success',
})
const[watchlist, setWatchlist] = useState([]);

useEffect(() => {
    if (user) {
        const coinRef =doc(db, "watchlist", user.uid);

       var unsubscribe =  onSnapshot(coinRef, coin  => {
            if (coin.exists()) {
                console.log(coin.data().coins);
                setWatchlist(coin.data().coins);
            } else {
                console.log("No watchlist data found for the user.");
            }
        });
        return () => {
            unsubscribe();
        };
    }
   
}, [user]);

useEffect(() => {
    onAuthStateChanged(auth, user => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });
}, []);

const fetchCoins = useCallback(async () => {
    setLoading(true);
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/data`, {
            params: {
                currency: currency
            }
        });
        setCoins(data.coinList);
    } catch (error) {
        console.error('Error fetching coin data:', error);
    }
    setLoading(false);
}, [currency]);



    useEffect(() => {
        if (currency === "USD") {
            setSymbol("$");
        } else if (currency === "EUR") {
            setSymbol("€");
        }else if(currency === "PLN"){
            setSymbol("zł");
        }
    }, [currency]);

  return <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, fetchCoins,alert, setAlert, user, watchlist}}>
    {children}
    </Crypto.Provider>
  
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto)
};