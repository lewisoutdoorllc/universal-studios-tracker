import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "./WaitHistory.scss";

function LiveStatusPage() {
    const [parkLiveStatus, setParkLiveStatus] = useState(null);
    const [historicalData, setHistoricalData] = useState(() => {
        // Initialize from localStorage, or start with an empty object
        return JSON.parse(localStorage.getItem("historicalData")) || {};
    });

    useEffect(() => {
        const fetchLiveStatus = async () => {
            try {
                const response = await axios.get(
                    "https://api.themeparks.wiki/v1/entity/universalorlando/live"
                );
                setParkLiveStatus(response.data);
            } catch (error) {
                console.error("Error fetching live status:", error);
            }
        };

        fetchLiveStatus();
    }, []);

    if (!parkLiveStatus) return <div>Loading...</div>;

    const sortedLiveData = parkLiveStatus.liveData.sort((a, b) => {
        const waitTimeA =
            a.queue && a.queue.STANDBY && a.queue.STANDBY.waitTime !== undefined
                ? a.queue.STANDBY.waitTime
                : null;
        const waitTimeB =
            b.queue && b.queue.STANDBY && b.queue.STANDBY.waitTime !== undefined
                ? b.queue.STANDBY.waitTime
                : null;

        if (waitTimeA === null) return 1; // Place nulls at the end
        if (waitTimeB === null) return -1;

        if (waitTimeA === waitTimeB) return 0; // Keep equal values together
        return waitTimeA - waitTimeB; // Ascending order, so 0 comes before higher values
    });

    return (
        <div className="live-status-container">
            {/* Render a LineChart for each ride with its historical wait time */}
            <h2>Wait Time History Per Ride</h2>
            {sortedLiveData.map((attraction, index) => (
                <li className="history-list" key={index}>
                    <h3>{attraction.name}</h3>
                    {/* attraction status */}
                    <p>Status: {attraction.status}</p>
                    {/* attraction wait time */}
                    {attraction.queue &&
                    attraction.queue.STANDBY &&
                    attraction.queue.STANDBY.waitTime !== null &&
                    attraction.queue.STANDBY.waitTime !== undefined ? (
                        <p>
                            Wait Time: {attraction.queue.STANDBY.waitTime}{" "}
                            minutes
                        </p>
                    ) : (
                        <p>Wait Time: N/A</p>
                    )}
                    {/* Render the LineChart */}
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={historicalData[attraction.name] || []}
                            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                            <XAxis dataKey="timestamp" />
                            <YAxis />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="waitTime"
                                stroke="#ff7300"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </li>
            ))}
        </div>
    );
}

export default LiveStatusPage;
