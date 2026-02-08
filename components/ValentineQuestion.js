"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ValentineQuestion.module.css";

// Different texts for the "No" button as attempts increase
const NO_BUTTON_TEXTS = [
    "No 😌",
    "Are you sure? 🤔",
    "Really?? 😢",
    "Pretty please? 🥺",
    "I'll be sad... 💔",
    "Think again! 😤",
    "You can't escape! 🏃",
    "YES is the only way! 💖",
    "I'm shrinking... 😭",
    "...",
    "🥺",
];

// Different question variations for different visits
const QUESTION_VARIATIONS = [
    { title: "Pepito, Will you be my Valentine?", subtitle: "💕" },
    { title: "Hey beautiful, one more time...", subtitle: "Will you be my Valentine? 💖" },
    { title: "I have to ask again...", subtitle: "Pepito, be my Valentine? 🌹" },
    { title: "You know the drill, my love!", subtitle: "Valentine? Yes? 💝" },
    { title: "Every day I'll ask...", subtitle: "Will you be mine, Pepito? 💗" },
];

const CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6', '#c9b1ff'];

export default function ValentineQuestion({ onYes, visitCount = 0 }) {
    const [noPos, setNoPos] = useState({ x: 0, y: 0 });
    const [attempts, setAttempts] = useState(0);
    const [yesScale, setYesScale] = useState(1);
    const [noScale, setNoScale] = useState(1);
    const [showConfetti, setShowConfetti] = useState(false);
    const containerRef = useRef(null);

    const questionIndex = visitCount % QUESTION_VARIATIONS.length;
    const question = QUESTION_VARIATIONS[questionIndex];

    const moveNoButton = () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // Increase range with more attempts
        const range = Math.min(150 + attempts * 30, 300);

        const x = (Math.random() - 0.5) * range * 2;
        const y = (Math.random() - 0.5) * range * 2;

        setNoPos({ x, y });
        setAttempts((prev) => prev + 1);

        // Make YES button grow
        setYesScale((prev) => Math.min(prev + 0.05, 1.5));

        // Make NO button shrink after 5 attempts
        if (attempts >= 5) {
            setNoScale((prev) => Math.max(prev - 0.1, 0.3));
        }
    };

    const handleYes = () => {
        setShowConfetti(true);
        // Slight delay for confetti to be visible
        setTimeout(() => {
            onYes();
        }, 1200);
    };

    const getNoButtonText = () => {
        if (attempts >= NO_BUTTON_TEXTS.length) {
            return NO_BUTTON_TEXTS[NO_BUTTON_TEXTS.length - 1];
        }
        return NO_BUTTON_TEXTS[attempts];
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {/* Confetti effect */}
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti-piece"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                                animationDelay: `${Math.random() * 0.5}s`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className={`${styles.questionWrap} fade-in`}>
                <h1 className={styles.title}>{question.title}</h1>
                <p className={styles.subtitle}>{question.subtitle}</p>
            </div>

            <div className={styles.buttons}>
                <button
                    className={`${styles.yesBtn} ${attempts > 2 ? 'heartbeat' : ''}`}
                    onClick={handleYes}
                    style={{
                        transform: `scale(${yesScale})`,
                        transition: 'transform 0.3s ease'
                    }}
                >
                    YES 💖
                </button>

                <button
                    className={styles.noBtn}
                    style={{
                        transform: `translate(${noPos.x}px, ${noPos.y}px) scale(${noScale})`,
                        opacity: noScale < 0.5 ? 0.3 : 1,
                    }}
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton}
                    onClick={moveNoButton}
                >
                    {getNoButtonText()}
                </button>
            </div>

            {attempts > 3 && (
                <p className={`${styles.hint} fade-in`}>
                    Psst... just click Yes! 😉
                </p>
            )}
        </div>
    );
}
