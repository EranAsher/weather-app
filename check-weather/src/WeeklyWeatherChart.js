import React from 'react';
import {  Box, Alert, colors, useColorScheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Colors } from 'chart.js';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, colors);

const WeeklyWeatherChart = ({ data }) => {
  const chartData = {
    labels: data.map((day) => day.date),
    datasets: [
      {
        label: 'Temperature (°C)',
        fill: true,
        borderColor: '#0096FF', 
        backgroundColor: '#0096FF', 
        data: data.map((day) => day.tempreture),
      },
    ],
  };

  const options = { 
    scales: {
      responsive: true,
      maintainAspectRatio: false,
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        min: -10,
        max: 40,
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
  };

  return (
    <Box
    sx={{
      flexGrow: 1, // Allows the chart to grow
      minWidth: 600, 
      minHeight: 300, 
      display: 'flex', // Keep the chart responsive in flex container
    }}
  >
    <Line data={chartData} options={options} />
  </Box>
  );
};

export default WeeklyWeatherChart;
