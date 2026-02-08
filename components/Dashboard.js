"use client";

import { useDate } from "@/lib/date-context";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import FloatingElements from "./FloatingElements";

export default function Dashboard() {
    const { daysSchedule, isDayUnlocked, getTimeUntilUnlock, getNextUnlockingDay } = useDate();
    const nextDay = getNextUnlockingDay();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="dashboard-container fade-in">
            <FloatingElements />

            {/* Header */}
            <header className="dashboard-header">
                <h1 className="dashboard-title">
                    🌸 Valentine's Week 🌸
                </h1>
                <p className="dashboard-subtitle">
                    A new surprise unlocks every day at <span className="highlight">11:11</span> ✨
                </p>
            </header>

            {/* Next Unlock Banner */}
            {nextDay && (
                <div className="next-unlock-banner fade-in">
                    <p className="next-unlock-text">
                        Next surprise: <strong>{nextDay.icon} {nextDay.title}</strong>
                    </p>
                    <CountdownTimer timeRemaining={getTimeUntilUnlock(nextDay.id)} />
                </div>
            )}

            {/* Days Grid */}
            <div className="days-grid">
                {daysSchedule.map((day) => {
                    const isUnlocked = isDayUnlocked(day.id);
                    const timeRemaining = getTimeUntilUnlock(day.id);
                    const isNext = nextDay && nextDay.id === day.id;

                    return (
                        <div
                            key={day.id}
                            className={`day-card ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'next' : ''}`}
                        >
                            <div className="day-card-content">
                                <div className="day-icon-wrap">
                                    <span className="day-icon">{day.icon}</span>
                                    {isUnlocked && <span className="check-mark">✓</span>}
                                </div>

                                <div className="day-info">
                                    <h3 className="day-title">{day.title}</h3>
                                    <p className="day-date">
                                        {formatDate(day.date)} • 11:11 AM
                                    </p>
                                </div>

                                <div className="day-status">
                                    {isUnlocked ? (
                                        <Link href={`/day/${day.id}`} className="open-btn">
                                            Open 💝
                                        </Link>
                                    ) : (
                                        <div className="locked-badge">
                                            🔒 Locked
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Countdown for locked days */}
                            {!isUnlocked && timeRemaining && (
                                <div className="day-countdown">
                                    <p className="countdown-label">Unlocks in:</p>
                                    <CountdownTimer timeRemaining={timeRemaining} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Message */}
            <footer className="dashboard-footer">
                <p>Made with 💖 for Pepito</p>
            </footer>
        </div>
    );
}
