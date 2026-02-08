"use client";

import { useState, useEffect } from "react";
import styles from "./Day1.module.css";
import Image from "next/image";

const PHOTOS = [
    "/Rose-Day-pics/FullSizeRender.jpg",
    "/Rose-Day-pics/IMG_2819.jpg",
    "/Rose-Day-pics/IMG_3267.jpg",
    "/Rose-Day-pics/IMG_3665.JPG",
    "/Rose-Day-pics/IMG_4662.JPG",
];

const STAGES = [
    {
        id: 0,
        title: "The Seed of Us",
        instruction: "",
        action: "Plant the Seed",
        growthIcon: "",
        image: null
    },
    {
        id: 1,
        title: "A Small Beginning",
        instruction: "",
        action: "Nurture it",
        growthIcon: "",
        image: PHOTOS[0],
        caption: "It started small... with just a smile 😊"
    },
    {
        id: 2,
        title: "Growing Stronger",
        instruction: "",
        action: "Give Light",
        growthIcon: "",
        image: PHOTOS[1],
        caption: "Your light made it bloom into something magical ✨"
    },
    {
        id: 3,
        title: "Tears of Joy",
        instruction: "",
        action: "Feel Love",
        growthIcon: "",
        image: PHOTOS[2],
        caption: "Something small turned into tears of joy 🌹"
    },
    {
        id: 4,
        title: "Blossoming World",
        instruction: "",
        action: "See Beauty",
        growthIcon: "",
        image: PHOTOS[3],
        caption: "You make my entire world blossom 🌸"
    },
    {
        id: 5,
        title: "Our Garden",
        instruction: "",
        action: "Walk into Forever",
        growthIcon: "",
        image: PHOTOS[4],
        caption: "And now, you are my garden of endless love 🌹"
    }
];

const FINAL_LETTER = `My dearest Pepito,

Just like this rose, my love for you has grown from a tiny seed into a beautiful garden.

You nurture my heart with your smiles, your care, and your beautiful presence.

You are, and always will be, my most precious flower.

Happy Rose Day, my love 🌹`;

export default function Day1() {
    const [currentStage, setCurrentStage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showFinal, setShowFinal] = useState(false);

    // Falling petals logic
    const [petals, setPetals] = useState([]);
    useEffect(() => {
        const petalEmojis = ['🌸', '🌹', '🌷', '✨'];
        const newPetals = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            emoji: petalEmojis[i % petalEmojis.length],
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4
        }));
        setPetals(newPetals);
    }, []);

    const handleAction = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Trigger growth animation
        setTimeout(() => {
            if (currentStage < STAGES.length - 1) {
                setCurrentStage(prev => prev + 1);
                setIsAnimating(false);
            } else {
                setShowFinal(true);
            }
        }, 1500);
    };

    if (showFinal) {
        return (
            <div className={styles.container}>
                <div className={styles.finalWrapper}>
                    <h1 className={styles.finalTitle}>My Garden of Love 🌹</h1>

                    <div className={styles.collageGrid}>
                        {PHOTOS.map((photo, index) => (
                            <div key={index}
                                className={styles.collageItem}
                                style={{ animationDelay: `${index * 0.2}s` }}>
                                <div className={styles.photoInner} style={{ backgroundImage: `url(${photo})` }} />
                            </div>
                        ))}
                    </div>

                    <div className={styles.letterContainer}>
                        <pre className={styles.letterText}>{FINAL_LETTER}</pre>
                    </div>
                </div>
            </div>
        );
    }

    const stageData = STAGES[currentStage];

    return (
        <div className={styles.container}>
            {/* Background Petals */}
            <div className={styles.petalsContainer}>
                {petals.map(p => (
                    <span key={p.id} className={styles.petal}
                        style={{
                            left: `${p.left}%`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`
                        }}>
                        {p.emoji}
                    </span>
                ))}
            </div>

            <div className={styles.layoutWrapper}>

                {/* 1. Header Area: Subtle Title */}
                <header className={styles.header}>
                    <span className={styles.miniTitle}>Rose Day Journey</span>
                    <h2 className={`${styles.stageTitle} ${styles.fadeIn}`}>{stageData.title}</h2>
                </header>

                {/* 2. Hero Content: Photo & Caption */}
                <main className={styles.heroSection}>
                    {stageData.image ? (
                        <div className={`${styles.photoFrame} ${styles.popIn}`} key={currentStage}>
                            <div className={styles.photo} style={{ backgroundImage: `url(${stageData.image})` }} />
                            <div className={styles.photoOverlay} />
                        </div>
                    ) : (
                        // Placeholder for Seed Stage
                        <div className={`${styles.seedPlaceholder} ${styles.pulse}`}>
                            <span className={styles.seedIcon}>🌱</span>
                        </div>
                    )}

                    <div className={styles.captionWrapper}>
                        {stageData.caption && (
                            <p className={`${styles.caption} ${styles.fadeInDelay}`}>{stageData.caption}</p>
                        )}
                        <p className={styles.instruction}>{stageData.instruction}</p>
                    </div>
                </main>

                {/* 3. Footer Area: Controls */}
                <footer className={styles.controlsFooter}>
                    <div className={styles.controlsWrapper}>
                        <button className={styles.actionBtn} onClick={handleAction} disabled={isAnimating}>
                            <span className={styles.btnText}>{stageData.action}</span>
                            <span className={styles.btnIcon}>{stageData.growthIcon}</span>
                        </button>
                    </div>
                </footer>

            </div>
        </div>
    );
}
