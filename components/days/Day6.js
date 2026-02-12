"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Day6.module.css";

// Hug Day polaroid photo
const HUG_PHOTO = "/Hug-Day-pics/IMG_3657.jpg";

const FINAL_LETTER = `My sweetest Sanghudu,

I wish every time we hugged, we never let go.
There's something about your arms that makes
everything else fade away — the noise, the rush,
all of it just... stops.

You are my favourite kind of warmth,
the one I never want to come home without.

Happy Hug Day 🤗💕`;

// Bubble data — each with a cute "hug reason"
const BUBBLE_DATA = [
    { emoji: "🤗", text: "Your hugs feel like home" },
    { emoji: "☁️", text: "Softer than clouds" },
    { emoji: "🔥", text: "You warm my soul" },
    { emoji: "✨", text: "Magic in every squeeze" },
    { emoji: "🌙", text: "Best way to end my day" },
    { emoji: "🧸", text: "My human teddy bear" },
    { emoji: "💕", text: "My heart skips a beat" },
    { emoji: "🌸", text: "Sweeter than springtime" },
    { emoji: "🏡", text: "You are my safe place" },
    { emoji: "🦋", text: "Butterflies every time" },
    { emoji: "🎵", text: "Our own love song" },
    { emoji: "🍯", text: "Sweeter than honey" },
];

// Bubble color palettes
const BUBBLE_COLORS = [
    { bg: "radial-gradient(circle at 30% 30%, rgba(255,182,193,0.4) 0%, rgba(233,30,99,0.15) 60%, rgba(156,39,176,0.08) 100%)", glow: "rgba(233,30,99,0.25)" },
    { bg: "radial-gradient(circle at 30% 30%, rgba(206,147,216,0.4) 0%, rgba(156,39,176,0.15) 60%, rgba(103,58,183,0.08) 100%)", glow: "rgba(156,39,176,0.25)" },
    { bg: "radial-gradient(circle at 30% 30%, rgba(255,183,77,0.4) 0%, rgba(255,152,0,0.15) 60%, rgba(233,30,99,0.08) 100%)", glow: "rgba(255,152,0,0.25)" },
    { bg: "radial-gradient(circle at 30% 30%, rgba(128,222,234,0.35) 0%, rgba(77,182,172,0.12) 60%, rgba(38,166,154,0.06) 100%)", glow: "rgba(77,182,172,0.2)" },
    { bg: "radial-gradient(circle at 30% 30%, rgba(255,138,128,0.4) 0%, rgba(244,67,54,0.15) 60%, rgba(211,47,47,0.08) 100%)", glow: "rgba(244,67,54,0.2)" },
    { bg: "radial-gradient(circle at 30% 30%, rgba(179,157,219,0.4) 0%, rgba(126,87,194,0.15) 60%, rgba(94,53,177,0.08) 100%)", glow: "rgba(126,87,194,0.25)" },
];

// Generate bubble positions that avoid overlap
const generateBubbles = () => {
    const bubbles = [];
    const padding = 12; // percent padding from edges (top needs more for HUD)
    const topPadding = 18; // extra space for HUD

    BUBBLE_DATA.forEach((data, index) => {
        const size = 80 + Math.random() * 35; // 80-115px
        const colorSet = BUBBLE_COLORS[index % BUBBLE_COLORS.length];

        // Distribute in a more spread-out grid pattern with jitter
        const cols = 3;
        const rows = Math.ceil(BUBBLE_DATA.length / cols);
        const col = index % cols;
        const row = Math.floor(index / cols);

        const cellW = (100 - padding * 2) / cols;
        const cellH = (100 - topPadding - padding) / rows;

        const x = padding + col * cellW + cellW / 2 - (size / window.innerWidth * 100) / 2 + (Math.random() - 0.5) * cellW * 0.4;
        const y = topPadding + row * cellH + cellH / 2 - (size / window.innerHeight * 100) / 2 + (Math.random() - 0.5) * cellH * 0.3;

        bubbles.push({
            id: index,
            ...data,
            size,
            x: Math.max(5, Math.min(85, x)),
            y: Math.max(topPadding, Math.min(85, y)),
            color: colorSet,
            floatDuration: 5 + Math.random() * 4,
            floatDelay: Math.random() * 3,
            dx1: (Math.random() - 0.5) * 16,
            dy1: (Math.random() - 0.5) * 16,
            dx2: (Math.random() - 0.5) * 14,
            dy2: (Math.random() - 0.5) * 14,
            dx3: (Math.random() - 0.5) * 18,
            dy3: (Math.random() - 0.5) * 10,
            dx4: (Math.random() - 0.5) * 12,
            dy4: (Math.random() - 0.5) * 15,
        });
    });

    return bubbles;
};

