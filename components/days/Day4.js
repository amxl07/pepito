"use client";

import { useState } from "react";

export default function Day4() {
    const [hugged, setHugged] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
            <h2 className="fade-in">Teddy Day 🧸</h2>

            <div
                onClick={() => setHugged(prev => !prev)}
                style={{
                    fontSize: '10rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    transform: hugged ? 'scale(0.9) translateY(10px)' : 'scale(1)',
                    userSelect: 'none'
                }}
            >
                🧸
            </div>

            <p className="fade-in" style={{ textAlign: 'center', maxWidth: '300px' }}>
                {hugged
                    ? "Warm, fuzzy, and yours forever."
                    : "When I can’t be there… imagine this little guy stealing my job."}
            </p>
        </div>
    );
}
