"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Day8.module.css";

// ── Photos for the Grand Finale ──
// Using the best photos from all days for the final collage
const PHOTOS = [
    "/Propose-Day-pics/IMG_1486.JPG",
    "/Propose-Day-pics/IMG_3569.JPG",
    "/Rose-Day-pics/IMG_2624.JPG",
    "/Hug-Day-pics/IMG_3657.jpg",
];

const POLAROID = "/Propose-Day-pics/IMG_3249.jpg";

const FINAL_LETTER_TEXT = `My Dearest Pepito,

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
Manoj ❤️`;

// ── Sweet messages revealed on heart catch ──
const CATCH_MESSAGES = [
    "My Heart! ❤️",
    "Forever Yours! 🌹",
    "Be Mine? 💌",
    "Love You! 💖",
    "Soulmate ✨",
    "Perfect Match 💑",
    "Only You 💘",
    "Always 💍",
    "My Everything 🌍",
    "True Love 🦢",
];

// ── Generate a new floating heart with random physics ──
const TOTAL_CATCHES = 14; // A bit longer for the finale
let heartIdCounter = 0;

const createHeart = (screenW, screenH) => {
    const id = heartIdCounter++;
    const isGolden = id > 0 && id % 5 === 0;
    const size = isGolden ? 70 : 50 + Math.random() * 25;

    // Start from a random edge
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
        case 0: x = Math.random() * (screenW - size); y = -size; break;
        case 1: x = screenW; y = Math.random() * (screenH - size); break;
        case 2: x = Math.random() * (screenW - size); y = screenH; break;
        default: x = -size; y = Math.random() * (screenH - size); break;
    }

    // Velocity toward center with randomness
    const cx = screenW / 2 + (Math.random() - 0.5) * screenW * 0.5;
    const cy = screenH / 2 + (Math.random() - 0.5) * screenH * 0.5;
    const angle = Math.atan2(cy - y, cx - x);
    const speed = 0.5 + Math.random() * 0.9;

    return {
        id,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        isGolden,
        // Heart bounce animation params
        bounceDelay: Math.random(),
        born: Date.now(),
    };
};

// ── Petals / Confetti ──
const makePetals = (n) =>
    Array.from({ length: n }, (_, i) => ({
        id: i,
        emoji: ['❤️', '💖', '✨', '🌹', '🦋'][i % 5],
        left: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 8 + Math.random() * 6,
    }));

// SVG ring
const R = 95;
const C = 2 * Math.PI * R;
const HOLD_MS = 3500; // Slightly longer hold for final day

