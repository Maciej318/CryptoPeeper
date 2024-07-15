
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CoinPage from './pages/CoinPage';
import { makeStyles } from '@material-ui/core';
import Alert from './components/Alert';

const useStyles = makeStyles(()=> ({
  App: {
    backgroundColor: "transparent",
    color: "#fff",
    minHeight: "150vh",
  }
}));

function App() {

  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/coins/:id' element={<CoinPage />}/>
        </Routes>
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
