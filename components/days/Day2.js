"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Day2.module.css";

// Photos for celebration
const PHOTOS = [
    "/Propose-Day-pics/IMG_1013.jpg",
    "/Propose-Day-pics/IMG_1486.JPG",
    "/Propose-Day-pics/IMG_2010.JPG",
    "/Propose-Day-pics/IMG_2809.JPG",
    "/Propose-Day-pics/IMG_3249.jpg",
    "/Propose-Day-pics/IMG_3253.JPG",
    "/Propose-Day-pics/IMG_3569.JPG",
    "/Propose-Day-pics/IMG_3572.JPG",
];

const FINAL_LETTER = `My dearest Bubbleyum Princess,

You are the most beautiful thing that ever happened to me,
And simply being with you is all my heart ever needs.

Forever yours,
Kitty 💕`;

// Message to form with stars
const MESSAGE = "Will you be mine forever?";

// Generate star positions for each letter - improved spacing
const generateConstellationStars = () => {
    const stars = [];
    const chars = MESSAGE.split('');
    let letterIndex = 0;

    chars.forEach((char, index) => {
        if (char === ' ') return;

        // Calculate position with better spacing
        const totalLetters = MESSAGE.replace(/\s/g, '').length;
        const progress = letterIndex / (totalLetters - 1);

        // Two-line layout for better readability
        let xBase, yBase;
        if (letterIndex < 11) { // "Will you be"
            const lineProgress = letterIndex / 10;
            xBase = 15 + (lineProgress * 70);
            yBase = 38;
        } else { // "mine forever?"
            const lineProgress = (letterIndex - 11) / 9;
            xBase = 20 + (lineProgress * 60);
            yBase = 52;
        }

        // Slight offset for organic feel
        const x = xBase + (Math.random() - 0.5) * 2;
        const y = yBase + (Math.random() - 0.5) * 2;

        stars.push({
            id: letterIndex,
            char: char,
            x: x,
            y: y,
            originalIndex: index,
            delay: letterIndex * 0.03
        });

        letterIndex++;
    });

    return stars;
};

