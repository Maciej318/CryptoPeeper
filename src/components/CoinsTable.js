import React, { useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import { useNavigate } from 'react-router-dom';
import { Container, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography, createTheme, makeStyles } from '@material-ui/core';
import { numberWithCommas } from './Carousel';
import { Pagination } from '@material-ui/lab';

function CoinsTable() {

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { currency, symbol, coins, loading, fetchCoins } = CryptoState();


  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary:{
        main: "#fff",
      },
      type: "dark",
    }
  });

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  const useStyles = makeStyles(() => ({
    row: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#080707',
        transition: 'background-color 0.5s ease',
      },
      fontFamily: 'Jost',
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "#f0be2f",
        
      },
    }
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{textAlign: "center"}}>
        <Typography variant='h4' style={{margin: 18, fontFamily: 'Jost'}}>
          Cryptocurrency Prices by Market Cap
        </Typography>

        <TextField label="Search For a Crypto Currency..." variant='outlined' onChange={((e) => setSearch(e.target.value))} style={{marginBottom: 20, width: '100%'}}/>

        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "#f0be2f"}} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#f0be2f", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "700",
                        fontFamily: "Jost",
                        fontSize: 18  ,
                      }}
                      key={head}
                      align={head === "Coin" ? "left" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
                <TableBody>
                  {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;

                      return (
                          <TableRow onClick={() => navigate(`/coins/${row.id}`)} className={classes.row} ket={row.name}>
                              <TableCell component='th' scope='row' style={{display: 'flex', gap: 15,}}>
                                  <img src={row?.image} alt={row.name} height='50' style={{ marginBottom: 10 }}/>
                                  <div style={{ display: 'flex', flexDirection: 'column'}}>
                                    <span style={{textTransform: 'uppercase', fontSize: 22,}}>
                                      {row.symbol}
                                    </span>
                                    <span style={{ color: 'darkgrey' }}>
                                      {row.name}
                                    </span>
                                  </div>
                              </TableCell>
                              <TableCell  align='right' style={{color: profit > 0 ? "rgb(14, 203, 129)" : "red", fontWeight: 500,}}> 
                                  {profit && '+'}
                                  {row.price_change_percentage_24h.toFixed(2)}%
                              </TableCell>
                              <TableCell  align='right'> 
                                  {numberWithCommas(row.current_price.toFixed(2))}
                                  {symbol}{" "}
                              </TableCell>
                              <TableCell align='right'>
                                  {numberWithCommas(
                                    row.market_cap.toString().slice(0, -6)
                                  )}
                                  {symbol}{""}
                                  &nbsp; &nbsp;
                                  M
                              </TableCell>
                          </TableRow>
                      )
                    })}
                </TableBody>
            </Table>
          )}
        </TableContainer>

        <Pagination
          count={parseInt((handleSearch()?.length / 10).toFixed(0))}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}

export default CoinsTable;