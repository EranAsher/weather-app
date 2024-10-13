import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const users = [
    {
        fullName: 'Jesse Pinkman',
        email: 'yo@email.com',
        password: '12345'
    }
];

const LoginPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isFormValid = () => {
        return fullName.trim() && email.trim() && password.trim() && isEmailValid(email);
    };


    const handleLogin = () => {
        const user = users.find(
            (user) => user.fullName === fullName && user.email === email && user.password === password
        );

        if (user) {
            navigate('/WeatherApp');
        } else {
            setError('Invalid login credentials. Please try again.');
        }
    };

    return (
        <Box
          sx={{
            maxWidth: 400,
            margin: '0 auto',
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Log in
          </Typography>
    
          {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
    
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
    
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
    
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
    
          <Button
            onClick={handleLogin}
            disabled={!isFormValid()}
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            style={{
              backgroundColor: isFormValid() ? '#007bff' : '#ccc',
              color: 'white',
            }}
          >
            Send
          </Button>
        </Box>
      );
};

export default LoginPage;
