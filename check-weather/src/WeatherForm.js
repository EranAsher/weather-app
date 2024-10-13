import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, CircularProgress, Box, Alert } from '@mui/material';
import WeeklyWeatherChart from './WeeklyWeatherChart'; 

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [weekWeather, setWeekWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [forecastCity, setForecastCity] = useState('');
    const [forecastDate, setForecastDate] = useState('');
    const [forecastLoading, setForecastLoading] = useState(false);
    const [forecastError, setForecastError] = useState('');

    // Fetch current weather
    const fetchWeather = async () => {
        if (!city) {
            setError('Please enter a city');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://localhost:7240/weather/current`, { params: { city } });
            setWeather(response.data);
        } catch (err) {
            console.error("Error fetching current weather: ", err);
            setError('Could not fetch weather data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch weekly weather forecast
    const fetchWeeklyWeather = async () => {
        if (!forecastCity || !forecastDate) {
            setForecastError('Please enter both a city and a date');
            return;
        }
        setForecastLoading(true);
        setForecastError('');

        try {
            const response = await axios.get(`https://localhost:7240/weather/week`, {
                params: { city: forecastCity, date: forecastDate }
            });
            setWeekWeather(response.data);
        } catch (err) {
            console.error("Error fetching weekly forecast: ", err);
            setForecastError('Could not fetch weekly forecast data.');
        } finally {
            setForecastLoading(false);
        }
    };

    return (
        <div>
            {/* <Box sx={{maxWidth: 500, margin: '0 auto', padding: '20px', mt:2, borderBlockColor:'black'}}>
        <BarChart ChartData={demoTemp} />
      </Box>
         */}

            {/* <Box sx={{maxWidth: 500, margin: '0 auto', padding: '20px', mt:2, borderBlockColor:'black'}}>
            <LineChart ChartData={demoTemp}/>
        </Box> */}

            <Box sx={{
                maxWidth: 800,
                width:'100%',
                margin: '0 auto',
                padding: '20px',
                mt: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                <Typography variant="h4" gutterBottom>
                    Current Weather
                </Typography>

                <TextField
                    label="City Name"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{ width: 250, m: 2 }}
                    margin="normal"
                />

                <Button
                    onClick={fetchWeather}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ width: 250, m: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Get Current Weather'}
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {weather && (
                    <Box sx={{
                        mt: 3, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Typography variant="h6">
                            Weather for {weather.name}, {weather.country}
                        </Typography>
                        <Typography variant="body1">
                            Temperature: {weather.temp_c}°C
                        </Typography>
                    </Box>
                )}

                {/* Weekly Weather Forecast Section */}
                <Typography variant="h4" gutterBottom sx={{ mt: 15 }}>
                    Weekly Weather Forecast
                </Typography>

                <Box>
                    <TextField
                        label="City Name"
                        variant="outlined"
                        value={forecastCity}
                        onChange={(e) => setForecastCity(e.target.value)}
                        sx={{ width: 200, m: 2 }}
                        margin="normal"
                    />

                    <TextField
                        label="Date (YYYY-MM-DD)"
                        variant="outlined"
                        value={forecastDate}
                        onChange={(e) => setForecastDate(e.target.value)}
                        sx={{ width: 200, m: 2 }}
                        margin="normal"
                    />
                </Box>

                <Button
                    onClick={fetchWeeklyWeather}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={forecastLoading}
                    sx={{ width: 250, mt: 2 }}
                >
                    {forecastLoading ? <CircularProgress size={24} /> : 'Get Weekly Forecast'}
                </Button>

                {forecastError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {forecastError}
                    </Alert>
                )}

                {weekWeather && (
                    <Box sx={{ mt: 5, textAlign:'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Weekly Forecast for {forecastCity}
                        </Typography>
                        {weekWeather.length > 0 && <WeeklyWeatherChart data={weekWeather} />}
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default WeatherApp;