export default function Day6() {
    const [phase, setPhase] = useState('bubbles'); // 'bubbles' | 'mega' | 'explosion' | 'celebration'
    const [bubbles, setBubbles] = useState([]);
    const [poppedIds, setPoppedIds] = useState(new Set());
    const [popEffects, setPopEffects] = useState([]);
    const [sparkles, setSparkles] = useState([]);
    const [floatingMessages, setFloatingMessages] = useState([]);
    const [explosionParticles, setExplosionParticles] = useState([]);
    const [showFlash, setShowFlash] = useState(false);

    // Initialize bubbles client-side only
    useEffect(() => {
        setBubbles(generateBubbles());
    }, []);

    // Preload fonts
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Pacifico&family=Quicksand:wght@400;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    // Transition to mega bubble when all popped
    useEffect(() => {
        if (poppedIds.size === BUBBLE_DATA.length && phase === 'bubbles') {
            setTimeout(() => setPhase('mega'), 800);
        }
    }, [poppedIds, phase]);

    // === POP A BUBBLE ===
    const handlePop = useCallback((bubble, e) => {
        if (poppedIds.has(bubble.id)) return;

        // Haptic
        if (window.navigator?.vibrate) window.navigator.vibrate(25);

        // Mark as popped
        setPoppedIds(prev => {
            const next = new Set(prev);
            next.add(bubble.id);
            return next;
        });

        // Get bubble center position for effects
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Pop ring effect
        const popId = Date.now() + Math.random();
        setPopEffects(prev => [...prev, {
            id: popId,
            x: cx,
            y: cy,
            size: bubble.size,
            color: bubble.color.glow,
        }]);
        setTimeout(() => setPopEffects(prev => prev.filter(p => p.id !== popId)), 600);

        // Sparkle particles
        const newSparkles = Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
            const dist = 40 + Math.random() * 60;
            return {
                id: Date.now() + Math.random() + i,
                x: cx,
                y: cy,
                emoji: ['✨', '💕', '🌸', '💖', '⭐', '🤗'][i],
                sx: `${Math.cos(angle) * dist}px`,
                sy: `${Math.sin(angle) * dist}px`,
                srot: `${(Math.random() - 0.5) * 360}deg`,
            };
        });
        setSparkles(prev => [...prev, ...newSparkles]);
        setTimeout(() => {
            setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
        }, 800);

        // Floating message
        const msgId = Date.now() + Math.random();
        setFloatingMessages(prev => [...prev, {
            id: msgId,
            text: bubble.text,
            x: cx,
            y: cy - 20,
        }]);
        setTimeout(() => {
            setFloatingMessages(prev => prev.filter(m => m.id !== msgId));
        }, 2200);
    }, [poppedIds]);

    // === POP MEGA BUBBLE ===
    const handleMegaPop = useCallback(() => {
        if (window.navigator?.vibrate) {
            window.navigator.vibrate([100, 50, 100, 50, 200]);
        }

        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 800);

        // Explosion particles
        const particles = Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const dist = 150 + Math.random() * 200;
            return {
                id: i,
                emoji: ['💖', '💕', '✨', '🌸', '💗', '🤗', '⭐', '🦋'][i % 8],
                mx: `${Math.cos(angle) * dist}px`,
                my: `${Math.sin(angle) * dist}px`,
                mrot: `${(Math.random() - 0.5) * 720}deg`,
                fontSize: `${1.5 + Math.random() * 1.5}rem`,
            };
        });
        setExplosionParticles(particles);
        setPhase('explosion');

        setTimeout(() => {
            setPhase('celebration');
            setExplosionParticles([]);
        }, 1600);
    }, []);

    const totalBubbles = BUBBLE_DATA.length;
    const poppedCount = poppedIds.size;

    return (
        <div className={styles.container}>
            {/* Ambient glow orbs */}
            <div className={styles.glowOrb1} />
            <div className={styles.glowOrb2} />
            <div className={styles.glowOrb3} />

            {/* HUD — always visible during bubble phase */}
            {(phase === 'bubbles' || phase === 'mega') && (
                <div className={styles.hud}>
                    <h1 className={styles.title}>Hug Day 🫧</h1>
                    <div className={styles.counterWrapper}>
                        <span className={styles.counterText}>Hugs collected:</span>
                        <span className={styles.counterValue}>{poppedCount} / {totalBubbles}</span>
                    </div>
                </div>
            )}

            {/* Pop ring effects */}
            {popEffects.map(pe => (
                <div
                    key={pe.id}
                    className={styles.popEffect}
                    style={{
                        left: pe.x - pe.size / 2,
                        top: pe.y - pe.size / 2,
                        width: pe.size,
                        height: pe.size,
                        borderRadius: '50%',
                        border: `2px solid ${pe.color}`,
                        boxShadow: `0 0 20px ${pe.color}`,
                    }}
                />
            ))}

            {/* Sparkle particles */}
            {sparkles.map(s => (
                <div
                    key={s.id}
                    className={styles.popSparkle}
                    style={{
                        left: s.x,
                        top: s.y,
                        '--sx': s.sx,
                        '--sy': s.sy,
                        '--srot': s.srot,
                    }}
                >
                    {s.emoji}
                </div>
            ))}

            {/* Floating popped messages */}
            {floatingMessages.map(fm => (
                <div
                    key={fm.id}
                    className={styles.poppedMessage}
                    style={{ left: fm.x, top: fm.y, transform: 'translateX(-50%)' }}
                >
                    {fm.text}
                </div>
            ))}

            {/* ===== PHASE: Bubbles ===== */}
            {phase === 'bubbles' && (
                <div className={styles.bubblesCanvas}>
                    {bubbles.map(bubble => {
                        if (poppedIds.has(bubble.id)) return null;
                        return (
                            <div
                                key={bubble.id}
                                className={styles.bubble}
                                onClick={(e) => handlePop(bubble, e)}
                                style={{
                                    left: `${bubble.x}%`,
                                    top: `${bubble.y}%`,
                                    width: bubble.size,
                                    height: bubble.size,
                                    '--float-duration': `${bubble.floatDuration}s`,
                                    '--float-delay': `${bubble.floatDelay}s`,
                                    '--dx1': `${bubble.dx1}px`,
                                    '--dy1': `${bubble.dy1}px`,
                                    '--dx2': `${bubble.dx2}px`,
                                    '--dy2': `${bubble.dy2}px`,
                                    '--dx3': `${bubble.dx3}px`,
                                    '--dy3': `${bubble.dy3}px`,
                                    '--dx4': `${bubble.dx4}px`,
                                    '--dy4': `${bubble.dy4}px`,
                                }}
                            >
                                <div
                                    className={styles.bubbleInner}
                                    style={{
                                        '--bubble-bg': bubble.color.bg,
                                        '--bubble-glow': bubble.color.glow,
                                    }}
                                >
                                    {bubble.size > 95 ? (
                                        <>
                                            <span className={styles.bubbleEmoji} style={{ '--emoji-size': '1.6rem' }}>{bubble.emoji}</span>
                                            <span className={styles.bubbleText} style={{ '--bubble-font': '0.65rem', marginTop: '2px' }}>{bubble.text}</span>
                                        </>
                                    ) : (
                                        <span className={styles.bubbleEmoji} style={{ '--emoji-size': '2rem' }}>{bubble.emoji}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ===== PHASE: Mega Bubble ===== */}
            {phase === 'mega' && (
                <div className={styles.megaBubbleWrapper}>
                    <div className={styles.megaBubble} onClick={handleMegaPop}>
                        <div className={styles.megaBubbleInner}>
                            <span className={styles.megaEmoji}>🤗</span>
                            <span className={styles.megaText}>The Big Hug</span>
                        </div>
                        <span className={styles.megaHint}>Tap for the biggest hug ✨</span>
                    </div>
                </div>
            )}

            {/* ===== Explosion ===== */}
            {showFlash && <div className={styles.goldenFlash} />}

            {explosionParticles.length > 0 && (
                <div className={styles.megaExplosion}>
                    {explosionParticles.map(ep => (
                        <div
                            key={ep.id}
                            className={styles.megaExplosionParticle}
                            style={{
                                '--mx': ep.mx,
                                '--my': ep.my,
                                '--mrot': ep.mrot,
                                fontSize: ep.fontSize,
                            }}
                        >
                            {ep.emoji}
                        </div>
                    ))}
                </div>
            )}

            {/* ===== PHASE: Celebration ===== */}
            {phase === 'celebration' && (
                <div className={styles.celebrationContainer}>
                    <div className={styles.celebHeader}>
                        <h1 className={styles.celebTitle}>Warm Forever 🤗</h1>
                    </div>

                    <div className={styles.letterCard}>
                        <div className={styles.seal}>💌</div>

                        {/* Pinned polaroid on top-right */}
                        <div className={styles.pinnedPolaroid}>
                            <div className={styles.pin}>📌</div>
                            <div className={styles.polaroidFrame}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={HUG_PHOTO} alt="Our hug" className={styles.polaroidImg} />
                            </div>
                        </div>

                        <h2 className={styles.letterHeading}>To My Warmth 💕</h2>
                        <div className={styles.letterBody}>
                            {FINAL_LETTER}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
