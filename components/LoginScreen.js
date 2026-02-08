"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const PLACEHOLDER_TEXTS = [
    "Type your name...",
    "Who's my favorite person?",
    "Hint: It starts with P 💕",
    "Think... who loves you?",
];

export default function LoginScreen() {
    const { login } = useAuth();
    const [pass, setPass] = useState("");
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [typedTitle, setTypedTitle] = useState("");
    const fullTitle = "Who are you, beautiful? 💕";

    // Typewriter effect for title
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i <= fullTitle.length) {
                setTypedTitle(fullTitle.slice(0, i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 60);
        return () => clearInterval(timer);
    }, []);

    // Rotate placeholder text
    useEffect(() => {
        const timer = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!login(pass)) {
            setError(true);
            setShake(true);
            setTimeout(() => {
                setShake(false);
                setError(false);
            }, 1500);
        }
    };

    const errorMessages = [
        "That's not Pepito! 🥺",
        "Hmm... try again, cutie!",
        "Only Pepito knows the way 💖",
        "Not quite right... 🤔",
    ];

    return (
        <div className="login-container fade-in">
            {/* Floating hearts background */}
            <div className="floating-hearts">
                {[...Array(8)].map((_, i) => (
                    <span
                        key={i}
                        className="floating-heart"
                        style={{
                            left: `${10 + i * 12}%`,
                            animationDelay: `${i * 0.5}s`,
                            fontSize: `${1 + Math.random() * 1.5}rem`,
                        }}
                    >
                        {['💕', '💖', '💗', '💓', '❤️', '🌸', '✨', '💫'][i]}
                    </span>
                ))}
            </div>

            <form
                onSubmit={handleSubmit}
                className={shake ? 'shake' : ''}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '25px',
                    zIndex: 10,
                    position: 'relative'
                }}
            >
                <h1
                    style={{
                        fontSize: '1.8rem',
                        opacity: 0.9,
                        minHeight: '2.5rem',
                        background: 'linear-gradient(135deg, var(--text-accent), #ff8a80)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {typedTitle}
                    <span className="cursor-blink">|</span>
                </h1>

                <input
                    type="text"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
                    className="login-input"
                    style={{
                        borderColor: error ? 'var(--text-accent)' : 'rgba(209, 77, 77, 0.3)',
                    }}
                    autoFocus
                />

                {error && (
                    <p
                        className="fade-in"
                        style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-accent)',
                            textAlign: 'center'
                        }}
                    >
                        {errorMessages[Math.floor(Math.random() * errorMessages.length)]}
                    </p>
                )}

                <button
                    type="submit"
                    className="login-btn pulse"
                >
                    Enter 💝
                </button>
            </form>
        </div>
    );
}
