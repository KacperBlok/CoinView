import React, { useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import SelectButton from './SelectButton';
import { Line } from 'react-chartjs-2';
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
  const [HistoricalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

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
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!HistoricalData ? (
          <Oval color="#00BFFF" height={80} width={80} />
        ) : (
          <>
            <Line
              data={{
                labels: HistoricalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: HistoricalData.map((coin) => coin[1]),
                    label: `Price (Past ${days} days) in ${currency}`,
                    borderColor: '#00BFFF',
                  },
                ],
              }}
              options={{
                elements:{
                  point:{
                      radius: 1,
                  }
                }
              }}  
            />
            <div
            style={{
                display: 'flex',
                width: '100%',
                justifyContent:'space-around',
                marginTop: 20,
              }}
            >{chartDays.map(day =>
              <SelectButton
                key={day.value}
                onClick={() => setDays(day.value)}
                selected={days === day.value}

              >{day.label}</SelectButton>
            )}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
