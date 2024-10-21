import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LiveStatusPage.scss';  // Import your styles

function LiveStatusPage() {
    const [parkLiveStatus, setParkLiveStatus] = useState(null);

    useEffect(() => {
        const fetchLiveStatus = async () => {
            try {
                const response = await axios.get('https://api.themeparks.wiki/v1/entity/universalorlando/live');
                setParkLiveStatus(response.data);
                console.log('Live status:', response.data);
            } catch (error) {
                console.error('Error fetching live status:', error);
            }
        };
        fetchLiveStatus();
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
        </div>
    );
}

export default LiveStatusPage;
