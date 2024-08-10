import React, { useCallback, useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import SelectButton from './SelectButton';
import { Line } from 'react-chartjs-2';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { chartDays } from '../config/data';

// Rejestrowanie komponentów Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  // Funkcja do pobierania danych historycznych
  const fetchHistoricalData = useCallback(async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/historical?id=${id}&days=${days}&currency=${currency}`);
      const data = response.data;

      // Walidacja formatu danych
      if (!data.prices || !Array.isArray(data.prices) || !data.prices.every(item => Array.isArray(item) && item.length === 2)) {
        console.error('Invalid data format:', data);
        return;
      }

      console.log('Fetched historical data:', data.prices); // Sprawdź strukturę danych
      setHistoricalData(data.prices); 
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  }, [days, currency]);

  // Efekt do pobierania danych po zmianie ID, dni lub waluty
  useEffect(() => {
    if (coin?.id) {
      fetchHistoricalData(coin.id);
    }
  }, [coin?.id, days, currency, fetchHistoricalData]);

  // Temat ciemny dla wykresu
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

  // Stylizacja za pomocą Material-UI
  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '75%',
      justifyContent: 'center',
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down('md')]: {
        width: '100%',
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
    chartContainer: {
      position: 'relative',
      width: '100%',
      height: '400px', // Ustaw wysokość kontenera wykresu
    },
    buttonContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around',
      marginTop: 20,
    },
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <div className={classes.chartContainer}>
          {!historicalData.length ? (
            <Oval color="#00BFFF" height={80} width={80} />
          ) : (
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price (Past ${days} days) in ${currency}`,
                    borderColor: '#00BFFF',
                    fill: false, // Nie wypełnia pod wykresem
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          )}
        </div>
        <div className={classes.buttonContainer}>
          {chartDays.map(day =>
            <SelectButton
              key={day.value}
              onClick={() => setDays(day.value)}
              selected={days === day.value}
            >
              {day.label}
            </SelectButton>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;

