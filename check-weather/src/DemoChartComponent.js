import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as chartJS } from 'chart.js/auto';

function BarChart({ChartData}){
    return <Bar data={ChartData} />
}

function LineChart({ChartData}){
    return <Line data={ChartData} />
}

 

export default LineChart;