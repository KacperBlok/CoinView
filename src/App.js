import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importujemy Routes i Route
import './App.css';
import Header from './Components/Header';
import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';
import { makeStyles } from '@material-ui/core/styles';
import Alert from './Components/Alert';
function App() {
  const useStyles = makeStyles(() => ({
    App: {
      backgroundColor: '#14161a',
      color: 'white',
      minHeight: '100vh',
       
      }
    

  }));
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes> 
          <Route path='/' element={<Homepage />} /> 
          <Route path='/coin/:id' element={<CoinPage />} /> 
        </Routes>
      </div>
      <Alert/>
    </BrowserRouter>
  );
}

export default App;
