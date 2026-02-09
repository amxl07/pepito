"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Day4.module.css";

const TEDDY_MESSAGES = [
    "I love you! 💖",
    "Soft hugs! ☁️",
    "You're magic! ✨",
    "So cozy... 🌸",
    "My favorite person! 😽",
    "Never let go! ❤️",
    "More cuddles! 🐾"
];

// Weighted Photo Selection: Propose Day (3x weight) > Rose Day (1x weight)
// Use only Propose Day photos
const RAW_PROPOSE_PICS = [
    "/Propose-Day-pics/IMG_3253.JPG",
    "/Propose-Day-pics/IMG_2010.JPG",
    "/Propose-Day-pics/IMG_1486.JPG",
    "/Propose-Day-pics/IMG_2809.JPG",
    "/Propose-Day-pics/IMG_3572.JPG",
    "/Propose-Day-pics/IMG_1013.jpg"
];

const WEIGHTED_PHOTOS = RAW_PROPOSE_PICS;

const FINAL_LETTER = `
My Dearest CocoBear,

Remember the day when we were walking by the arcade 
and I kept on asking if you wanted a teddy? 

You are the sweetest teddy bear I have in my life 
and it reminds me of how lucky I am to have you.
You are my safe place, my warmth, and my joy.

Happy Teddy Day! 🧸❤️
`;

const CUTE_TITLES = [
    "A core memory 🍯",
    "Just us ✨",
    "My happy place 🏡",
    "So precious 🥺",
    "Forever & Always ❤️",
    "You & Me 🤞",
    "My favorite view 😍",
    "Sweetest moments 🍬"
];

