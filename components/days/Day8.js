"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Day8.module.css";

// ═══════════════════════════════════════════
//  CONSTANTS & DATA
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  CONSTANTS & DATA
// ═══════════════════════════════════════════

const POLAROID = "/Propose-Day-pics/ending-pinned.jpg";

const FINAL_LETTER = `My Dearest Pepito,

If you are reading this, it means you made it through a week of my silly digital surprises — and today's little adventure too.
Thank you for playing along.

This website was just a small way to show you what you mean to me.
Every click, every puzzle, every reveal... it was all just an excuse to make you smile.

This website ends today.
But choosing you doesn't.
I will choose you tomorrow, and the day after, and every day that follows.

You are my favorite notification.
My favorite plan.
My Bubbleyum Princess.
My valentine.

With all my love,
Your Kitty ❤️`;

// Level 1: Constellation — 10 points forming a heart
const STARS = [
    { x: 150, y: 255 },
    { x: 88, y: 185 },
    { x: 40, y: 125 },
    { x: 48, y: 72 },
    { x: 95, y: 42 },
    { x: 150, y: 78 },
    { x: 205, y: 42 },
    { x: 252, y: 72 },
    { x: 260, y: 125 },
    { x: 212, y: 185 },
];

// Level 2: Word scramble
const SCRAMBLE_WORDS = [
    { word: "GOA", scrambled: "OAG", hint: "Where our best memories live 🏖️" },
    { word: "MOCHI", scrambled: "ICHMO", hint: "Her favorite Japanese treat 🍡" },
    { word: "DANCE", scrambled: "ACNED", hint: "How our story began 💃" },
    { word: "PEPITO", scrambled: "OPTIEP", hint: "Her sweetest nickname 💕" },
];

// Level 3: Memory match pairs
const MEMORY_PAIRS = [
    "/Propose-Day-pics/IMG_1013.jpg",
    "/Propose-Day-pics/IMG_1486.JPG",
    "/Propose-Day-pics/IMG_2010.JPG",
    "/Propose-Day-pics/IMG_2809.JPG",
    "/Propose-Day-pics/IMG_3249.jpg",
    "/Propose-Day-pics/IMG_3569.JPG",
];

// Level 4: Quiz questions
const QUIZ = [
    { q: "What's Mr.KeraCool's favorite song?", opts: ["Sweater Weather", "We Are The People", "Perfect"], ans: 0 },
    { q: "What does Mr.KeraCool call Sanghu?", opts: ["Sugar Plum", "Bubbleyum Princess", "Honey Bear"], ans: 1 },
    { q: "How did we first connect?", opts: ["At a cafe", "Through friends", "Asked her for a dance"], ans: 2 },
    { q: "What's our favorite show", opts: ["The Office", "F.R.I.E.N.D.S", "Brooklyn Nine-Nine"], ans: 1 },
    { q: "What makes Mr.KeraCool smile most about her?", opts: ["Her cooking", "Her cute noises", "Her texts"], ans: 1 },
];

// Level 5: Scratch card reasons
const LOVE_REASONS = [
    "The child in you ✨",
    "I just love being with you 💕",
    "Your presence makes everything better 🌟",
    "You're my Bubbleyum Princess 👑",
    "Your cute noises make my day 😄",
];

// Level 6: Heart catch
const HEARTS_NEEDED = 8;
const CATCH_MSGS = [
    "My Heart! ❤️", "Forever! 🌹", "Be Mine! 💌", "Love You! 💖",
    "Soulmate ✨", "Only You 💘", "Always 💍", "True Love 🦢",
];

const TOTAL_LEVELS = 7;

let heartIdCounter = 0;
const makeHeart = (w, h) => {
    const id = heartIdCounter++;
    const isGolden = id > 0 && id % 4 === 0;
    const size = isGolden ? 65 : 45 + Math.random() * 20;
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
        case 0: x = Math.random() * (w - size); y = -size; break;
        case 1: x = w; y = Math.random() * (h - size); break;
        case 2: x = Math.random() * (w - size); y = h; break;
        default: x = -size; y = Math.random() * (h - size); break;
    }
    const cx = w / 2 + (Math.random() - 0.5) * w * 0.4;
    const cy = h / 2 + (Math.random() - 0.5) * h * 0.4;
    const angle = Math.atan2(cy - y, cx - x);
    const speed = 0.5 + Math.random() * 0.8;
    return { id, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size, isGolden };
};

// ═══════════════════════════════════════════
//  LEVEL 0 — INTRO
// ═══════════════════════════════════════════

