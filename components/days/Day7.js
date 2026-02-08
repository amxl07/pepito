"use client";

import { useState } from "react";

export default function Day7() {
    const [kisses, setKisses] = useState([]);

    const addKiss = (e) => {
        // Get coordinates relative to the container
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const id = Date.now();
        setKisses([...kisses, { id, x, y, rotation: Math.random() * 45 - 22 }]);

        // Auto remove after animation (optional, but keeps DOM clean)
        // setTimeout(() => setKisses(prev => prev.filter(k => k.id !== id)), 2000);
    };

    return (
        <div
            onClick={addKiss}
            style={{
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'crosshair',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div style={{ pointerEvents: 'none', textAlign: 'center', opacity: 0.5 }}>
                <h2>Kiss Day 💋</h2>
                <p>Give me a kiss (click anywhere)</p>
            </div>

            {kisses.map((k) => (
                <span
                    key={k.id}
                    style={{
                        position: 'absolute',
                        left: k.x,
                        top: k.y,
                        transform: `translate(-50%, -50%) rotate(${k.rotation}deg)`,
                        fontSize: '2rem',
                        pointerEvents: 'none',
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    💋
                </span>
            ))}

            <style jsx>{`
        @keyframes popIn {
            0% { transform: translate(-50%, -50%) scale(0); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
        </div>
    );
}
