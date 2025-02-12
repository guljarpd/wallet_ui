import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import Wallet from './components/Wallet';
import TransactionHistory from './components/TransactionHistory';

function App() {
  return (
    <Router>
      <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Wallet App
          </Typography>
          <Routes>
            <Route path="/" element={<Wallet />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Routes>
      </Container>
    </Router>
  );
}

export default App;
