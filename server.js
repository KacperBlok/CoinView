const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();

const API_KEY1 = process.env.API_KEY1;
const API_KEY2 = process.env.API_KEY2;


const cache = {
    coinList: {},
    coinDetails: {},
    historicalData: {},
    trendingCoins: {},
    lastUpdated: 0
};

const CoinList = (currency, page = 1, perPage = 100) => `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;

const SingleCoin = (id, currency) => `https://api.coingecko.com/api/v3/coins/${id}?vs_currency=${currency}&x_cg_demo_api_key=${API_KEY2}`;

const HistoricalChart = (id, days = 365, currency) => `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&x_cg_demo_api_key=${API_KEY1}`;

const TrendingCoins = (currency) => `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

const fetchCoinList = async (currency) => {
    try {
        const response1 = await axios.get(CoinList(currency, 1, 250));
        const data1 = response1.data;

        const response2 = await axios.get(CoinList(currency, 2, 250));
        const data2 = response2.data;

        return [...data1, ...data2];
    } catch (error) {
        console.error('Error fetching coin list:', error.message);
        throw error;
    }
};

const fetchTrendingCoins = async (currency) => {
    try {
        const response = await axios.get(TrendingCoins(currency));
        return response.data;
    } catch (error) {
        console.error('Error fetching trending coins:', error.message);
        throw error;
    }
};

const fetchHistoricalChart = async (id, days, currency) => {
    try {
        const response = await axios.get(HistoricalChart(id, days, currency));
        return response.data;
    } catch (error) {
        console.error('Error fetching historical chart:', error.message);
        throw error;
    }
};

const fetchCoinDetails = async (id, currency) => {
    try {
        const response = await axios.get(SingleCoin(id, currency));
        return response.data;
    } catch (error) {
        console.error(`Error fetching coin details for ${id}:`, error.message);
        throw error;
    }
};

// Fetch coin list and update cache
const updateCoinList = async (currency) => {
    try {
        const coinList = await fetchCoinList(currency);
        cache.coinList[currency] = coinList;
    } catch (error) {
        console.error('Error updating coin list:', error.message);
    }
};

// Fetch trending coins and update cache
const updateTrendingCoins = async (currency) => {
    try {
        const trendingCoins = await fetchTrendingCoins(currency);
        cache.trendingCoins[currency] = trendingCoins;
        cache.lastUpdated = Date.now();
    } catch (error) {
        console.error('Error updating trending coins:', error.message);
    }
};

// Route for fetching coin list and trending coins
app.get('/api/data', async (req, res) => {
    try {
        const currency = req.query.currency || 'usd'; // Default to 'usd' if no currency is provided

        if (!cache.coinList[currency] || !cache.trendingCoins[currency]) {
            await updateCoinList(currency);
            await updateTrendingCoins(currency);
        }

        res.json({
            coinList: cache.coinList[currency],
            trendingCoins: cache.trendingCoins[currency],
        });
    } catch (error) {
        console.error('Error handling /api/data request:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const currency = req.query.currency || 'usd'; // Default to 'usd' if no currency is provided

        if (!cache.trendingCoins[currency]) {
            await updateTrendingCoins(currency);
        }

        res.json(cache.trendingCoins[currency]);
    } catch (error) {
        console.error('Error handling /api/trending request:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/historical', async (req, res) => {
    try {
        const { id, days, currency } = req.query;
        if (!id || !days || !currency) {
            return res.status(400).send('Missing required parameters');
        }
        
        const cacheKey = `${id}-${days}-${currency}`;
        if (cache.historicalData[cacheKey]) {
            return res.json(cache.historicalData[cacheKey]);
        }

        const historicalData = await fetchHistoricalChart(id, days, currency);
        cache.historicalData[cacheKey] = historicalData;
        res.json(historicalData);
    } catch (error) {
        console.error('Error handling /api/historical request:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/coin-details', async (req, res) => {
    try {
        const { id, currency } = req.query;
        if (!id || !currency) {
            return res.status(400).send('Missing required parameters');
        }
        
        const cacheKey = `${id}-${currency}`;
        if (cache.coinDetails[cacheKey]) {
            return res.json(cache.coinDetails[cacheKey]);
        }

        const coinDetails = await fetchCoinDetails(id, currency);
        cache.coinDetails[cacheKey] = coinDetails;
        res.json(coinDetails);
    } catch (error) {
        console.error('Error handling /api/coin-details request:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Default route for undefined endpoints
app.use((req, res) => {
    res.status(404).send('Endpoint not found');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/api/data`);
});
