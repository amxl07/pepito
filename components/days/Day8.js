"use client";

import { useState } from "react";

export default function Day8() {

    const saveLetter = () => {
        const text = `
My Dearest Pepito,

If you are reading this, it means you made it through a week of my silly digital surprises.
Thank you for playing along.

This website was just a small way to show you what you mean to me.
Every click, every rose, every reveal... it was all just an excuse to make you smile.

This website ends today.
But choosing you doesn't.
I will choose you tomorrow, and the day after, and every day that follows.

You are my favorite notification.
My favorite plan.
My valentine.

With all my love,
[Your Name]
    `.trim();

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "For_Pepito.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fade-in" style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100%',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '30px' }}>Happy Valentine's Day ❤️</h1>

            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '5px',
                boxShadow: '0 5px 30px rgba(0,0,0,0.05)',
                marginBottom: '40px',
                textAlign: 'left',
                lineHeight: '1.8',
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.1rem'
            }}>
                <p>My Dearest Pepito,</p>
                <br />
                <p>If you are reading this, it means you made it through a week of my silly digital surprises.</p>
                <p>Thank you for playing along.</p>
                <br />
                <p>This website was just a small way to show you what you mean to me.</p>
                <p>Every click, every rose, every reveal... it was all just an excuse to make you smile.</p>
                <br />
                <p>This website ends today.</p>
                <p>But choosing you doesn't.</p>
                <br />
                <p>You are my favorite notification.</p>
                <p>My favorite plan.</p>
                <p>My valentine.</p>
            </div>

            <button
                onClick={saveLetter}
                style={{
                    background: 'var(--text-accent)',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '30px',
                    fontSize: '1rem',
                    opacity: 0.8,
                    transition: 'opacity 0.2s'
                }}
            >
                Save this forever 💾
            </button>
        </div>
    );
}
