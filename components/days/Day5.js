"use client";

import { useState } from "react";

const PROMISES = [
    "I promise to listen to you.",
    "I promise to be your biggest fan.",
    "I promise to always make time for us.",
    "I promise to share my food (mostly).",
    "I promise to love you, even when you're hangry.",
    "I promise to choose you every single day."
];

export default function Day5() {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="fade-in" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '30px' }}>Promises 🤞</h2>

            {!agreed ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
                    {PROMISES.map((p, i) => (
                        <div key={i} style={{
                            padding: '15px',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            opacity: 0,
                            animation: `fadeIn 0.5s ease forwards ${i * 0.5}s`
                        }}>
                            {p}
                        </div>
                    ))}

                    <button
                        onClick={() => setAgreed(true)}
                        style={{
                            background: 'var(--text-accent)',
                            color: 'white',
                            padding: '15px 30px',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            marginTop: '20px',
                            opacity: 0,
                            animation: `fadeIn 0.5s ease forwards ${PROMISES.length * 0.5 + 0.5}s`
                        }}
                    >
                        I trust you ❤️
                    </button>
                </div>
            ) : (
                <div style={{ marginTop: '50px' }}>
                    <h1 style={{ fontSize: '4rem' }}>🤝</h1>
                    <h3>Promise kept.</h3>
                </div>
            )}
        </div>
    );
}
