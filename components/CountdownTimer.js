"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer({ timeRemaining }) {
    const [time, setTime] = useState(timeRemaining);

    useEffect(() => {
        setTime(timeRemaining);
    }, [timeRemaining]);

    if (!time) return null;

    const { days, hours, minutes, seconds } = time;

    const TimeBox = ({ value, label }) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            minWidth: '50px',
            boxShadow: '0 2px 10px rgba(209, 77, 77, 0.1)',
        }}>
            <span style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#d14d4d',
                fontFamily: 'var(--font-inter)',
            }}>
                {String(value).padStart(2, '0')}
            </span>
            <span style={{
                fontSize: '0.65rem',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
            }}>
                {label}
            </span>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {days > 0 && <TimeBox value={days} label="days" />}
            <TimeBox value={hours} label="hrs" />
            <TimeBox value={minutes} label="min" />
            <TimeBox value={seconds} label="sec" />
        </div>
    );
}