// Background ambient stars with depth
const generateAmbientStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `ambient-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 2,
        opacity: 0.15 + Math.random() * 0.35,
        twinkleDelay: Math.random() * 8,
        twinkleDuration: 3 + Math.random() * 4
    }));
};

export default function Day2() {
    const [constellationStars, setConstellationStars] = useState([]);
    const [ambientStars, setAmbientStars] = useState([]);
    const [litStars, setLitStars] = useState(new Set());
    const [phase, setPhase] = useState('intro'); // 'intro', 'connecting', 'revealed', 'complete', 'celebration'
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showHint, setShowHint] = useState(true);
    const containerRef = useRef(null);

    // Initialize stars on mount
    useEffect(() => {
        setConstellationStars(generateConstellationStars());
        setAmbientStars(generateAmbientStars(200));

        // Hide hint after first interaction
        const timer = setTimeout(() => {
            if (litStars.size === 0) setShowHint(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Phase transitions
    useEffect(() => {
        const totalLetters = MESSAGE.replace(/\s/g, '').length;

        if (litStars.size > 0 && phase === 'intro') {
            setPhase('connecting');
            setShowHint(false);
        }

        if (litStars.size >= totalLetters && phase === 'connecting') {
            // Delay before showing revealed message
            setTimeout(() => setPhase('revealed'), 800);
        }
    }, [litStars, phase]);

    // Show button after message reveal
    useEffect(() => {
        if (phase === 'revealed') {
            const timer = setTimeout(() => setPhase('complete'), 2000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Track mouse for parallax
    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x: x * 0.5, y: y * 0.5 });
    }, []);

    // Light up a star on hover/touch
    const handleStarInteract = useCallback((starId) => {
        setLitStars(prev => {
            if (prev.has(starId)) return prev;
            const newSet = new Set(prev);
            newSet.add(starId);
            return newSet;
        });
    }, []);

    // Handle YES click
    const handleYes = () => {
        setPhase('celebration');
    };

    // Calculate progress percentage
    const totalLetters = MESSAGE.replace(/\s/g, '').length;
    const progress = (litStars.size / totalLetters) * 100;

    // Celebration screen
    if (phase === 'celebration') {
        return (
            <div className={styles.container}>
                <div className={styles.celebrationBg}>
                    <div className={styles.bgGlow1}></div>
                    <div className={styles.bgGlow2}></div>
                </div>



                {/* Ambient stars */}
                <div className={styles.starsLayer}>
                    {ambientStars.map(star => (
                        <div
                            key={star.id}
                            className={styles.ambientStar}
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                '--opacity': star.opacity,
                                '--delay': `${star.twinkleDelay}s`,
                                '--duration': `${star.twinkleDuration}s`
                            }}
                        />
                    ))}
                </div>

                <div className={styles.celebrationContent}>
                    <h1 className={styles.celebrationTitle}>
                        <span className={styles.titleWord}>Forever</span>
                        <span className={styles.titleHeart}>💕</span>
                        <span className={styles.titleWord}>Yours</span>
                    </h1>

                    <div className={styles.photoGrid}>
                        {PHOTOS.map((photo, index) => (
                            <div
                                key={index}
                                className={styles.photoCard}
                                style={{ '--delay': `${0.1 + index * 0.08}s` }}
                            >
                                <div
                                    className={styles.photoImage}
                                    style={{ backgroundImage: `url(${photo})` }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={styles.letterContainer}>
                        <div className={styles.letterContent}>
                            <pre className={styles.letterText}>{FINAL_LETTER}</pre>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    return (
        <div
            ref={containerRef}
            className={styles.container}
            onMouseMove={handleMouseMove}
        >
            {/* Deep space background with parallax */}
            <div className={styles.spaceBackground}>
                <div
                    className={styles.nebula1}
                    style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
                />
                <div
                    className={styles.nebula2}
                    style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
                />
                <div
                    className={styles.nebula3}
                    style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
                />
            </div>

            {/* Stars layers with parallax depth */}
            <div
                className={`${styles.starsLayer} ${styles.layerFar}`}
                style={{ transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)` }}
            >
                {ambientStars.slice(0, 70).map(star => (
                    <div
                        key={star.id}
                        className={styles.ambientStar}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size * 0.6}px`,
                            height: `${star.size * 0.6}px`,
                            '--opacity': star.opacity * 0.5,
                            '--delay': `${star.twinkleDelay}s`,
                            '--duration': `${star.twinkleDuration}s`
                        }}
                    />
                ))}
            </div>

            <div
                className={`${styles.starsLayer} ${styles.layerMid}`}
                style={{ transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)` }}
            >
                {ambientStars.slice(70, 140).map(star => (
                    <div
                        key={star.id}
                        className={styles.ambientStar}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            '--opacity': star.opacity,
                            '--delay': `${star.twinkleDelay}s`,
                            '--duration': `${star.twinkleDuration}s`
                        }}
                    />
                ))}
            </div>

            <div
                className={`${styles.starsLayer} ${styles.layerNear}`}
                style={{ transform: `translate(${mousePos.x * -28}px, ${mousePos.y * -28}px)` }}
            >
                {ambientStars.slice(140).map(star => (
                    <div
                        key={star.id}
                        className={styles.ambientStar}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size * 1.3}px`,
                            height: `${star.size * 1.3}px`,
                            '--opacity': star.opacity * 0.8,
                            '--delay': `${star.twinkleDelay}s`,
                            '--duration': `${star.twinkleDuration}s`
                        }}
                    />
                ))}
            </div>

            {/* Hint text */}
            <div className={`${styles.hintContainer} ${showHint ? styles.visible : ''}`}>
                <p className={styles.hintText}>Touch the stars...</p>
            </div>

            {/* Constellation Stars */}
            <div className={`${styles.constellationLayer} ${phase === 'revealed' || phase === 'complete' ? styles.fadeOut : ''}`}>
                {constellationStars.map((star) => {
                    const isLit = litStars.has(star.id);
                    return (
                        <div
                            key={star.id}
                            className={`${styles.starWrapper} ${isLit ? styles.lit : ''}`}
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                            }}
                            onMouseEnter={() => handleStarInteract(star.id)}
                            onTouchStart={() => handleStarInteract(star.id)}
                        >
                            <div className={styles.starOuter}>
                                <div className={styles.starCore}></div>
                            </div>
                            <span
                                className={`${styles.starLetter} ${isLit ? styles.show : ''}`}
                                style={{ '--delay': `${star.delay}s` }}
                            >
                                {star.char}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Revealed Message */}
            <div className={`${styles.messageOverlay} ${phase === 'revealed' || phase === 'complete' ? styles.visible : ''}`}>
                <h1 className={styles.revealedMessage}>
                    <span className={styles.messageLine}>Will you be</span>
                    <span className={styles.messageLine}>mine forever?</span>
                </h1>
            </div>

            {/* YES Button */}
            <div className={`${styles.buttonContainer} ${phase === 'complete' ? styles.visible : ''}`}>
                <button className={styles.yesButton} onClick={handleYes}>
                    <span className={styles.buttonText}>Yes, Forever</span>
                    <span className={styles.buttonIcon}>💕</span>
                </button>
            </div>

            {/* Progress indicator */}
            <div className={styles.progressContainer}>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className={styles.progressLabel}>{litStars.size} / {totalLetters}</span>
            </div>
        </div>
    );
}
