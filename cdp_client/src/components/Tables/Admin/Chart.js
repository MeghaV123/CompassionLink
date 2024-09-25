import React, { useRef, useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
} from 'chart.js';

// Register the required components
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

function Chart() {
    const chartRef = useRef(null);
    const [monetaryAmountData, setMonetaryAmountData] = useState([]);
    const [monetaryCountData, setMonetaryCountData] = useState([]);
    const [nonMonetaryData, setNonMonetaryData] = useState([]);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        // Fetch monetary donations
        fetch('http://localhost:4000/admin/monetary-donations')
            .then((response) => response.json())
            .then((data) => {
                setMonetaryAmountData(data.map(item => item.totalAmount));
                setMonetaryCountData(data.map(item => item.donationCount));
                if (data.length) {
                    setLabels(data.map(item => `Week ${item.week}`));
                }
            });

        // Fetch non-monetary donations
        fetch('http://localhost:4000/admin/non-monetary-donations')
            .then((response) => response.json())
            .then((data) => {
                setNonMonetaryData(data.map(item => item.count));
            });
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx2 = document.getElementById('donations-chart').getContext('2d');
        chartRef.current = new ChartJS(ctx2, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Monetary Donations (Amount)',
                        data: monetaryAmountData,
                        backgroundColor: 'rgba(75, 192, 192, 0.4)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: true,
                        tension: 0.3,
                    },
                    {
                        label: 'Monetary Donations (Count)',
                        data: monetaryCountData,
                        backgroundColor: 'rgba(255, 99, 132, 0.4)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: true,
                        tension: 0.3,
                    },
                    {
                        label: 'Non-Monetary Donations',
                        data: nonMonetaryData,
                        backgroundColor: 'rgba(153, 102, 255, 0.4)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        fill: true,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monetary and Non-Monetary Donations',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount / Count',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Week',
                        },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [monetaryAmountData, monetaryCountData, nonMonetaryData, labels]);

    return (
        <div className="col-sm-12 col-xl-6">
            <div className="bg-secondary rounded h-100 p-4">
                <h6 className="mb-4">Monetary and Non-Monetary Donations Chart</h6>
                <canvas id="donations-chart"></canvas>
            </div>
        </div>
    );
}

export default Chart;
