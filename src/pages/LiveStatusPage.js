import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import './LiveStatusPage.scss';  // Import your styles

function LiveStatusPage() {
    const [parkLiveStatus, setParkLiveStatus] = useState(null);
    const [historicalData, setHistoricalData] = useState(() => {
        // Initialize from localStorage, or start with an empty object
        return JSON.parse(localStorage.getItem('historicalData')) || {};
    });

    useEffect(() => {
        const fetchLiveStatus = async () => {
            try {
                const response = await axios.get('https://api.themeparks.wiki/v1/entity/universalorlando/live');
                setParkLiveStatus(response.data);

                const timestamp = new Date().toLocaleString();
                const liveData = response.data.liveData;

                const storedData = JSON.parse(localStorage.getItem('historicalData')) || {};

                liveData.forEach(attraction => {
                    const rideName = attraction.name;

                    // Handle null or missing waitTime values
                    const waitTime = attraction.queue && attraction.queue.STANDBY && attraction.queue.STANDBY.waitTime !== null
                        ? attraction.queue.STANDBY.waitTime
                        : 0;  // Replace null with 0 or another fallback

                    if (!storedData[rideName]) {
                        storedData[rideName] = [];
                    }

                    // Add the new data point (timestamp and wait time)
                    storedData[rideName].push({ timestamp, waitTime });
                    

                    // Limit to the last 200 data points
                    if (storedData[rideName].length > 200) {
                        storedData[rideName].shift();  // Remove the oldest entry
                    }
                });

                // Store the updated data in localStorage and update state
                localStorage.setItem('historicalData', JSON.stringify(storedData));
                setHistoricalData(storedData);
            } catch (error) {
                console.error('Error fetching live status:', error);
            }
        };

        fetchLiveStatus();
        const intervalId = setInterval(fetchLiveStatus, 60000);  // Fetch every 60 seconds

        // Clean up interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);


    if (!parkLiveStatus) return <div>Loading...</div>;

    return (
        <div className="live-status-container">
            <h2>Attractions Status</h2>

            {/* Display the current status of attractions */}
            <ul>
                {parkLiveStatus.liveData.map((attraction, index) => (
                    <li key={index}>
                        <h3>{attraction.name}</h3>
                        <p>Status: {attraction.status}</p>
                        {attraction.queue && attraction.queue.STANDBY ? (
                            <p>Wait Time: {attraction.queue.STANDBY.waitTime} minutes</p>
                        ) : (
                            <p>Wait Time: N/A</p>
                        )}
                    </li>
                ))}
            </ul>

            {/* Render a LineChart for each ride with its historical wait time */}
            <h2>Wait Time History Per Ride</h2>
            {Object.keys(historicalData).map(rideName => (
                <div key={rideName} className="ride-chart">
                    <h3>{rideName}</h3>

                    {Array.isArray(historicalData[rideName]) && historicalData[rideName].length > 1 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={historicalData[rideName]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="waitTime" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No significant wait time data available.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default LiveStatusPage;
