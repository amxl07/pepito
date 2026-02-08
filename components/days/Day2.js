"use client";

import { useState } from "react";
import styles from "./Day2.module.css";
import Image from "next/image";

export default function Day2() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSealBroken, setIsSealBroken] = useState(false);
    const [showLetter, setShowLetter] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [noBtnPosition, setNoBtnPosition] = useState({ top: "0", left: "0" });
    const [showNoBtn, setShowNoBtn] = useState(true);

    const handleBreakSeal = () => {
        setIsSealBroken(true);
        setTimeout(() => {
            setIsOpen(true);
        }, 800);
        setTimeout(() => {
            setShowLetter(true);
        }, 2000);
    };

    const handleNoHover = () => {
        // Move "No" button randomly
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        setNoBtnPosition({ transform: `translate(${x}px, ${y}px)` });
    };

    const handleYes = () => {
        setAccepted(true);
        // Trigger confetti here ideally
    };

    if (accepted) {
        return (
            <div className={styles.container}>
                <div className={styles.celebration}>
                    <h1 className={styles.yesTitle}>YAY! I knew it! 💖</h1>
                    <div className={styles.heartExplosion}>💖</div>
                    <p className={styles.loveNote}>You've made me the happiest person alive!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {!showLetter ? (
                <div className={`${styles.envelopeWrapper} ${isOpen ? styles.open : ''}`} onClick={!isSealBroken ? handleBreakSeal : null}>
                    <div className={styles.envelope}>
                        <div className={styles.front}>
                            <div className={styles.flapLeft}></div>
                            <div className={styles.flapRight}></div>
                            <div className={styles.flapBottom}></div>
                            <div className={`${styles.flapTop} ${isOpen ? styles.open : ''}`}></div>

                            {!isSealBroken && (
                                <div className={`${styles.waxSeal} ${isSealBroken ? styles.broken : ''}`}>
                                    <span className={styles.initial}>P</span>
                                </div>
                            )}
                        </div>

                        <div className={`${styles.card} ${isOpen ? styles.slideOut : ''}`}>
                            <div className={styles.cardContent}>
                                <p>A Question for you...</p>
                            </div>
                        </div>
                    </div>
                    {!isSealBroken && <p className={styles.instruction}>Tap to break the seal</p>}
                </div>
            ) : (
                <div className={`${styles.letterView} ${styles.fadeIn}`}>
                    <div className={styles.letterPaper}>
                        <p className={styles.greeting}>My Dearest,</p>
                        <p className={styles.body}>
                            Every moment with you is a treasure.
                            You bring so much light into my life.
                        </p>
                        <p className={styles.body}>
                            I have just one question...
                        </p>
                        <h2 className={styles.question}>Will you be my Valentine?</h2>

                        <div className={styles.actions}>
                            <button className={styles.yesBtn} onClick={handleYes}>YES! 💖</button>
                            {showNoBtn && (
                                <button
                                    className={styles.noBtn}
                                    onMouseEnter={handleNoHover}
                                    onClick={handleNoHover}
                                    style={noBtnPosition}
                                >
                                    No
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
