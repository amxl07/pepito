"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Day7.module.css";

// ── Photos for celebration ──
const POLAROID_PHOTO = "/Propose-Day-pics/IMG_3572.JPG";
const PHOTOS = [
    "/Propose-Day-pics/IMG_1013.jpg",
    "/Propose-Day-pics/IMG_2010.JPG",
    "/Propose-Day-pics/IMG_3253.JPG",
    "/Propose-Day-pics/IMG_2809.JPG",
];

const FINAL_LETTER = `My dearest Sanghudu,

Every kiss from you feels like a tiny promise —
a promise that this, us, is real and magical.

Your lips are the sweetest place I've ever known,
and I could spend forever just getting lost there.

Here's a kiss for every moment I've fallen 
for you all over again.

Sealed with all my love 💋💕`;

// ── Falling Items Config ──
const ITEMS = ['💋', '❤️', '💖', '💌', '🌹', '✨'];
const SPECIAL_ITEMS = ['💋', '💖']; // Worth more or special effect
const SPAWN_RATE = 800; // ms between spawns
const GRAVITY = 2; // pixel speed down

const TOTAL_SCORE_NEEDED = 20;

export default function Day7() {
    const [phase, setPhase] = useState('game'); // 'game' | 'kiss' | 'explosion' | 'celebration'

    // Game State
    const [score, setScore] = useState(0);
    const [basketX, setBasketX] = useState(50); // percentage 0-100
    const [items, setItems] = useState([]); // { id, x (%), y (px), emoji, speed }
    const [effects, setEffects] = useState([]); // { id, x, y, type: 'catch'|'text', content }

    // Kiss/Hold State (Phase 2)
    const [kissProgress, setKissProgress] = useState(0);
    const [isPressing, setIsPressing] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [explosionParticles, setExplosionParticles] = useState([]);

    // Refs for game loop
    const requestRef = useRef();
    const lastSpawnTime = useRef(0);
    const basketRef = useRef(null);
    const scoreRef = useRef(0);
    const gameContainerRef = useRef(null);

    // ── GAME LOOP ──
    const updateGame = (time) => {
        if (phase !== 'game') return;

        // Spawn new items
        if (time - lastSpawnTime.current > SPAWN_RATE) {
            const newItem = {
                id: Date.now(),
                x: Math.random() * 90 + 5, // 5% to 95%
                y: -50,
                emoji: ITEMS[Math.floor(Math.random() * ITEMS.length)],
                isGolden: Math.random() > 0.8, // 20% chance
                speed: 3 + Math.random() * 3, // Random speed
            };
            setItems(prev => [...prev, newItem]);
            lastSpawnTime.current = time;
        }

        // Update items position and check collisions
        setItems(prevItems => {
            const nextItems = [];
            const containerH = window.innerHeight;
            const basketY = containerH - 80; // approximate basket top
            const basketW_Percent = 20; // approximate basket width in % (depends on screen width)

            prevItems.forEach(item => {
                const nextY = item.y + item.speed;

                // Collision Detection
                // Simple box collision: if item is low enough AND within basket X range
                // We use percentage for X to make it responsive
                const basketLeft = basketX - 10; // basketX is center, width approx 20%
                const basketRight = basketX + 10;

                let caught = false;
                if (nextY > basketY - 30 && nextY < basketY + 30) {
                    if (item.x > basketLeft && item.x < basketRight) {
                        caught = true;
                        handleCatch(item);
                    }
                }

                // Keep item if not caught and not off screen
                if (!caught && nextY < containerH + 50) {
                    nextItems.push({ ...item, y: nextY });
                }
            });
            return nextItems;
        });

        requestRef.current = requestAnimationFrame(updateGame);
    };

    useEffect(() => {
        if (phase === 'game') {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [phase, basketX]); // Depend on basketX to ensure collision uses latest pos? actually loop closes over valid state if using refs or functional updates.

    // ── INPUT HANDLERS ──
    const handleMove = useCallback((clientX) => {
        const width = window.innerWidth;
        const x = (clientX / width) * 100;
        setBasketX(Math.max(10, Math.min(90, x))); // Clamp between 10% and 90%
    }, []);

    const onTouchMove = (e) => handleMove(e.touches[0].clientX);
    const onMouseMove = (e) => handleMove(e.clientX);

    // ── GAME LOGIC ──
    const handleCatch = (item) => {
        // Haptics
        if (window.navigator?.vibrate) window.navigator.vibrate(20);

        // Update Score
        const points = item.isGolden ? 3 : 1;
        const newScore = scoreRef.current + points;
        scoreRef.current = newScore;
        setScore(newScore);

        // Add Effects
        const effectId = Date.now() + Math.random();
        setEffects(prev => [
            ...prev,
            { id: effectId, x: item.x, y: window.innerHeight - 100, type: 'catch', content: `+${points}` },
            { id: effectId + 1, x: item.x, y: window.innerHeight - 100, type: 'sparkle', content: '✨' }
        ]);

        // Remove effect after animation
        setTimeout(() => {
            setEffects(prev => prev.filter(e => e.id !== effectId && e.id !== effectId + 1));
        }, 1000);

        // Win Condition
        if (newScore >= TOTAL_SCORE_NEEDED) {
            setTimeout(() => setPhase('kiss'), 500);
        }
    };

    // ── PHASE 2: BIG KISS HOLD (Retained logic) ──
    const kissStartTime = useRef(null);
    const animFrameRef = useRef(null);
    const KISS_HOLD_DURATION = 3000;

    const startKiss = useCallback((e) => {
        e.preventDefault();
        setIsPressing(true);
        kissStartTime.current = performance.now() - (kissProgress / 100) * KISS_HOLD_DURATION;

        if (window.navigator?.vibrate) window.navigator.vibrate(30);

        const animate = (now) => {
            const elapsed = now - kissStartTime.current;
            const progress = Math.min((elapsed / KISS_HOLD_DURATION) * 100, 100);
            setKissProgress(progress);

            if (progress >= 100) {
                triggerExplosion();
                return;
            }
            animFrameRef.current = requestAnimationFrame(animate);
        };
        animFrameRef.current = requestAnimationFrame(animate);
    }, [kissProgress]);

    const endKiss = useCallback(() => {
        setIsPressing(false);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

        // Decay progress
        if (phase === 'kiss' && kissProgress < 100) {
            const decay = () => {
                setKissProgress(prev => {
                    if (prev <= 0 || isPressing) return prev;
                    const next = prev - 2;
                    if (next > 0) requestAnimationFrame(decay);
                    return Math.max(0, next);
                });
            };
            requestAnimationFrame(decay);
        }
    }, [phase, kissProgress, isPressing]);

    const triggerExplosion = () => {
        setIsPressing(false);
        cancelAnimationFrame(animFrameRef.current);
        if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 200]);
        setShowFlash(true);

        // Explosion particles - all kisses!
        const particles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            ex: Math.cos(i * 12) * 200 + 'px',
            ey: Math.sin(i * 12) * 200 + 'px',
            er: Math.random() * 360 + 'deg',
            emoji: '💋'
        }));
        setExplosionParticles(particles);
        setPhase('explosion');

        setTimeout(() => setPhase('celebration'), 1500);
    };

    // ── RENDER HELPERS ──
    const progressPct = Math.min(100, (score / TOTAL_SCORE_NEEDED) * 100);
    const strokeDashoffset = (2 * Math.PI * 95) * (1 - kissProgress / 100);

    return (
        <div
            className={`${styles.container} ${score > 5 ? styles.warm1 : ''} ${score > 10 ? styles.warm2 : ''}`}
            onMouseMove={phase === 'game' ? onMouseMove : null}
            onTouchMove={phase === 'game' ? onTouchMove : null}
            ref={gameContainerRef}
        >
            {/* PHASE 1: CATCHER GAME */}
            {phase === 'game' && (
                <>
                    {/* HUD */}
                    <div className={styles.hud}>
                        <h1 className={styles.title}>Catch the Kiss! 💋</h1>
                        <p className={styles.subtitle}>Drag the basket to catch them</p>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className={styles.scoreText}>{score} / {TOTAL_SCORE_NEEDED}</span>
                    </div>

                    {/* Basket */}
                    <div
                        className={styles.basket}
                        style={{ left: `${basketX}%` }}
                        ref={basketRef}
                    >
                        <div className={styles.basketEmoji}>🧺</div>
                    </div>

                    {/* Falling Items */}
                    <div className={styles.gameLayer}>
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`${styles.fallingItem} ${item.isGolden ? styles.goldenItem : ''}`}
                                style={{ left: `${item.x}%`, top: `${item.y}px` }}
                            >
                                {item.emoji}
                            </div>
                        ))}
                    </div>

                    {/* Effects */}
                    {effects.map(effect => (
                        <div
                            key={effect.id}
                            className={effect.type === 'catch' ? styles.catchEffect : styles.sparkle}
                            style={{ left: `${effect.x}%`, top: `${effect.y}px` }}
                        >
                            {effect.content}
                        </div>
                    ))}
                </>
            )}

            {/* PHASE 2: BIG KISS HOLD */}
            {phase === 'kiss' && (
                <div className={styles.kissPhase}>
                    <div
                        className={styles.kissRingContainer}
                        onMouseDown={startKiss}
                        onMouseUp={endKiss}
                        onMouseLeave={endKiss}
                        onTouchStart={startKiss}
                        onTouchEnd={endKiss}
                    >
                        <svg className={styles.ringSvg} viewBox="0 0 210 210">
                            <circle className={styles.ringBg} cx="105" cy="105" r="95" />
                            <circle
                                className={styles.ringFill}
                                cx="105" cy="105" r="95"
                                style={{ strokeDasharray: 2 * Math.PI * 95, strokeDashoffset }}
                            />
                        </svg>
                        <div className={`${styles.bigKiss} ${styles.heartbeat}`}>❤️</div>
                    </div>
                    <p className={styles.kissHint}>{isPressing ? "Don't let go..." : "Hold to seal it..."}</p>
                </div>
            )}

            {/* EXPLOSION */}
            {showFlash && <div className={styles.flash} />}
            {explosionParticles.length > 0 && phase === 'explosion' && (
                <div className={styles.explosionLayer}>
                    {explosionParticles.map(p => (
                        <div
                            key={p.id}
                            className={styles.explosionParticle}
                            style={{ '--ex': p.ex, '--ey': p.ey, '--er': p.er }}
                        >
                            {p.emoji}
                        </div>
                    ))}
                </div>
            )}

            {/* PHASE 3: CELEBRATION */}
            {phase === 'celebration' && (
                <div className={styles.celebWrap}>
                    <div className={styles.celebHeader}>
                        <h1 className={styles.celebTitle}>Sealed With A Kiss 💋</h1>
                        <p className={styles.celebSub}>You caught my heart!</p>
                    </div>

                    <div className={styles.photoGrid}>
                        {PHOTOS.map((src, i) => (
                            <div
                                key={i}
                                className={styles.photoCard}
                                style={{ '--delay': `${i * 0.1}s` }}
                            >
                                <div className={styles.photoImg} style={{ backgroundImage: `url(${src})` }} />
                            </div>
                        ))}
                    </div>

                    <div className={styles.letterCard}>
                        <div className={styles.pinPolaroid}>
                            <div className={styles.pin}>📌</div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={POLAROID_PHOTO} className={styles.polaroidImg} alt="Us" />
                        </div>
                        <h3 style={{ fontFamily: 'Pacifico', color: '#d6336c', marginBottom: '10px' }}>To My Love...</h3>
                        <div className={styles.letterBody}>{FINAL_LETTER}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
