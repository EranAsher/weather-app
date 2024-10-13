import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage, { users } from './Login';
import WeatherForm from './WeatherForm';
import Header from './Header';



function App() {
  const userFullName = users[0]?.fullName;
  return (
    <Router>
      <Header userName={userFullName}/>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/WeatherApp" element={<WeatherForm />} />
      </Routes>
    </Router>
  );
}

export default App;