export default function Day8() {
    // ── Phase ──
    const [phase, setPhase] = useState('game');
    // 'game' | 'hold' | 'explosion' | 'celebration'

    const [petals] = useState(() => makePetals(15));

    // ── Game state ──
    const [hearts, setHearts] = useState([]);
    const [catches, setCatches] = useState(0);
    const [popEffects, setPopEffects] = useState([]);
    const [sparkles, setSparkles] = useState([]);
    const [floatMsgs, setFloatMsgs] = useState([]);
    const [caughtMarks, setCaughtMarks] = useState([]);

    // ── Hold state ──
    const [holdProgress, setHoldProgress] = useState(0);
    const [isPressing, setIsPressing] = useState(false);
    const [holdSparkles, setHoldSparkles] = useState([]);
    const [showFlash, setShowFlash] = useState(false);
    const [explosion, setExplosion] = useState([]);

    const canvasRef = useRef(null);
    const heartsRef = useRef([]);
    const frameRef = useRef(null);
    const catchesRef = useRef(0);
    const holdStart = useRef(null);
    const holdFrame = useRef(null);
    const screenRef = useRef({ w: 0, h: 0 });

    // ── Preload fonts ──
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Pacifico&family=Quicksand:wght@400;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    // ── Initialize game ──
    useEffect(() => {
        if (phase !== 'game') return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        screenRef.current = { w, h };

        // Spawn initial hearts
        const initial = Array.from({ length: 4 }, () => createHeart(w, h));
        heartsRef.current = initial;
        setHearts(initial);

        // Physics loop
        const tick = () => {
            const sw = screenRef.current.w;
            const sh = screenRef.current.h;

            heartsRef.current = heartsRef.current.map(h => {
                let nx = h.x + h.vx;
                let ny = h.y + h.vy;
                let nvx = h.vx;
                let nvy = h.vy;

                // Soft boundary bounce
                const margin = 20;
                if (nx < margin) { nvx = Math.abs(nvx) * 0.9 + 0.1; nx = margin; }
                if (nx > sw - h.size - margin) { nvx = -Math.abs(nvx) * 0.9 - 0.1; nx = sw - h.size - margin; }
                if (ny < margin + 100) { nvy = Math.abs(nvy) * 0.9 + 0.15; ny = margin + 100; }
                if (ny > sh - h.size - margin) { nvy = -Math.abs(nvy) * 0.9 - 0.15; ny = sh - h.size - margin; }

                // Drift
                nvx += (Math.random() - 0.5) * 0.03;
                nvy += (Math.random() - 0.5) * 0.03;

                return { ...h, x: nx, y: ny, vx: nvx, vy: nvy };
            });

            setHearts([...heartsRef.current]);
            frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [phase]);

    // ── Handle catch ──
    const handleCatch = useCallback((heartObj, e) => {
        e.stopPropagation();
        if (window.navigator?.vibrate) window.navigator.vibrate(heartObj.isGolden ? [60, 40, 60] : 30);

        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Remove
        heartsRef.current = heartsRef.current.filter(h => h.id !== heartObj.id);

        // Mark
        setCaughtMarks(prev => [...prev, { id: heartObj.id, x: cx, y: cy, size: heartObj.isGolden ? '2.2rem' : '1.6rem' }]);

        // Pop ring
        const popId = Date.now() + Math.random();
        setPopEffects(prev => [...prev, {
            id: popId, x: cx, y: cy, size: heartObj.size,
            color: heartObj.isGolden ? 'rgba(255,215,0,0.4)' : 'rgba(255,50,100,0.3)',
        }]);
        setTimeout(() => setPopEffects(prev => prev.filter(p => p.id !== popId)), 500);

        // Sparkles
        const newSparkles = Array.from({ length: heartObj.isGolden ? 10 : 6 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
            const dist = 40 + Math.random() * 60;
            return {
                id: Date.now() + Math.random() + i,
                x: cx, y: cy,
                emoji: ['✨', '❤️', '💖', '🌸', '⭐'][i % 5],
                sx: `${Math.cos(angle) * dist}px`,
                sy: `${Math.sin(angle) * dist}px`,
                sr: `${(Math.random() - 0.5) * 360}deg`,
            };
        });
        setSparkles(prev => [...prev, ...newSparkles]);
        setTimeout(() => setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id))), 800);

        // Message
        const msg = CATCH_MESSAGES[Math.floor(Math.random() * CATCH_MESSAGES.length)];
        const msgId = Date.now() + Math.random();
        setFloatMsgs(prev => [...prev, { id: msgId, text: msg, x: cx, y: cy - 10 }]);
        setTimeout(() => setFloatMsgs(prev => prev.filter(m => m.id !== msgId)), 2200);

        // Count
        const newCatches = catchesRef.current + 1;
        catchesRef.current = newCatches;
        setCatches(newCatches);

        if (newCatches >= TOTAL_CATCHES) {
            setTimeout(() => {
                if (frameRef.current) cancelAnimationFrame(frameRef.current);
                setPhase('hold');
            }, 800);
        } else {
            setTimeout(() => {
                const replacement = createHeart(screenRef.current.w, screenRef.current.h);
                heartsRef.current.push(replacement);
                // Ramp up difficulty
                if (newCatches > 6 && Math.random() > 0.5 && heartsRef.current.length < 6) {
                    heartsRef.current.push(createHeart(screenRef.current.w, screenRef.current.h));
                }
            }, 300);
        }
    }, []);

    // ── Hold mechanic ──
    const spawnHoldSparkle = useCallback(() => {
        const ang = Math.random() * Math.PI * 2;
        const dist = 55 + Math.random() * 85;
        const s = {
            id: Date.now() + Math.random(),
            emoji: ['✨', '❤️', '💖', '🌹', '💑'][Math.floor(Math.random() * 5)],
            x: `${Math.cos(ang) * dist}px`,
            y: `${Math.sin(ang) * dist}px`,
            r: `${(Math.random() - 0.5) * 360}deg`,
            dur: `${1 + Math.random() * 0.5}s`,
        };
        setHoldSparkles(prev => [...prev, s]);
        setTimeout(() => setHoldSparkles(prev => prev.filter(z => z.id !== s.id)), 1500);
    }, []);

    const startHold = useCallback((e) => {
        e.preventDefault();
        if (phase !== 'hold') return;
        setIsPressing(true);
        holdStart.current = performance.now() - (holdProgress / 100) * HOLD_MS;
        if (window.navigator?.vibrate) window.navigator.vibrate(30);

        let lastSpark = 0;
        const animate = (now) => {
            const elapsed = now - holdStart.current;
            const prog = Math.min((elapsed / HOLD_MS) * 100, 100);
            setHoldProgress(prog);

            const interval = Math.max(70, 300 - prog * 2.2);
            if (now - lastSpark > interval) { spawnHoldSparkle(); lastSpark = now; }

            if (prog >= 100) { triggerFinale(); return; }
            holdFrame.current = requestAnimationFrame(animate);
        };
        holdFrame.current = requestAnimationFrame(animate);
    }, [phase, holdProgress, spawnHoldSparkle]);

    const endHold = useCallback(() => {
        setIsPressing(false);
        if (holdFrame.current) { cancelAnimationFrame(holdFrame.current); holdFrame.current = null; }
        // Decay
        if (phase === 'hold' && holdProgress < 100) {
            const decay = () => {
                setHoldProgress(prev => {
                    if (prev <= 0) return 0;
                    const n = prev - 1.2;
                    if (n > 0) requestAnimationFrame(decay);
                    return Math.max(0, n);
                });
            };
            requestAnimationFrame(decay);
        }
    }, [phase, holdProgress]);

    useEffect(() => {
        return () => { if (holdFrame.current) cancelAnimationFrame(holdFrame.current); };
    }, []);

    const triggerFinale = useCallback(() => {
        setIsPressing(false);
        if (holdFrame.current) cancelAnimationFrame(holdFrame.current);
        if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100, 50, 300]);

        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 1200);

        const parts = Array.from({ length: 35 }, (_, i) => {
            const a = (i / 35) * Math.PI * 2;
            const d = 140 + Math.random() * 240;
            return {
                id: i,
                emoji: ['❤️', '💖', '✨', '🌹', '💍', '💌', '🦢'][i % 7],
                ex: `${Math.cos(a) * d}px`,
                ey: `${Math.sin(a) * d}px`,
                er: `${(Math.random() - 0.5) * 720}deg`,
                fs: `${1.5 + Math.random() * 1.5}rem`,
            };
        });
        setExplosion(parts);
        setPhase('explosion');
        setTimeout(() => { setPhase('celebration'); setExplosion([]); }, 1800);
    }, []);

    // ── Save Letter ──
    const saveLetter = () => {
        const blb = new Blob([FINAL_LETTER_TEXT], { type: "text/plain" });
        const url = URL.createObjectURL(blb);
        const a = document.createElement("a");
        a.href = url;
        a.download = "My_Valentine_Letter.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Derived ──
    const warmClass = catches < 5 ? '' : catches < 9 ? styles.warm1 : catches < 12 ? styles.warm2 : styles.warm3;
    const progress = (Math.min(catches, TOTAL_CATCHES) / TOTAL_CATCHES) * 100;
    const dashOffset = C - (holdProgress / 100) * C;
    const hbSpeed = isPressing ? `${Math.max(0.3, 1.2 - (holdProgress / 100) * 0.9)}s` : '1.2s';

    return (
        <div className={`${styles.container} ${warmClass}`}>
            {/* Glow orbs */}
            <div className={styles.orb1} />
            <div className={styles.orb2} />
            <div className={styles.orb3} />

            {/* Petals */}
            <div className={styles.petalsLayer}>
                {petals.map(p => (
                    <span key={p.id} className={styles.petal}
                        style={{ left: `${p.left}%`, '--del': `${p.delay}s`, '--dur': `${p.dur}s` }}>
                        {p.emoji}
                    </span>
                ))}
            </div>

            {/* ═══ GAME PHASE ═══ */}
            {phase === 'game' && (
                <>
                    <div className={styles.hud}>
                        <h1 className={styles.title}>Happy Valentine's Day ❤️</h1>
                        <p className={styles.subtitle}>catch my heart to unlock your gift...</p>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                        </div>
                        <span className={styles.scoreText}>{catches} / {TOTAL_CATCHES} hearts caught</span>
                    </div>

                    {caughtMarks.map(m => (
                        <div key={m.id} className={styles.caughtMark}
                            style={{ left: m.x, top: m.y, fontSize: m.size, transform: 'translate(-50%,-50%)' }}>
                            ❤️
                        </div>
                    ))}

                    <div className={styles.gameCanvas} ref={canvasRef}>
                        {hearts.map(h => (
                            <div
                                key={h.id}
                                className={`${styles.heartTarget} ${h.isGolden ? styles.heartGolden : ''}`}
                                onClick={(e) => handleCatch(h, e)}
                                style={{
                                    left: h.x, top: h.y, width: h.size, height: h.size,
                                    '--bounce-delay': `${h.bounceDelay}s`,
                                }}
                            >
                                <div className={styles.heartInner}
                                    style={{ '--heart-glow': h.isGolden ? 'rgba(255,215,0,0.35)' : 'rgba(255,50,100,0.25)' }}>
                                    <span className={styles.heartEmoji}
                                        style={{ '--heart-size': h.isGolden ? '3rem' : '2.4rem' }}>
                                        ❤️
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {popEffects.map(p => (
                        <div key={p.id} className={styles.popRing}
                            style={{
                                left: p.x - p.size / 2, top: p.y - p.size / 2,
                                width: p.size, height: p.size,
                                border: `2px solid ${p.color}`,
                                boxShadow: `0 0 15px ${p.color}`,
                            }}
                        />
                    ))}

                    {sparkles.map(s => (
                        <div key={s.id} className={styles.sparkle}
                            style={{ left: s.x, top: s.y, '--sx': s.sx, '--sy': s.sy, '--sr': s.sr }}>
                            {s.emoji}
                        </div>
                    ))}

                    {floatMsgs.map(fm => (
                        <div key={fm.id} className={styles.floatMessage}
                            style={{ left: fm.x, top: fm.y }}>
                            {fm.text}
                        </div>
                    ))}
                </>
            )}

            {/* ═══ HOLD PHASE ═══ */}
            {phase === 'hold' && (
                <div className={styles.holdPhase}>
                    <div className={styles.hud}>
                        <h1 className={styles.title}>One last thing... ❤️</h1>
                    </div>

                    <div className={styles.holdRingWrap}
                        onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
                        onTouchStart={startHold} onTouchEnd={endHold}>

                        <svg className={styles.ringSvg} viewBox="0 0 210 210">
                            <defs>
                                <linearGradient id="valentineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ff3366" />
                                    <stop offset="50%" stopColor="#ff4d6d" />
                                    <stop offset="100%" stopColor="#ffab91" />
                                </linearGradient>
                            </defs>
                            <circle className={styles.ringBg} cx="105" cy="105" r={R} />
                            <circle className={styles.ringFill} cx="105" cy="105" r={R}
                                strokeDasharray={C} strokeDashoffset={dashOffset} />
                        </svg>

                        <div className={`${styles.bigHeart} ${styles.heartbeat} ${isPressing ? styles.bigHeartPressing : ''}`}
                            style={{ '--hb-speed': hbSpeed }}>
                            💖
                        </div>

                        {holdSparkles.map(s => (
                            <div key={s.id} className={styles.holdSparkle}
                                style={{ '--sp-x': s.x, '--sp-y': s.y, '--sp-r': s.r, '--sp-dur': s.dur, fontSize: '1.2rem' }}>
                                {s.emoji}
                            </div>
                        ))}
                    </div>

                    <p className={`${styles.holdHint} ${isPressing ? styles.holdHintActive : ''}`}>
                        {isPressing ? "Almost yours..." : 'Hold to accept my love...'}
                    </p>
                </div>
            )}

            {/* ═══ EXPLOSION ═══ */}
            {showFlash && <div className={styles.flash} />}
            {explosion.length > 0 && (
                <div className={styles.explosionLayer}>
                    {explosion.map(ep => (
                        <div key={ep.id} className={styles.explosionPart}
                            style={{ '--ex': ep.ex, '--ey': ep.ey, '--er': ep.er, fontSize: ep.fs }}>
                            {ep.emoji}
                        </div>
                    ))}
                </div>
            )}

            {/* ═══ CELEBRATION ═══ */}
            {phase === 'celebration' && (
                <div className={styles.celebWrap}>
                    <div className={styles.celebHeader}>
                        <h1 className={styles.celebTitle}>My Forever Valentine 💑</h1>
                        <p className={styles.celebSub}>I choose you. Today and always.</p>
                    </div>

                    <div className={styles.photoGrid}>
                        {PHOTOS.map((photo, i) => (
                            <div key={i} className={styles.photoCard}
                                style={{ '--delay': `${0.1 + i * 0.1}s` }}>
                                <div className={styles.photoImg}
                                    style={{ backgroundImage: `url(${photo})` }} />
                            </div>
                        ))}
                    </div>

                    <div className={styles.letterCard}>
                        <div className={styles.seal}>❤️</div>
                        <div className={styles.pinPolaroid}>
                            <div className={styles.pin}>📌</div>
                            <div className={styles.polaroidFrame}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={POLAROID} alt="Us" className={styles.polaroidImg} />
                            </div>
                        </div>
                        <h2 className={styles.letterTitle}>To My One & Only</h2>
                        <div className={styles.letterBody}>{FINAL_LETTER_TEXT}</div>
                    </div>

                    <button className={styles.saveBtn} onClick={saveLetter}>
                        Save Letter Forever 💌
                    </button>

                    <div style={{ height: '40px' }} />
                </div>
            )}
        </div>
    );
}
