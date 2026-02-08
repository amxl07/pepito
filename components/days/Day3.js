"use client";

import { useState } from "react";

const REASONS = [
    "You're sweeter than this.",
    "Your smile = 100% cocoa.",
    "You make life delicious.",
    "Best snack ever.",
    "Addicting like sugar.",
    "My favorite treat."
];

export default function Day3() {
    const [eaten, setEaten] = useState([]);

    const bite = (index) => {
        if (!eaten.includes(index)) {
            setEaten([...eaten, index]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', marginTop: '50px' }}>
            <h2>Break a piece 🍫</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                background: '#5d4037',
                padding: '10px',
                borderRadius: '5px'
            }}>
                {REASONS.map((txt, i) => (
                    <div
                        key={i}
                        onClick={() => bite(i)}
                        style={{
                            width: '120px',
                            height: '100px',
                            background: eaten.includes(i) ? 'transparent' : '#795548',
                            border: '2px solid #5d4037',
                            display: 'flex', // Center hidden text
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'opacity 0.2s' // Fade out the chocolate
                        }}
                    >
                        {/* The chocolate piece cover */}
                        {!eaten.includes(i) && (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                border: '4px solid #8d6e63', // 3D effect top
                                boxSizing: 'border-box'
                            }}></div>
                        )}

                        {/* The reveal under (placed absolutely in container or just rendered when eaten?) */}
                        {/* Actually, let's put the text in a separate container below or make this transparent to reveal text behind? 
                    Simplest is: Text appears in a list below as you eat, OR text replaces the chocolate.
                    Let's utilize the empty space. */}
                    </div>
                ))}
            </div>

            <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {eaten.map((i) => (
                    <p key={i} className="fade-in" style={{ color: '#5d4037', fontWeight: 'bold' }}>{REASONS[i]}</p>
                ))}
                {eaten.length === 6 && <p className="fade-in" style={{ marginTop: '20px' }}>All gone! But I'm still here. 😘</p>}
            </div>
        </div>
    );
}
