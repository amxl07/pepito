"use client";

import { useState, useEffect, useRef } from "react";

export default function Day6() {
    const [hugging, setHugging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [complete, setComplete] = useState(false);
    const intervalRef = useRef(null);

    const startHug = () => {
        if (complete) return;
        setHugging(true);
        intervalRef.current = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(intervalRef.current);
                    setComplete(true);
                    return 100;
                }
                return p + 2; // Speed of hug
            });
        }, 50);
    };

    const endHug = () => {
        setHugging(false);
        clearInterval(intervalRef.current);
        if (!complete) setProgress(0);
    };

    return (
        <div
            onMouseDown={startHug}
            onMouseUp={endHug}
            onTouchStart={startHug}
            onTouchEnd={endHug}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                background: hugging ? `rgba(255, 200, 200, ${progress / 200})` : 'transparent',
                transition: 'background 0.5s',
                cursor: 'pointer'
            }}
        >
            <h2 style={{ marginBottom: '50px' }}>Hug Day 🤗</h2>

            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Progress Ring */}
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                    <circle cx="100" cy="100" r="90" stroke="#eee" strokeWidth="10" fill="transparent" />
                    <circle
                        cx="100" cy="100" r="90"
                        stroke="#ff6b6b" strokeWidth="10" fill="transparent"
                        strokeDasharray="565"
                        strokeDashoffset={565 - (565 * progress) / 100}
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                </svg>

                <div style={{ fontSize: '4rem', transform: `scale(${1 + progress / 200})`, transition: 'transform 0.1s' }}>
                    🤗
                </div>
            </div>

            <p className="fade-in" style={{ marginTop: '50px', fontWeight: 'bold' }}>
                {complete
                    ? "Hug received! warm & fuzzy."
                    : hugging
                        ? "Squeeeeeeeze..."
                        : "Press & Hold to send a hug"}
            </p>
        </div>
    );
}
