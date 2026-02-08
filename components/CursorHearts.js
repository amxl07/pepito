"use client";

import { useEffect, useState } from "react";

export default function CursorHearts() {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (Math.random() > 0.1) return; // Limit frequency

            const id = Date.now();
            const newHeart = {
                id,
                x: e.clientX,
                y: e.clientY,
                scale: Math.random() * 0.5 + 0.5
            };

            setHearts(prev => [...prev, newHeart]);

            setTimeout(() => {
                setHearts(prev => prev.filter(h => h.id !== id));
            }, 1000);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
            {hearts.map(h => (
                <div key={h.id} style={{
                    position: 'absolute',
                    left: h.x,
                    top: h.y,
                    fontSize: '1rem',
                    transform: `translate(-50%, -50%) scale(${h.scale})`,
                    animation: 'floatUp 1s ease-out forwards',
                    opacity: 0.6
                }}>
                    ❤️
                </div>
            ))}
            <style jsx>{`
        @keyframes floatUp {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
            100% { transform: translate(-50%, -100%) scale(0); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
