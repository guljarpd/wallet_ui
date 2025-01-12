import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createWallet, getWalletDetails } from '../services/walletService';

function Wallet() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [walletDetails, setWalletDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      const walletData = JSON.parse(storedWallet);
      getWalletDetails(walletData.wallet_id).then(res=> {
        if(res?.error) {
          // show error
          console.error(res);
          setErrorMessage(res?.error?.message);
          return;
        }
        setWalletDetails(res);
      }).catch(err=> {
        console.error('err', err);
        setErrorMessage(err?.message);
        return;
      });
    }
  }, []);

  const handleSetup = () => {
    // disable button
    createWallet(name, username, amount).then(res => {
      if(res?.error) {
        // show error
        console.error(res);
        setErrorMessage(res?.error?.message);
        return;
      }
      localStorage.setItem('wallet', JSON.stringify(res));
      setWalletDetails(res);
    }).catch(err => {
      console.error('err', err);
      setErrorMessage(err?.message);
      return;
    });
  };

  return (
    <Box>
      {walletDetails ? (
        <>
          <Typography variant="body1">Username: {walletDetails.username}</Typography>
          <Typography variant="body1">Name: {walletDetails.name}</Typography>
          <Typography variant="body1">Balance: ${walletDetails.balance}</Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/transactions')}
          >
            View Transactions
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Setup Wallet
          </Typography>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleSetup}>
            Create Wallet
          </Button>
        </>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}

export default Wallet;