export default function Day4() {
    const [happiness, setHappiness] = useState(0);
    const [isHugging, setIsHugging] = useState(false);
    const [message, setMessage] = useState("Good morning coco Bear 💖");
    const [particles, setParticles] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);

    // Progression State
    const [hugCount, setHugCount] = useState(0);
    const [unlockedItem, setUnlockedItem] = useState(null); // { type: 'photo' | 'letter', content: string, title?: string }

    const teddyRef = useRef(null);
    const successRef = useRef(false);

    // Preload font
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Pacifico&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    // Hugging Logic
    useEffect(() => {
        let interval;
        if (isHugging && !showOverlay) {
            interval = setInterval(() => {
                setHappiness(prev => {
                    if (prev >= 100) {
                        if (!successRef.current) {
                            successRef.current = true;
                            handleHugComplete();
                        }
                        return 100;
                    }
                    if (prev % 20 === 0 && prev > 0) {
                        if (window.navigator?.vibrate) window.navigator.vibrate(20);
                        spawnParticle();
                    }
                    return prev + 1;
                });
            }, 30);
        } else if (!isHugging && happiness > 0 && !showOverlay) {
            interval = setInterval(() => {
                setHappiness(prev => Math.max(0, prev - 2));
            }, 30);
        }
        return () => clearInterval(interval);
    }, [isHugging, showOverlay, happiness]);

    const handleHugComplete = () => {
        // Increment BEFORE setting state to ensure logic uses new count
        // Actually, setHugCount is async, so we use the functional update or a local var
        // But here we rely on the current 'hugCount' from render scope for the logic, 
        // which represents *completed* hugs before this one. 
        // So this hug is hugCount + 1.

        const currentHug = hugCount + 1;
        setHugCount(currentHug);

        if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100, 50, 200]);

        // Progression Logic
        if (currentHug === 6) {
            // Unlock Letter (The Milestone)
            setUnlockedItem({ type: 'letter', content: FINAL_LETTER });
        } else {
            // Unlock Photo (Before and After the letter)
            const randomPhoto = WEIGHTED_PHOTOS[Math.floor(Math.random() * WEIGHTED_PHOTOS.length)];
            const randomTitle = CUTE_TITLES[Math.floor(Math.random() * CUTE_TITLES.length)];
            setUnlockedItem({ type: 'photo', content: randomPhoto, title: randomTitle });
        }

        setShowOverlay(true);
    };

    const spawnParticle = (x, y) => {
        const rect = teddyRef.current?.getBoundingClientRect();
        if (!rect) return;
        const startX = x || (rect.left + rect.width / 2);
        const startY = y || (rect.top + rect.height / 2);

        const id = Date.now() + Math.random();
        const newParticle = {
            id,
            x: startX + (Math.random() * 40 - 20),
            y: startY + (Math.random() * 40 - 20),
            tx: (Math.random() - 0.5) * 150 + 'px',
            ty: (Math.random() - 1) * 200 + 'px',
            rot: (Math.random() - 0.5) * 120 + 'deg'
        };
        setParticles(prev => [...prev, newParticle]);
        setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1200);
    };

    const startHug = (e) => {
        if (showOverlay) return;
        setIsHugging(true);
        setMessage("Hold... 💖");
        if (window.navigator?.vibrate) window.navigator.vibrate(50);
        spawnParticle();
    };

    const endHug = () => {
        setIsHugging(false);
        if (!showOverlay) {
            setMessage(happiness > 50 ? "Don't let go! 🥺" : "Hold me tight! ☁️");
        }
    };

    const handleNext = () => {
        setShowOverlay(false);
        setHappiness(0);
        successRef.current = false;
        setUnlockedItem(null);

        if (hugCount >= 6) {
            setMessage("More hugs? 🧸♾️");
        } else {
            setMessage(`Hug ${hugCount}/6 completed! More? 🧸`);
        }
    };

    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={`${styles.backgroundOrb} ${styles.orb1}`} />
            <div className={`${styles.backgroundOrb} ${styles.orb2}`} />
            <div className={`${styles.backgroundOrb} ${styles.orb3}`} />

            <div className={styles.glassCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Teddy Day</h1>
                    <p className={styles.subtitle}>
                        {hugCount >= 6 ? "INFINITE HUGS" : `HUG PROGRESS: ${hugCount}/6`}
                    </p>
                </div>

                <div className={styles.teddyPedestal}>
                    <div className={styles.chatBubble} key={message} style={{ opacity: 1 }}>
                        {message}
                    </div>
                    <div className={styles.cloudBase} />
                    <div
                        ref={teddyRef}
                        className={`${styles.teddy} ${isHugging ? styles.hugging : ''}`}
                        onMouseDown={startHug} onMouseUp={endHug} onMouseLeave={endHug}
                        onTouchStart={(e) => { e.preventDefault(); startHug(e); }}
                        onTouchEnd={endHug}
                    >
                        🧸
                        {particles.map(p => (
                            <div key={p.id} className={styles.particle} style={{ top: p.y, left: p.x, '--tx': p.tx, '--ty': p.ty, '--rot': p.rot }}>
                                {Math.random() > 0.5 ? '❤️' : '✨'}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.meterWrapper}>
                    <div className={styles.meterLabel}>
                        <span>Cuddle Meter</span>
                        <span>{Math.round(happiness)}%</span>
                    </div>
                    <div className={styles.meterContainer}>
                        <div className={styles.meterFill} style={{ width: `${happiness}%` }} />
                    </div>
                </div>
            </div>

            {/* Unlock Overlay */}
            {showOverlay && (
                <div className={styles.overlay}>
                    <div className={styles.celebrationCard}>
                        {unlockedItem?.type === 'letter' ? (
                            <div className={styles.letterContainer}>
                                <div className={styles.waxSeal}>💌</div>
                                <h2 className={styles.letterTitle}>Process Complete!</h2>
                                <div className={styles.letterContent}>
                                    {unlockedItem.content}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{unlockedItem?.title || "Memory Unlocked!"}</div>
                                <div className={styles.polaroidContainer}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={unlockedItem?.content} alt="Memory" className={styles.polaroidImage} />
                                    <div className={styles.polaroidCaption}>Hug #{hugCount} ❤️</div>
                                </div>
                            </>
                        )}

                        <button className={styles.restartBtn} onClick={handleNext} style={{ marginTop: '20px' }}>
                            {hugCount >= 6 ? "Hug Again" : "Next Hug"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

