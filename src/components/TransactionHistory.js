import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Stack, Alert, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { getTransactions, makeTransaction } from '../services/walletService';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [walletDetails, setWalletDetails] = useState(null);
  const [transactionType, setTransactionType] = useState('CREDIT'); // Default to CREDIT
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  

  useEffect(() => {
    const storedWallet = JSON.parse(localStorage.getItem('wallet'));
    if (storedWallet) {
      setWalletDetails(storedWallet);
      fetchTransactions(storedWallet.wallet_id, page, rowsPerPage);
    }    
  }, []);

  const fetchTransactions = (wallet_id, skip=0, limit) => {
    getTransactions(wallet_id, skip, limit).then(res=> {
        if(!res || res.error) {
            // show error
            setErrorMessage(res?.error?.message);
            return;
        }
        setTransactions(res.transactions);
        setTotalCount(res.totalCount);
        setErrorMessage(null);
      }).catch(err=> {
        setErrorMessage(err?.message);
        return;
      });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (walletDetails) {
      fetchTransactions(walletDetails.wallet_id, newPage * rowsPerPage, rowsPerPage); 
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const perPage = parseInt(event.target.value, 10);
    setRowsPerPage(perPage);
    setPage(0);
    if (walletDetails) {
      fetchTransactions(walletDetails.wallet_id, 0, perPage); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (walletDetails) {
      const amount = parseFloat(transactionAmount);
      if (isNaN(amount) || !transactionDescription.trim()) {
        setErrorMessage('Please provide a valid amount and description.');
      } else {
        const amountToSend = transactionType=== 'CREDIT'? amount : -amount;
        makeTransaction(walletDetails.wallet_id, amountToSend, transactionDescription).then(res => {
          if(!res || res.error) {
            // show error
            setErrorMessage(res?.error?.message);
            return;
          }
          fetchTransactions(walletDetails.wallet_id, page, rowsPerPage);
          setPage(0);
          setErrorMessage(null);
        }).catch(err => {
          setErrorMessage(err?.message);
          return;
        })
      }
    }
  };

  if (!walletDetails) return <div>Loading wallet details...</div>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transactions for Wallet: {walletDetails.username}
      </Typography>
        {/* Transaction Form */}
        <Box component="form" display="flex" alignItems="center" mb={3} sx={{ pt: 2, pb: 2 }} onSubmit={handleSubmit}>
              <TextField
                label="Amount"
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                fullWidth
                sx={{ flex: 1, mr: 2 }}
              />
              <TextField
                label="Description"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                fullWidth
                sx={{ flex: 1, mr: 2 }}
              />
              {/* Radio buttons to select Credit or Debit */}
              <FormControl component="fieldset" sx={{ flex: 1, mr: 2 }}>
                <FormLabel component="legend">Transaction Type</FormLabel>
                <RadioGroup
                  row
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <FormControlLabel value="CREDIT" control={<Radio />} label="Credit" />
                  <FormControlLabel value="DEBIT" control={<Radio />} label="Debit" />
                </RadioGroup>
              </FormControl>
              <Button variant="contained" color="primary" type="submit">
                Submit Transaction
              </Button>
        </Box>
      {/* Transaction History Table */}
      <Typography variant="h6" gutterBottom>
        Transactions history
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions && transactions.map((transaction) => (
                <TableRow key={transaction.transactions_id}>
                  <TableCell>{transaction.transactions_id}</TableCell>
                  <TableCell align="right">{transaction.transaction_type}</TableCell>
                  <TableCell align="right">$ {transaction.amount}</TableCell>
                  <TableCell align="right">$ {transaction.balance}</TableCell>
                  <TableCell align="right">{new Date(transaction.date).toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}

export default TransactionHistory;
