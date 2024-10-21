import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateToEST } from '../utils/dateHelper'; // Optional helper for formatting dates
import './SchedulePage.scss';  // Import SCSS

function SchedulePage() {
    const [parkSchedule, setParkSchedule] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('https://api.themeparks.wiki/v1/entity/universalorlando/schedule');
                setParkSchedule(response.data);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        fetchSchedule();
    }, []);

    if (!parkSchedule) return <div>Loading...</div>;

    return (
        <div className="schedule-container">
            <h2>Operating Schedule</h2>
            {parkSchedule.parks.length > 0 ? (
                <ul>
                    {parkSchedule.parks.map((park, parkIndex) => (
                        <li key={parkIndex}>
                            <h3>{park.name}</h3>
                            <ul>
                                {park.schedule.map((day, dayIndex) => (
                                    <li key={dayIndex}>
                                        <p>Date: {formatDateToEST(day.date)}</p>
                                        <p>Opening Time: {formatDateToEST(day.openingTime)}</p>
                                        <p>Closing Time: {formatDateToEST(day.closingTime)}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No schedule available</p>
            )}
        </div>
    );
}

export default SchedulePage;
