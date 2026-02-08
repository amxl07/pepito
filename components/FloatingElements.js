"use client";

import { useEffect, useState } from "react";

const ELEMENTS = [
    { emoji: "🌸", size: 1.2 },
    { emoji: "🌹", size: 1.0 },
    { emoji: "🌷", size: 1.1 },
    { emoji: "💕", size: 0.9 },
    { emoji: "💗", size: 0.8 },
    { emoji: "✨", size: 0.7 },
    { emoji: "💫", size: 0.8 },
    { emoji: "🌺", size: 1.0 },
    { emoji: "🦋", size: 0.9 },
    { emoji: "💖", size: 0.85 },
];

export default function FloatingElements() {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        // Create 15 floating elements
        const newElements = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            ...ELEMENTS[i % ELEMENTS.length],
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 6,
        }));
        setElements(newElements);
    }, []);

    return (
        <div className="floating-elements-container">
            {elements.map((el) => (
                <span
                    key={el.id}
                    className="floating-element"
                    style={{
                        left: `${el.left}%`,
                        fontSize: `${el.size}rem`,
                        animationDelay: `${el.delay}s`,
                        animationDuration: `${el.duration}s`,
                    }}
                >
                    {el.emoji}
                </span>
            ))}
        </div>
    );
}
