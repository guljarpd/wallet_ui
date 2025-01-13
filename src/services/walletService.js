import axios from 'axios';

const API_BASE_URL = "https://wallet-api-ijd2.onrender.com";

// Create a new wallet
export const createWallet = async (name, username, initialBalance) => {
  try {
    const data = JSON.stringify({
      username,
      name,
      amount: parseFloat(initialBalance),
    }); 
    const config = { 
      method: 'post', 
      maxBodyLength: Infinity, 
      url: `${API_BASE_URL}/setup`, 
      headers: { 'Content-Type': 'application/json' }, 
      data: data 
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    if (error?.response?.data?.error?.message) {
      return {error: {message: error.response.data.error.message}}
    }
    return {error: {message: 'Error creating wallet'}}
  }
};

// Get wallet details
export const getWalletDetails = async (id) => {
  try{
    const response = await axios.get(`${API_BASE_URL}/wallet/${id}`);
    return response.data;
  } catch (error) {
    if (error?.response?.data?.error?.message) {
      return {error: {message: error.response.data.error.message}}
    }
    return {error: {message: 'Error fetching wallet details'}}
  }
};

// Make a transaction (Credit/Debit)
export const makeTransaction = async (id, amount, description) => {
  try {
    const data = JSON.stringify({
      description,
      amount: parseFloat(amount),
    }); 
    const config = { 
      method: 'post', 
      maxBodyLength: Infinity, 
      url: `${API_BASE_URL}/transact/${id}`, 
      headers: { 'Content-Type': 'application/json' }, 
      data: data 
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    if (error?.response?.data?.error?.message) {
      return {error: {message: error.response.data.error.message}}
    }
    return {error: {message: 'Error making wallet transaction'}}
  }
};

// Get a transactions 
export const getTransactions = async (walletId, skip, limit) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    if (error?.response?.data?.error?.message) {
      return {error: {message: error.response.data.error.message}}
    }
    return {error: {message: 'Error fetching wallet transaction'}}
  }
};
