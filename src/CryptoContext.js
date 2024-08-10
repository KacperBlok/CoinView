import React, {  createContext, useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios';

const Crypto = createContext()
const CryptoContext = ( {children}) => {
const[currency, setCurrency] = useState("USD")
const[symbol, setSymbol] = useState("$")

const [coins, setCoins] = useState([]);
const [loading, setLoading] = useState(false);
const [user, setUser] = useState(null);


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

  return <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, fetchCoins}}>
    {children}
    </Crypto.Provider>
  
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto)
};