function IntroLevel({ onStart }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => { setTimeout(() => setVisible(true), 300); }, []);

    return (
        <div className={`${styles.introWrap} ${visible ? styles.introVisible : ""}`}>
            <div className={styles.introEmoji}>💝</div>
            <h1 className={styles.introTitle}>Happy Valentine&apos;s Day</h1>
            <p className={styles.introSub}>A special adventure awaits you, Pepito...</p>
            <p className={styles.introDesc}>7 levels of love, puzzles & surprises</p>
            <button className={styles.startBtn} onClick={onStart}>
                Begin the Adventure ✨
            </button>
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 1 — CONSTELLATION CONNECT
// ═══════════════════════════════════════════

function ConstellationLevel({ onComplete }) {
    const [lit, setLit] = useState([]);
    const [complete, setComplete] = useState(false);
    const nextIdx = lit.length;

    const tapStar = (idx) => {
        if (idx !== nextIdx || complete) return;
        if (window.navigator?.vibrate) window.navigator.vibrate(25);
        const newLit = [...lit, idx];
        setLit(newLit);
        if (newLit.length === STARS.length) {
            setComplete(true);
            setTimeout(onComplete, 2200);
        }
    };

    return (
        <div className={styles.levelWrap}>
            <h2 className={styles.levelTitle}>Written in the Stars ⭐</h2>
            <p className={styles.levelSub}>Tap the glowing star to trace our constellation</p>
            <svg className={styles.conSvg} viewBox="0 0 300 300">
                {/* Background twinkling stars */}
                {Array.from({ length: 40 }, (_, i) => (
                    <circle key={`bg${i}`} cx={Math.random() * 300} cy={Math.random() * 300}
                        r={0.5 + Math.random() * 1.2} fill="rgba(255,255,255,0.4)"
                        className={styles.bgStar} style={{ "--twinkle-delay": `${Math.random() * 4}s` }} />
                ))}

                {/* Connection lines */}
                {lit.map((starIdx, i) => {
                    if (i === 0) return null;
                    const prev = STARS[lit[i - 1]];
                    const curr = STARS[starIdx];
                    return (
                        <line key={`l${i}`} x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y}
                            className={styles.conLine} />
                    );
                })}
                {complete && (
                    <line x1={STARS[lit[lit.length - 1]].x} y1={STARS[lit[lit.length - 1]].y}
                        x2={STARS[lit[0]].x} y2={STARS[lit[0]].y} className={styles.conLine} />
                )}

                {/* Interactive stars */}
                {STARS.map((star, i) => {
                    const isLit = lit.includes(i);
                    const isNext = i === nextIdx && !complete;
                    return (
                        <g key={i} onClick={() => tapStar(i)} style={{ cursor: isNext ? "pointer" : "default" }}>
                            {isNext && (
                                <circle cx={star.x} cy={star.y} r={20} className={styles.starPulse} />
                            )}
                            <circle cx={star.x} cy={star.y} r={22} fill="transparent" />
                            <circle cx={star.x} cy={star.y} r={isLit ? 8 : isNext ? 7 : 4}
                                className={`${styles.starDot} ${isLit ? styles.starLit : ""} ${isNext ? styles.starNext : ""}`} />
                        </g>
                    );
                })}
            </svg>
            {complete && <p className={styles.completeMsg}>Our love is written in the stars ❤️</p>}
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 2 — WORD SCRAMBLE
// ═══════════════════════════════════════════

function WordScrambleLevel({ onComplete }) {
    const [wordIdx, setWordIdx] = useState(0);
    const [selected, setSelected] = useState([]);
    const [solved, setSolved] = useState(false);
    const [shake, setShake] = useState(false);

    const current = SCRAMBLE_WORDS[wordIdx];
    const letters = current.scrambled.split("");
    const target = current.word;

    const tapLetter = (idx) => {
        if (selected.includes(idx) || solved) return;
        if (window.navigator?.vibrate) window.navigator.vibrate(15);

        const newSelected = [...selected, idx];
        const built = newSelected.map((i) => letters[i]).join("");
        const expected = target.substring(0, newSelected.length);

        if (built !== expected) {
            setShake(true);
            if (window.navigator?.vibrate) window.navigator.vibrate([40, 20, 40]);
            setTimeout(() => { setSelected([]); setShake(false); }, 500);
            return;
        }

        setSelected(newSelected);

        if (newSelected.length === target.length) {
            setSolved(true);
            if (window.navigator?.vibrate) window.navigator.vibrate([30, 20, 60]);
            setTimeout(() => {
                if (wordIdx + 1 < SCRAMBLE_WORDS.length) {
                    setWordIdx((prev) => prev + 1);
                    setSelected([]);
                    setSolved(false);
                } else {
                    onComplete();
                }
            }, 1200);
        }
    };

    return (
        <div className={styles.levelWrap}>
            <h2 className={styles.levelTitle}>Unscramble My Heart 💌</h2>
            <p className={styles.levelSub}>{current.hint}</p>
            <div className={styles.wordDots}>
                {SCRAMBLE_WORDS.map((_, i) => (
                    <div key={i} className={`${styles.dot} ${i < wordIdx ? styles.dotDone : i === wordIdx ? styles.dotActive : ""}`} />
                ))}
            </div>
            <div className={styles.answerRow}>
                {target.split("").map((_, i) => (
                    <div key={i} className={`${styles.slot} ${selected[i] !== undefined ? styles.slotFilled : ""}`}>
                        {selected[i] !== undefined ? letters[selected[i]] : ""}
                    </div>
                ))}
            </div>
            <div className={`${styles.letterRow} ${shake ? styles.shake : ""}`}>
                {letters.map((letter, i) => (
                    <button key={i} className={`${styles.tile} ${selected.includes(i) ? styles.tileUsed : ""}`}
                        onClick={() => tapLetter(i)} disabled={selected.includes(i)}>
                        {letter}
                    </button>
                ))}
            </div>
            {selected.length > 0 && !solved && (
                <button className={styles.clearBtn} onClick={() => setSelected([])}>Clear</button>
            )}
            {solved && <p className={styles.solvedText}>✨ {target}! ✨</p>}
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 3 — MEMORY MATCH
// ═══════════════════════════════════════════

function MemoryMatchLevel({ onComplete }) {
    const [cards] = useState(() => {
        const deck = [...MEMORY_PAIRS, ...MEMORY_PAIRS].map((img, i) => ({ id: i, img }));
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    });
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [checking, setChecking] = useState(false);

    const flipCard = (idx) => {
        if (checking || flipped.includes(idx) || matched.includes(idx)) return;
        if (window.navigator?.vibrate) window.navigator.vibrate(15);

        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setChecking(true);
            const [a, b] = newFlipped;
            if (cards[a].img === cards[b].img) {
                const newMatched = [...matched, a, b];
                setMatched(newMatched);
                setFlipped([]);
                setChecking(false);
                if (window.navigator?.vibrate) window.navigator.vibrate([20, 15, 40]);
                if (newMatched.length === cards.length) {
                    setTimeout(onComplete, 1200);
                }
            } else {
                setTimeout(() => { setFlipped([]); setChecking(false); }, 900);
            }
        }
    };

    return (
        <div className={styles.levelWrap}>
            <h2 className={styles.levelTitle}>Match Made in Heaven 💑</h2>
            <p className={styles.levelSub}>Find all the matching pairs</p>
            <div className={styles.memGrid}>
                {cards.map((card, i) => {
                    const isOpen = flipped.includes(i) || matched.includes(i);
                    const isMatched = matched.includes(i);
                    return (
                        <div key={card.id}
                            className={`${styles.memCard} ${isOpen ? styles.memOpen : ""} ${isMatched ? styles.memMatched : ""}`}
                            onClick={() => flipCard(i)}>
                            <div className={styles.memInner}>
                                <div className={styles.memFront}>❤️</div>
                                <div className={styles.memBack}>
                                    <img src={card.img} alt="memory" className={styles.memImg} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className={styles.matchCount}>{matched.length / 2} / {MEMORY_PAIRS.length} pairs found</p>
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 4 — QUIZ
// ═══════════════════════════════════════════

const WRONG_MSGS = ["Hmm, not quite! 😜", "Try harder next time! 😄", "Oops! 💫", "Almost! 🤭", "Nope! 🙈"];

function QuizLevel({ onComplete }) {
    const [qIdx, setQIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(null);
    const [done, setDone] = useState(false);

    const current = QUIZ[qIdx];

    const answer = (optIdx) => {
        if (answered !== null) return;
        setAnswered(optIdx);
        const correct = optIdx === current.ans;
        if (window.navigator?.vibrate) window.navigator.vibrate(correct ? 25 : [40, 20, 40]);
        if (correct) setScore((s) => s + 1);

        setTimeout(() => {
            if (qIdx + 1 < QUIZ.length) {
                setQIdx((prev) => prev + 1);
                setAnswered(null);
            } else {
                setDone(true);
                setTimeout(onComplete, 2000);
            }
        }, 1500);
    };

    if (done) {
        return (
            <div className={styles.levelWrap}>
                <h2 className={styles.levelTitle}>How Well Do You Know Me? 💭</h2>
                <div className={styles.quizDone}>
                    <div className={styles.quizScoreBig}>{score} / {QUIZ.length}</div>
                    <p className={styles.quizScoreMsg}>
                        {score === QUIZ.length ? "Perfect! You know me inside out! 💕" :
                            score >= 3 ? "Not bad! You know me well! 💖" :
                                "We have so much more to discover together! 💫"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.levelWrap}>
            <h2 className={styles.levelTitle}>How Well Do You Know Me? 💭</h2>
            <p className={styles.quizProgress}>Question {qIdx + 1} of {QUIZ.length}</p>
            <div className={styles.quizCard}>
                <p className={styles.quizQ}>{current.q}</p>
                <div className={styles.quizOpts}>
                    {current.opts.map((opt, i) => (
                        <button key={i}
                            className={`${styles.quizOpt} ${answered === i ? (i === current.ans ? styles.quizCorrect : styles.quizWrong) : ""} ${answered !== null && i === current.ans ? styles.quizCorrect : ""}`}
                            onClick={() => answer(i)} disabled={answered !== null}>
                            {opt}
                        </button>
                    ))}
                </div>
                {answered !== null && answered !== current.ans && (
                    <p className={styles.quizFeedback}>{WRONG_MSGS[qIdx % WRONG_MSGS.length]}</p>
                )}
                {answered !== null && answered === current.ans && (
                    <p className={styles.quizFeedbackGood}>You know me so well! ❤️</p>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 5 — SCRATCH CARDS
// ═══════════════════════════════════════════

function ScratchCard({ reason, onRevealed }) {
    const canvasRef = useRef(null);
    const [revealed, setRevealed] = useState(false);
    const scratchCount = useRef(0);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;

        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#ff3366");
        grad.addColorStop(0.5, "#ff4d6d");
        grad.addColorStop(1, "#c44569");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "rgba(255,255,255,0.25)";
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.font = "600 14px Nunito, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Scratch me! ✨", w / 2, h / 2);
    }, []);

    const scratch = useCallback((clientX, clientY) => {
        const canvas = canvasRef.current;
        if (!canvas || revealed) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        scratchCount.current++;
        if (scratchCount.current > 20 && !revealed) {
            setRevealed(true);
            if (window.navigator?.vibrate) window.navigator.vibrate([20, 15, 30]);
            onRevealed();
        }
    }, [revealed, onRevealed]);

    const handleMouseDown = useCallback((e) => {
        isDrawing.current = true;
        scratch(e.clientX, e.clientY);
    }, [scratch]);

    const handleMouseMove = useCallback((e) => {
        if (isDrawing.current) scratch(e.clientX, e.clientY);
    }, [scratch]);

    const handleMouseUp = useCallback(() => { isDrawing.current = false; }, []);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        scratch(e.touches[0].clientX, e.touches[0].clientY);
    }, [scratch]);

    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        scratch(e.touches[0].clientX, e.touches[0].clientY);
    }, [scratch]);

    return (
        <div className={`${styles.scratchCard} ${revealed ? styles.scratchRevealed : ""}`}>
            <div className={styles.scratchMsg}>{reason}</div>
            <canvas ref={canvasRef} width={260} height={80}
                className={`${styles.scratchCanvas} ${revealed ? styles.scratchCanvasDone : ""}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove} />
        </div>
    );
}

function ScratchCardLevel({ onComplete }) {
    const [revealedCount, setRevealedCount] = useState(0);

    const handleRevealed = useCallback(() => {
        setRevealedCount((prev) => {
            const next = prev + 1;
            if (next >= LOVE_REASONS.length) {
                setTimeout(onComplete, 1500);
            }
            return next;
        });
    }, [onComplete]);

    return (
        <div className={styles.levelWrap}>
            <h2 className={styles.levelTitle}>Scratch & Discover 💝</h2>
            <p className={styles.levelSub}>Scratch each card to discover why I love you</p>
            <div className={styles.scratchGrid}>
                {LOVE_REASONS.map((reason, i) => (
                    <ScratchCard key={i} reason={reason} onRevealed={handleRevealed} />
                ))}
            </div>
            <p className={styles.matchCount}>{revealedCount} / {LOVE_REASONS.length} discovered</p>
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 6 — HEART CATCH
// ═══════════════════════════════════════════

function HeartCatchLevel({ onComplete }) {
    const [hearts, setHearts] = useState([]);
    const [catches, setCatches] = useState(0);
    const [effects, setEffects] = useState([]);
    const heartsRef = useRef([]);
    const frameRef = useRef(null);
    const catchesRef = useRef(0);
    const screenRef = useRef({ w: 0, h: 0 });

    useEffect(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        screenRef.current = { w, h };
        heartIdCounter = 0;
        const initial = Array.from({ length: 3 }, () => makeHeart(w, h));
        heartsRef.current = initial;
        setHearts(initial);

        const tick = () => {
            const sw = screenRef.current.w;
            const sh = screenRef.current.h;
            heartsRef.current = heartsRef.current.map((ht) => {
                let nx = ht.x + ht.vx, ny = ht.y + ht.vy;
                let nvx = ht.vx, nvy = ht.vy;
                if (nx < 20) { nvx = Math.abs(nvx) * 0.9 + 0.1; nx = 20; }
                if (nx > sw - ht.size - 20) { nvx = -Math.abs(nvx) * 0.9 - 0.1; nx = sw - ht.size - 20; }
                if (ny < 120) { nvy = Math.abs(nvy) * 0.9 + 0.15; ny = 120; }
                if (ny > sh - ht.size - 20) { nvy = -Math.abs(nvy) * 0.9 - 0.15; ny = sh - ht.size - 20; }
                nvx += (Math.random() - 0.5) * 0.03;
                nvy += (Math.random() - 0.5) * 0.03;
                return { ...ht, x: nx, y: ny, vx: nvx, vy: nvy };
            });
            setHearts([...heartsRef.current]);
            frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, []);

    const catchHeart = useCallback((heart, e) => {
        e.stopPropagation();
        if (window.navigator?.vibrate) window.navigator.vibrate(heart.isGolden ? [40, 25, 40] : 25);
        heartsRef.current = heartsRef.current.filter((h) => h.id !== heart.id);

        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const msg = CATCH_MSGS[catchesRef.current % CATCH_MSGS.length];
        const effectId = Date.now() + Math.random();
        setEffects((prev) => [...prev, { id: effectId, x: cx, y: cy, msg }]);
        setTimeout(() => setEffects((prev) => prev.filter((ef) => ef.id !== effectId)), 2000);

        const newCatches = catchesRef.current + 1;
        catchesRef.current = newCatches;
        setCatches(newCatches);

        if (newCatches >= HEARTS_NEEDED) {
            setTimeout(() => {
                if (frameRef.current) cancelAnimationFrame(frameRef.current);
                onComplete();
            }, 800);
        } else {
            setTimeout(() => {
                heartsRef.current.push(makeHeart(screenRef.current.w, screenRef.current.h));
                if (newCatches > 4 && heartsRef.current.length < 4) {
                    heartsRef.current.push(makeHeart(screenRef.current.w, screenRef.current.h));
                }
            }, 300);
        }
    }, [onComplete]);

    const progress = (catches / HEARTS_NEEDED) * 100;

    return (
        <>
            <div className={styles.catchHud}>
                <h2 className={styles.levelTitle}>Catch My Heart ❤️</h2>
                <p className={styles.levelSub}>catch all the floating hearts!</p>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
                <span className={styles.scoreText}>{catches} / {HEARTS_NEEDED}</span>
            </div>
            <div className={styles.gameCanvas}>
                {hearts.map((h) => (
                    <div key={h.id}
                        className={`${styles.heartTarget} ${h.isGolden ? styles.heartGolden : ""}`}
                        onClick={(e) => catchHeart(h, e)}
                        style={{ left: h.x, top: h.y, width: h.size, height: h.size }}>
                        <div className={styles.heartInner}
                            style={{ "--heart-glow": h.isGolden ? "rgba(255,215,0,0.35)" : "rgba(255,50,100,0.25)" }}>
                            <span className={styles.heartEmoji}
                                style={{ fontSize: h.isGolden ? "2.8rem" : "2rem" }}>
                                ❤️
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {effects.map((ef) => (
                <div key={ef.id} className={styles.floatMessage} style={{ left: ef.x, top: ef.y }}>
                    {ef.msg}
                </div>
            ))}
        </>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 7 — RUNAWAY BUTTON + HOLD
// ═══════════════════════════════════════════

const NO_TEXTS = ["No", "Are you sure?", "Really??", "Think again!", "Please? 🥺", "..."];
const R = 95;
const CIRC = 2 * Math.PI * R;
const HOLD_MS = 3000;

function RunawayLevel({ onComplete }) {
    const [noPos, setNoPos] = useState({ x: 60, y: 55 });
    const [noIdx, setNoIdx] = useState(0);
    const [yesScale, setYesScale] = useState(1);
    const [phase, setPhase] = useState("question");
    const [holdProgress, setHoldProgress] = useState(0);
    const [isPressing, setIsPressing] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [explosion, setExplosion] = useState([]);
    const holdStartRef = useRef(null);
    const holdFrameRef = useRef(null);

    const dodgeNo = () => {
        if (window.navigator?.vibrate) window.navigator.vibrate([30, 15, 30]);
        setNoPos({ x: 10 + Math.random() * 65, y: 20 + Math.random() * 55 });
        setNoIdx((prev) => Math.min(prev + 1, NO_TEXTS.length - 1));
        setYesScale((prev) => Math.min(prev + 0.12, 1.9));
    };

    const clickYes = () => {
        if (window.navigator?.vibrate) window.navigator.vibrate([50, 30, 100]);
        setPhase("hold");
    };

    const startHold = useCallback((e) => {
        e.preventDefault();
        if (phase !== "hold") return;
        setIsPressing(true);
        holdStartRef.current = performance.now() - (holdProgress / 100) * HOLD_MS;
        if (window.navigator?.vibrate) window.navigator.vibrate(25);

        const animate = (now) => {
            const elapsed = now - holdStartRef.current;
            const prog = Math.min((elapsed / HOLD_MS) * 100, 100);
            setHoldProgress(prog);
            if (prog >= 100) {
                setIsPressing(false);
                triggerFinale();
                return;
            }
            holdFrameRef.current = requestAnimationFrame(animate);
        };
        holdFrameRef.current = requestAnimationFrame(animate);
    }, [phase, holdProgress]);

    const endHold = useCallback(() => {
        setIsPressing(false);
        if (holdFrameRef.current) { cancelAnimationFrame(holdFrameRef.current); holdFrameRef.current = null; }
        if (phase === "hold" && holdProgress < 100) {
            const decay = () => {
                setHoldProgress((prev) => {
                    if (prev <= 0) return 0;
                    const n = prev - 1.5;
                    if (n > 0) requestAnimationFrame(decay);
                    return Math.max(0, n);
                });
            };
            requestAnimationFrame(decay);
        }
    }, [phase, holdProgress]);

    const triggerFinale = useCallback(() => {
        if (holdFrameRef.current) cancelAnimationFrame(holdFrameRef.current);
        if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100, 50, 300]);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 1200);

        const parts = Array.from({ length: 35 }, (_, i) => {
            const a = (i / 35) * Math.PI * 2;
            const d = 140 + Math.random() * 240;
            return {
                id: i,
                emoji: ["❤️", "💖", "✨", "🌹", "💍", "💌", "🦢"][i % 7],
                ex: `${Math.cos(a) * d}px`,
                ey: `${Math.sin(a) * d}px`,
                er: `${(Math.random() - 0.5) * 720}deg`,
                fs: `${1.5 + Math.random() * 1.5}rem`,
            };
        });
        setExplosion(parts);
        setPhase("explosion");
        setTimeout(() => { setExplosion([]); onComplete(); }, 1800);
    }, [onComplete]);

    useEffect(() => {
        return () => { if (holdFrameRef.current) cancelAnimationFrame(holdFrameRef.current); };
    }, []);

    const dashOffset = CIRC - (holdProgress / 100) * CIRC;
    const hbSpeed = `${Math.max(0.3, 1.2 - (holdProgress / 100) * 0.9)}s`;

    return (
        <>
            {showFlash && <div className={styles.flash} />}
            {explosion.length > 0 && (
                <div className={styles.explosionLayer}>
                    {explosion.map((ep) => (
                        <div key={ep.id} className={styles.explosionPart}
                            style={{ "--ex": ep.ex, "--ey": ep.ey, "--er": ep.er, fontSize: ep.fs }}>
                            {ep.emoji}
                        </div>
                    ))}
                </div>
            )}

            {phase === "question" && (
                <div className={styles.levelWrap}>
                    <h2 className={styles.levelTitle}>The Final Question 💍</h2>
                    <p className={styles.runawayQ}>Will you be my Valentine forever?</p>
                    <div className={styles.runawayArea}>
                        <button className={styles.yesBtn} onClick={clickYes}
                            style={{ transform: `scale(${yesScale})` }}>
                            Yes! ❤️
                        </button>
                        <button className={styles.noBtn} onClick={dodgeNo}
                            onMouseEnter={() => {
                                if (window.matchMedia?.("(hover: hover)")?.matches) dodgeNo();
                            }}
                            style={{ left: `${noPos.x}%`, top: `${noPos.y}%` }}>
                            {NO_TEXTS[noIdx]}
                        </button>
                    </div>
                </div>
            )}

            {phase === "hold" && (
                <div className={styles.levelWrap}>
                    <h2 className={styles.levelTitle}>One last thing... ❤️</h2>
                    <div className={styles.holdRingWrap}
                        onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
                        onTouchStart={startHold} onTouchEnd={endHold}>
                        <svg className={styles.ringSvg} viewBox="0 0 210 210">
                            <defs>
                                <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ff3366" />
                                    <stop offset="100%" stopColor="#ffab91" />
                                </linearGradient>
                            </defs>
                            <circle cx="105" cy="105" r={R} className={styles.ringBg} />
                            <circle cx="105" cy="105" r={R} className={styles.ringFill}
                                strokeDasharray={CIRC} strokeDashoffset={dashOffset} />
                        </svg>
                        <div className={styles.bigHeart} style={{ "--hb-speed": hbSpeed }}>💖</div>
                    </div>
                    <p className={`${styles.holdHint} ${isPressing ? styles.holdHintActive : ""}`}>
                        {isPressing ? "Almost yours..." : "Hold to seal it with love..."}
                    </p>
                </div>
            )}
        </>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 8 — GRAND CELEBRATION
// ═══════════════════════════════════════════

function CelebrationLevel({ onComplete }) {
    const [letterText, setLetterText] = useState("");
    const [letterDone, setLetterDone] = useState(false);
    const [showLetter, setShowLetter] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowLetter(true), 800);
    }, []);

    useEffect(() => {
        if (!showLetter) return;
        let idx = 0;
        const timer = setInterval(() => {
            idx++;
            setLetterText(FINAL_LETTER.slice(0, idx));
            if (idx >= FINAL_LETTER.length) {
                clearInterval(timer);
                setLetterDone(true);
            }
        }, 28);
        return () => clearInterval(timer);
    }, [showLetter]);

    const saveLetter = () => {
        const blob = new Blob([FINAL_LETTER], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "My_Valentine_Letter.txt";
        a.click();
        URL.revokeObjectURL(url);

        setTimeout(onComplete, 1000);
    };

    return (
        <div className={styles.celebWrap}>
            <div className={styles.celebHeader}>
                <h1 className={styles.celebTitle}>My Forever Valentine 💑</h1>
                <p className={styles.celebSub}>I choose you. Today and always.</p>
            </div>

            {showLetter && (
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
                    <div className={styles.letterBody}>
                        {letterText}
                        {!letterDone && <span className={styles.cursor}>|</span>}
                    </div>
                </div>
            )}

            {letterDone && (
                <button className={styles.saveBtn} onClick={saveLetter}>
                    Save Letter Forever 💌
                </button>
            )}

            <div style={{ height: 40 }} />
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 9 — FAIRY GATE (TRANSITION)
// ═══════════════════════════════════════════

function FairyGateLevel({ onComplete }) {
    const [visible, setVisible] = useState(false);
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 400);
        setTimeout(() => setShowBtn(true), 3000);
    }, []);

    return (
        <div className={`${styles.surpriseWrap} ${visible ? styles.introVisible : ""}`}>
            <div className={styles.fairyGateEmoji}>🧚‍♀️</div>
            <h1 className={styles.surpriseText}>The surprise is ready...</h1>
            <p className={styles.fairyGateSub}>A magical world is waiting for you, Pepito ✨</p>
            {showBtn && (
                <button className={styles.fairyGateBtn} onClick={onComplete}>
                    Take me to the Fairy World 🦋
                </button>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════
//  LEVEL 10 — FAIRY QUEST (WINX CLUB PUZZLE)
// ═══════════════════════════════════════════

const SEARCH_STEPS = [
    { dialogue: "Did you get my chocolates? 🍫", button: "Yes! 😍", buttonDelay: 1500 },
    { dialogue: "Good.. One box has a key to your favorite Fairy World...", button: "Which is it? 🤔", buttonDelay: 2500 },
    { dialogue: "I hold something sweet, named after a gem so red... 💎", button: "Ruby! I found it! ❤️", buttonDelay: 2000 },
    { dialogue: "Now open Ruby carefully... lift the first layer...", button: "I lifted it!", buttonDelay: 3000 },
    { dialogue: "Look underneath... what do you see? 👀", button: "I see something! ✨", buttonDelay: 2000 },
    { dialogue: "Stars! But not all stars are the same... ⭐ Some carry letters...", button: "I found letters! 📝", buttonDelay: 2500 },
    { dialogue: "Among many stars, only some carry the spell... ✨", button: null, buttonDelay: 2500 },
];

const SPARKLE_STEPS = [2, 4, 5, 6];

const TECNA_LETTERS = ["T", "E", "C", "N", "A"];

const STELLA_DIALOGUES = [
    "Hey! I'm Stella, Fairy of the Sun and Moon ☀️",
    "Someone who loves you very much asked me to deliver a message...",
    "But first, help me power up my Ring of Solaria! 💍",
];

const REVEAL_MESSAGE = `You found Tecna's spell! But here's the real magic...
Just like Stella is the brightest fairy in the Winx Club,
You are the brightest light in my universe.
My Stella. My star. My sun. My shining sun. ☀️`;

const RING_STAR_COUNT = 8;
const FINALE_EMOJIS = ["⭐", "✨", "☀️", "👑", "💍", "🌟", "⚡"];

function FairyQuestLevel() {
    const [phase, setPhase] = useState(1);
    const [visible, setVisible] = useState(false);
    const [sparkles, setSparkles] = useState([]);
    const [matrixActive, setMatrixActive] = useState(false);

    // Phase 1: Search dialogue state
    const [searchStep, setSearchStep] = useState(0);
    const [searchTypeText, setSearchTypeText] = useState("");
    const [searchTypeDone, setSearchTypeDone] = useState(false);
    const [showButton, setShowButton] = useState(false);

    // Phase 2: Star field state (unchanged)
    const [foundLetters, setFoundLetters] = useState([]);
    const [activeStars, setActiveStars] = useState([]);
    const [inputLetter, setInputLetter] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [tappedStarIdx, setTappedStarIdx] = useState(null);

    // Phase 3: Anagram state (unchanged)
    const [anagramTiles, setAnagramTiles] = useState([]);
    const [anagramSelected, setAnagramSelected] = useState([]);
    const [anagramShake, setAnagramShake] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [anagramSolved, setAnagramSolved] = useState(false);

    // Phase 4: Stella sub-phases
    const [subPhase, setSubPhase] = useState("stellaAppears");
    const [stellaDialogIdx, setStellaDialogIdx] = useState(0);
    const [stellaTypeText, setStellaTypeText] = useState("");
    const [stellaTypeDone, setStellaTypeDone] = useState(false);
    const [ringStarsLit, setRingStarsLit] = useState([]);
    const [ringPower, setRingPower] = useState(0);
    const [ringBurst, setRingBurst] = useState(false);
    const [revealText, setRevealText] = useState("");
    const [revealDone, setRevealDone] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [explosion, setExplosion] = useState([]);
    const [finaleActive, setFinaleActive] = useState(false);
    const [showGoodbye, setShowGoodbye] = useState(false);

    // Stars for Phase 2
    const [stars] = useState(() =>
        Array.from({ length: 35 }, (_, i) => ({
            id: i,
            x: 8 + Math.random() * 84,
            y: 8 + Math.random() * 60,
            size: 0.6 + Math.random() * 0.8,
            delay: Math.random() * 4,
            dur: 2 + Math.random() * 3,
        }))
    );

    // Ring star positions (8 stars in a circle)
    const [ringStarPositions] = useState(() =>
        Array.from({ length: RING_STAR_COUNT }, (_, i) => {
            const angle = (i / RING_STAR_COUNT) * Math.PI * 2 - Math.PI / 2;
            return {
                x: 50 + Math.cos(angle) * 38,
                y: 50 + Math.sin(angle) * 38,
            };
        })
    );

    // Pre-generated fairy dust particles (phases 1-3)
    const [fairyDust] = useState(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 6,
            dur: 5 + Math.random() * 5,
            size: 3 + Math.random() * 5,
        }))
    );

    // Pre-generated golden stars (phase 4 background)
    const [goldenStars] = useState(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            dur: 6 + Math.random() * 4,
        }))
    );

    // Pre-generated keepsake floating stars (phase 4D)
    const [keepsakeStars] = useState(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 6,
            dur: 5 + Math.random() * 5,
            size: 0.6 + Math.random() * 0.8,
            emoji: ["⭐", "✨", "🌟"][i % 3],
        }))
    );

    useEffect(() => {
        setTimeout(() => setVisible(true), 300);
    }, []);

    // Phase 1: Typewriter effect for search dialogue
    useEffect(() => {
        if (phase !== 1) return;
        const step = SEARCH_STEPS[searchStep];
        if (!step) return;

        setSearchTypeText("");
        setSearchTypeDone(false);
        setShowButton(false);

        let idx = 0;
        const timer = setInterval(() => {
            idx++;
            setSearchTypeText(step.dialogue.slice(0, idx));
            if (idx >= step.dialogue.length) {
                clearInterval(timer);
                setSearchTypeDone(true);
            }
        }, 35);
        return () => clearInterval(timer);
    }, [phase, searchStep]);

    // Phase 1: Show button after typewriter + delay
    useEffect(() => {
        if (!searchTypeDone || phase !== 1) return;
        const step = SEARCH_STEPS[searchStep];
        if (!step) return;

        // Last step: auto-transition to Phase 2
        if (step.button === null) {
            const t = setTimeout(() => setPhase(2), step.buttonDelay);
            return () => clearTimeout(t);
        }

        const t = setTimeout(() => setShowButton(true), step.buttonDelay);
        return () => clearTimeout(t);
    }, [searchTypeDone, searchStep, phase]);

    // Phase 4A: Stella dialogues typewriter
    useEffect(() => {
        if (phase !== 4 || subPhase !== "stellaAppears") return;
        const text = STELLA_DIALOGUES[stellaDialogIdx];
        if (!text) return;

        setStellaTypeText("");
        setStellaTypeDone(false);

        let idx = 0;
        const timer = setInterval(() => {
            idx++;
            setStellaTypeText(text.slice(0, idx));
            if (idx >= text.length) {
                clearInterval(timer);
                setStellaTypeDone(true);
            }
        }, 35);
        return () => clearInterval(timer);
    }, [phase, subPhase, stellaDialogIdx]);

    // Phase 4A: Auto-advance Stella dialogues
    useEffect(() => {
        if (phase !== 4 || subPhase !== "stellaAppears" || !stellaTypeDone) return;
        if (stellaDialogIdx < STELLA_DIALOGUES.length - 1) {
            const t = setTimeout(() => {
                setStellaDialogIdx((prev) => prev + 1);
                setStellaTypeDone(false);
            }, 1200);
            return () => clearTimeout(t);
        }
    }, [phase, subPhase, stellaTypeDone, stellaDialogIdx]);

    // Phase 4C: Grand reveal typewriter
    useEffect(() => {
        if (phase !== 4 || subPhase !== "grandReveal") return;

        setRevealText("");
        setRevealDone(false);

        let idx = 0;
        const timer = setInterval(() => {
            idx++;
            setRevealText(REVEAL_MESSAGE.slice(0, idx));
            if (idx >= REVEAL_MESSAGE.length) {
                clearInterval(timer);
                setRevealDone(true);
            }
        }, 35);
        return () => clearInterval(timer);
    }, [phase, subPhase]);

    // Phase 4 entry: Golden flash
    useEffect(() => {
        if (phase !== 4) return;
        setShowFlash(true);
        const t = setTimeout(() => setShowFlash(false), 1200);
        return () => clearTimeout(t);
    }, [phase]);

    // Phase 4D: Show goodbye note below keepsake
    useEffect(() => {
        if (!finaleActive) return;
        const t = setTimeout(() => setShowGoodbye(true), 4000);
        return () => clearTimeout(t);
    }, [finaleActive]);

    // Phase 1: Advance search step
    const advanceSearch = () => {
        if (window.navigator?.vibrate) window.navigator.vibrate(25);

        // Sparkle burst on certain steps
        if (SPARKLE_STEPS.includes(searchStep)) {
            const newSparkles = Array.from({ length: 12 }, (_, i) => ({
                id: Date.now() + i,
                x: 40 + Math.random() * 20,
                y: 40 + Math.random() * 20,
            }));
            setSparkles(newSparkles);
            setTimeout(() => setSparkles([]), 1000);
        }

        setSearchStep((prev) => prev + 1);
    };

    // Phase 2: Tap star (unchanged)
    const tapStar = (starIdx) => {
        if (activeStars.includes(starIdx) || foundLetters.length >= 5 || showInput) return;
        if (window.navigator?.vibrate) window.navigator.vibrate(15);
        setTappedStarIdx(starIdx);
        setShowInput(true);
        setInputLetter("");
    };

    // Phase 2: Submit letter (unchanged)
    const submitLetter = () => {
        const letter = inputLetter.toUpperCase().trim();
        if (!letter) return;

        if (TECNA_LETTERS.includes(letter) && !foundLetters.includes(letter)) {
            if (window.navigator?.vibrate) window.navigator.vibrate([20, 15, 30]);
            const newFound = [...foundLetters, letter];
            setFoundLetters(newFound);
            setActiveStars([...activeStars, tappedStarIdx]);
            setShowInput(false);
            setTappedStarIdx(null);

            if (newFound.length >= 5) {
                setTimeout(() => {
                    const shuffled = [...newFound];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    if (shuffled.join("") === "TECNA") {
                        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
                    }
                    setAnagramTiles(shuffled);
                    setPhase(3);
                }, 1500);
            }
        } else {
            if (window.navigator?.vibrate) window.navigator.vibrate([40, 20, 40]);
            setShowInput(false);
            setTappedStarIdx(null);
        }
    };

    // Phase 3: Tap anagram tile — now transitions to stellaAppears
    const tapAnagramTile = (idx) => {
        if (anagramSelected.includes(idx) || anagramSolved) return;
        if (window.navigator?.vibrate) window.navigator.vibrate(15);

        const newSelected = [...anagramSelected, idx];
        setAnagramSelected(newSelected);

        if (newSelected.length === 5) {
            const built = newSelected.map((i) => anagramTiles[i]).join("");
            if (built === "TECNA") {
                setAnagramSolved(true);
                if (window.navigator?.vibrate) window.navigator.vibrate([50, 30, 100]);
                setMatrixActive(true);
                setTimeout(() => {
                    setMatrixActive(false);
                    setSubPhase("stellaAppears");
                    setPhase(4);
                }, 2000);
            } else {
                setAnagramShake(true);
                setWrongAttempts((prev) => prev + 1);
                if (window.navigator?.vibrate) window.navigator.vibrate([40, 20, 40]);
                setTimeout(() => {
                    setAnagramSelected([]);
                    setAnagramShake(false);
                }, 600);
            }
        }
    };

    // Phase 4B: Tap ring star
    const tapRingStar = (idx) => {
        if (ringStarsLit.includes(idx) || ringBurst) return;
        if (window.navigator?.vibrate) window.navigator.vibrate(25);

        const newLit = [...ringStarsLit, idx];
        setRingStarsLit(newLit);
        setRingPower((newLit.length / RING_STAR_COUNT) * 100);

        if (newLit.length === RING_STAR_COUNT) {
            if (window.navigator?.vibrate) window.navigator.vibrate([50, 30, 50, 30, 100]);
            setRingBurst(true);
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 1200);
            setTimeout(() => {
                setSubPhase("grandReveal");
            }, 1500);
        }
    };

    // Phase 4D: Trigger finale
    const triggerFinale = () => {
        if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100, 50, 300]);

        const parts = Array.from({ length: 30 }, (_, i) => {
            const a = (i / 30) * Math.PI * 2;
            const d = 140 + Math.random() * 240;
            return {
                id: i,
                emoji: FINALE_EMOJIS[i % FINALE_EMOJIS.length],
                ex: `${Math.cos(a) * d}px`,
                ey: `${Math.sin(a) * d}px`,
                er: `${(Math.random() - 0.5) * 720}deg`,
                fs: `${1.5 + Math.random() * 1.5}rem`,
            };
        });
        setExplosion(parts);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 1200);
        setTimeout(() => {
            setExplosion([]);
            setSubPhase("finale");
            setFinaleActive(true);
        }, 1800);
    };

    const ringCirc = 2 * Math.PI * 45;
    const ringDashOffset = ringCirc - (ringPower / 100) * ringCirc;

    return (
        <div className={`${phase === 4 ? styles.fairyWrapStella : styles.fairyWrap} ${visible ? styles.fairyVisible : ""}`}>
            {/* Golden flash overlay */}
            {showFlash && <div className={styles.goldenFlash} />}

            {/* Explosion overlay */}
            {explosion.length > 0 && (
                <div className={styles.explosionLayer}>
                    {explosion.map((ep) => (
                        <div key={ep.id} className={styles.explosionPart}
                            style={{ "--ex": ep.ex, "--ey": ep.ey, "--er": ep.er, fontSize: ep.fs }}>
                            {ep.emoji}
                        </div>
                    ))}
                </div>
            )}

            {/* Fairy dust particles for phases 1-3 */}
            {phase < 4 && (
                <div className={styles.fairyDustLayer}>
                    {fairyDust.map((p) => (
                        <span key={p.id} className={styles.fairyDustParticle}
                            style={{
                                left: `${p.left}%`,
                                "--fd-delay": `${p.delay}s`,
                                "--fd-dur": `${p.dur}s`,
                                "--fd-size": `${p.size}px`,
                            }} />
                    ))}
                </div>
            )}

            {/* Sparkle burst overlay */}
            {sparkles.length > 0 && (
                <div className={styles.sparkleBurst}>
                    {sparkles.map((sp) => (
                        <span key={sp.id} className={styles.sparkleParticle}
                            style={{ left: `${sp.x}%`, top: `${sp.y}%` }}>
                            ✨
                        </span>
                    ))}
                </div>
            )}

            {/* Matrix rain overlay */}
            {matrixActive && (
                <div className={styles.matrixOverlay}>
                    {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className={styles.matrixColumn}
                            style={{ left: `${i * 5 + Math.random() * 3}%`, "--mc-delay": `${Math.random() * 1}s`, "--mc-dur": `${0.8 + Math.random() * 1.2}s` }}>
                            {Array.from({ length: 12 }, (_, j) => (
                                <span key={j} className={styles.matrixChar}>
                                    {String.fromCharCode(48 + Math.floor(Math.random() * 10))}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ═══════ PHASE 1: The Search (Conversational Dialogue) ═══════ */}
            {phase === 1 && (
                <div className={styles.fairyPhase}>
                    <div className={styles.butterflyWings}>🦋</div>
                    <h2 className={styles.fairyTitle}>A fairy has hidden a secret in your world...</h2>

                    <div className={styles.dialogueBubble}>
                        <div className={styles.dialogueAvatar}>✨</div>
                        <div className={styles.dialogueText}>
                            {searchTypeText}
                            {!searchTypeDone && <span className={styles.cursor}>|</span>}
                        </div>
                    </div>

                    {showButton && SEARCH_STEPS[searchStep]?.button && (
                        <button className={styles.searchResponseBtn} onClick={advanceSearch}>
                            {SEARCH_STEPS[searchStep].button}
                        </button>
                    )}

                    {/* Progress dots */}
                    <div className={styles.riddleDots}>
                        {SEARCH_STEPS.map((_, i) => (
                            <div key={i} className={`${styles.riddleDot} ${i <= searchStep ? styles.riddleDotActive : ""}`} />
                        ))}
                    </div>
                </div>
            )}

            {/* ═══════ PHASE 2: Star Field (unchanged) ═══════ */}
            {phase === 2 && (
                <div className={styles.fairyPhase}>
                    <h2 className={styles.fairyTitleSm}>Search the stars in your hands...</h2>
                    <p className={styles.fairySub}>find the letters of the fairy&apos;s name</p>

                    <div className={styles.starField}>
                        {stars.map((star) => {
                            const isActive = activeStars.includes(star.id);
                            return (
                                <div key={star.id}
                                    className={`${styles.fieldStar} ${isActive ? styles.fieldStarActive : ""} ${tappedStarIdx === star.id ? styles.fieldStarTapped : ""}`}
                                    onClick={() => tapStar(star.id)}
                                    style={{
                                        left: `${star.x}%`,
                                        top: `${star.y}%`,
                                        "--st-delay": `${star.delay}s`,
                                        "--st-dur": `${star.dur}s`,
                                    }}>
                                    <span style={{ fontSize: `${star.size}rem` }}>
                                        {isActive ? "💜" : "⭐"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {showInput && (
                        <div className={styles.letterInputOverlay}>
                            <div className={styles.letterInputCard}>
                                <p className={styles.letterInputLabel}>What letter did you find?</p>
                                <input
                                    type="text"
                                    maxLength={1}
                                    value={inputLetter}
                                    onChange={(e) => setInputLetter(e.target.value)}
                                    className={styles.letterInput}
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && submitLetter()}
                                />
                                <div className={styles.letterInputBtns}>
                                    <button className={styles.letterInputSubmit} onClick={submitLetter}>
                                        Cast ✨
                                    </button>
                                    <button className={styles.letterInputCancel} onClick={() => { setShowInput(false); setTappedStarIdx(null); }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.spellBar}>
                        {TECNA_LETTERS.map((_, i) => (
                            <div key={i} className={`${styles.spellSlot} ${foundLetters[i] ? styles.spellSlotFilled : ""}`}>
                                {foundLetters[i] || ""}
                                {foundLetters[i] && <span className={styles.spellPulseRing} />}
                            </div>
                        ))}
                    </div>
                    <p className={styles.fairyCounter}>{foundLetters.length} / 5 letters found</p>
                </div>
            )}

            {/* ═══════ PHASE 3: Anagram Puzzle (unchanged, transitions to Phase 4) ═══════ */}
            {phase === 3 && (
                <div className={styles.fairyPhase}>
                    <h2 className={styles.fairyTitleSm}>Unscramble the letters to reveal a Winx fairy&apos;s name!</h2>

                    <div className={styles.anagramAnswer}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className={`${styles.anagramSlot} ${anagramSelected[i] !== undefined ? styles.anagramSlotFilled : ""}`}>
                                {anagramSelected[i] !== undefined ? anagramTiles[anagramSelected[i]] : ""}
                            </div>
                        ))}
                    </div>

                    <div className={`${styles.anagramTiles} ${anagramShake ? styles.shake : ""}`}>
                        {anagramTiles.map((letter, i) => (
                            <button key={i}
                                className={`${styles.anagramTile} ${anagramSelected.includes(i) ? styles.anagramTileUsed : ""}`}
                                onClick={() => tapAnagramTile(i)}
                                disabled={anagramSelected.includes(i)}>
                                {letter}
                            </button>
                        ))}
                    </div>

                    {anagramSelected.length > 0 && !anagramSolved && (
                        <button className={styles.clearBtn} onClick={() => setAnagramSelected([])}>Clear</button>
                    )}

                    {wrongAttempts >= 3 && !anagramSolved && (
                        <p className={styles.fairyHint}>This fairy is the brains of the Winx Club... 💜</p>
                    )}

                    {anagramSolved && <p className={styles.fairySolved}>TECNA! ✨💜</p>}
                </div>
            )}

            {/* ═══════ PHASE 4: Stella's World ═══════ */}
            {phase === 4 && (
                <>
                    {/* Sun burst background (all sub-phases) */}
                    <div className={styles.sunBurst}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className={styles.sunRay} style={{ "--ray-angle": `${i * 30}deg` }} />
                        ))}
                    </div>

                    {/* Floating golden stars (all sub-phases) */}
                    <div className={styles.goldenStarsLayer}>
                        {goldenStars.map((gs) => (
                            <span key={gs.id} className={styles.goldenStar}
                                style={{
                                    left: `${gs.left}%`,
                                    "--gs-delay": `${gs.delay}s`,
                                    "--gs-dur": `${gs.dur}s`,
                                }}>
                                ⭐
                            </span>
                        ))}
                    </div>

                    {/* ─── Sub-Phase A: Stella Appears ─── */}
                    {subPhase === "stellaAppears" && (
                        <div className={styles.stellaPhase}>
                            <div className={styles.stellaAvatar}>
                                <span className={styles.stellaCrown}>👑</span>
                                <span className={styles.stellaSun}>☀️</span>
                                <div className={styles.stellaAura} />
                            </div>

                            <div className={styles.dialogueBubble}>
                                <div className={styles.dialogueText}>
                                    {stellaTypeText}
                                    {!stellaTypeDone && <span className={styles.cursor}>|</span>}
                                </div>
                            </div>

                            {stellaTypeDone && stellaDialogIdx === STELLA_DIALOGUES.length - 1 && (
                                <button className={styles.shineBtn} onClick={() => setSubPhase("powerRing")}>
                                    Help Stella! ✨
                                </button>
                            )}
                        </div>
                    )}

                    {/* ─── Sub-Phase B: Power the Ring ─── */}
                    {subPhase === "powerRing" && (
                        <div className={styles.stellaPhase}>
                            <div className={styles.ringSvgLarge}>
                                <svg viewBox="0 0 100 100" className={styles.goldenRingBg}>
                                    <defs>
                                        <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ffd700" />
                                            <stop offset="50%" stopColor="#ff8c00" />
                                            <stop offset="100%" stopColor="#ffd700" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,215,0,0.15)" strokeWidth="4" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#goldRingGrad)" strokeWidth="4"
                                        strokeLinecap="round" className={styles.goldenRingFill}
                                        strokeDasharray={ringCirc} strokeDashoffset={ringDashOffset}
                                        style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }} />
                                    <text x="50" y="55" textAnchor="middle" fontSize="20" className={styles.ringSunCenter}>
                                        ☀️
                                    </text>
                                </svg>

                                {/* 8 stars around the ring */}
                                {ringStarPositions.map((pos, i) => (
                                    <div key={i}
                                        className={`${styles.ringStarDim} ${ringStarsLit.includes(i) ? styles.ringStarLit : ""} ${ringBurst ? styles.ringStarPulse : ""}`}
                                        onClick={() => tapRingStar(i)}
                                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                                        ⭐
                                    </div>
                                ))}
                            </div>

                            <p className={styles.ringProgress}>
                                {ringStarsLit.length} / {RING_STAR_COUNT} stars powered
                            </p>
                        </div>
                    )}

                    {/* ─── Sub-Phase C: Grand Reveal ─── */}
                    {subPhase === "grandReveal" && (
                        <div className={styles.stellaRevealWrap}>
                            <div className={styles.stellaAvatar} style={{ transform: "scale(0.7)" }}>
                                <span className={styles.stellaCrown}>👑</span>
                                <span className={styles.stellaSun}>☀️</span>
                                <div className={styles.stellaAura} />
                            </div>

                            <div className={styles.goldenMessageCard}>
                                <div className={styles.goldenMessageBody}>
                                    {revealText}
                                    {!revealDone && <span className={styles.goldenCursor}>|</span>}
                                </div>
                            </div>

                            {revealDone && (
                                <button className={styles.shineForeverBtn} onClick={triggerFinale}>
                                    Shine Forever ✨
                                </button>
                            )}
                        </div>
                    )}

                    {/* ─── Sub-Phase D: Grand Finale (Keepsake) ─── */}
                    {subPhase === "finale" || finaleActive ? (
                        <div className={styles.keepsakeWrap}>
                            <div className={styles.keepsakeRing}>
                                <svg viewBox="0 0 120 120" className={styles.keepsakeRingSvg}>
                                    <defs>
                                        <linearGradient id="keepsakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ffd700" />
                                            <stop offset="50%" stopColor="#ff8c00" />
                                            <stop offset="100%" stopColor="#ffd700" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="url(#keepsakeGrad)"
                                        strokeWidth="3" strokeDasharray="8 4" className={styles.keepsakeRingCircle} />
                                    <text x="60" y="66" textAnchor="middle" fontSize="28" className={styles.keepsakeRingSun}>
                                        ☀️
                                    </text>
                                </svg>
                            </div>

                            <h1 className={styles.keepsakeTitle}>Forever My Stella ☀️</h1>

                            {showGoodbye && (
                                <p className={styles.goodbyeNote}>Until Next Time 💛</p>
                            )}

                            {/* Floating keepsake stars */}
                            {keepsakeStars.map((ks) => (
                                <span key={ks.id} className={styles.keepsakeFloatStar}
                                    style={{
                                        left: `${ks.left}%`,
                                        "--ks-delay": `${ks.delay}s`,
                                        "--ks-dur": `${ks.dur}s`,
                                        fontSize: `${ks.size}rem`,
                                    }}>
                                    {ks.emoji}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════
//  MAIN DAY 8 COMPONENT
// ═══════════════════════════════════════════

export default function Day8() {
    const [level, setLevel] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
    const [petals] = useState(() =>
        Array.from({ length: 12 }, (_, i) => ({
            id: i,
            emoji: ["❤️", "💖", "✨", "🌹", "🦋"][i % 5],
            left: Math.random() * 100,
            delay: Math.random() * 8,
            dur: 8 + Math.random() * 6,
        }))
    );

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Pacifico&family=Quicksand:wght@400;600;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    const nextLevel = useCallback(() => {
        if (transitioning) return;
        setTransitioning(true);
        setTimeout(() => {
            setLevel((prev) => prev + 1);
            setTransitioning(false);
        }, 700);
    }, [transitioning]);

    return (
        <div className={styles.container}>
            <div className={styles.orb1} />
            <div className={styles.orb2} />
            <div className={styles.orb3} />

            <div className={styles.petalsLayer}>
                {petals.map((p) => (
                    <span key={p.id} className={styles.petal}
                        style={{ left: `${p.left}%`, "--del": `${p.delay}s`, "--dur": `${p.dur}s` }}>
                        {p.emoji}
                    </span>
                ))}
            </div>

            {level > 0 && level <= TOTAL_LEVELS && (
                <div className={styles.levelIndicator}>
                    <span className={styles.levelLabel}>Level {level} / {TOTAL_LEVELS}</span>
                    <div className={styles.levelBar}>
                        <div className={styles.levelBarFill} style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
                    </div>
                </div>
            )}

            {transitioning && <div className={styles.transitionOverlay} />}

            <div className={styles.levelContainer} key={level}>
                {level === 0 && <IntroLevel onStart={nextLevel} />}
                {level === 1 && <ConstellationLevel onComplete={nextLevel} />}
                {level === 2 && <WordScrambleLevel onComplete={nextLevel} />}
                {level === 3 && <MemoryMatchLevel onComplete={nextLevel} />}
                {level === 4 && <QuizLevel onComplete={nextLevel} />}
                {level === 5 && <ScratchCardLevel onComplete={nextLevel} />}
                {level === 6 && <HeartCatchLevel onComplete={nextLevel} />}
                {level === 7 && <RunawayLevel onComplete={nextLevel} />}
                {level === 8 && <CelebrationLevel onComplete={nextLevel} />}
                {level === 9 && <FairyGateLevel onComplete={nextLevel} />}
                {level === 10 && <FairyQuestLevel />}
            </div>
        </div>
    );
}
