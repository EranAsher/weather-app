import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({userName}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/Login');
  };

  const isLoginPage = location.pathname === '/Login';

  return (
    <AppBar position="static" style={{ backgroundColor: '#565656' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Roboto, sans-serif',
            flexGrow: 1,
          }}
        >
          My Weather App
        </Typography>
        {!isLoginPage && (
          <Typography
            sx={{
              color: 'white',
              marginRight: 2,
              fontFamily: 'Roboto, sans-serif',
              fontSize:14,
            }}
          >
            Hello {userName}
          </Typography>
        )}
        <Button 
        color= "inherit"
        onClick={handleLogout}
        disabled={isLoginPage}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
