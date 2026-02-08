"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const DateContext = createContext();

// Valentine's Week Schedule - Each day unlocks at 11:11 AM
const DAYS_SCHEDULE = [
    { id: 1, title: "Rose Day", date: "2026-02-07", icon: "🌹" },
    { id: 2, title: "Propose Day", date: "2026-02-08", icon: "💍" },
    { id: 3, title: "Chocolate Day", date: "2026-02-09", icon: "🍫" },
    { id: 4, title: "Teddy Day", date: "2026-02-10", icon: "🧸" },
    { id: 5, title: "Promise Day", date: "2026-02-11", icon: "🤞" },
    { id: 6, title: "Hug Day", date: "2026-02-12", icon: "🤗" },
    { id: 7, title: "Kiss Day", date: "2026-02-13", icon: "💋" },
    { id: 8, title: "Valentine's Day", date: "2026-02-14", icon: "❤️" },
];

const UNLOCK_HOUR = 11;
const UNLOCK_MINUTE = 11;

// Get unlock timestamp for a day (11:11 AM on that date)
const getUnlockTime = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(UNLOCK_HOUR, UNLOCK_MINUTE, 0, 0);
    return date;
};

export function DateProvider({ children }) {
    const searchParams = useSearchParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [unlockedDays, setUnlockedDays] = useState([]);

    useEffect(() => {
        const debugDateParam = searchParams.get("date");
        let targetDate = new Date();

        if (debugDateParam) {
            if (debugDateParam === 'reset') {
                sessionStorage.removeItem("pepito_debug_date");
                console.log("🐞 Debug Date Reset");
            } else {
                const parsed = new Date(debugDateParam);
                if (!isNaN(parsed)) {
                    targetDate = parsed;
                    sessionStorage.setItem("pepito_debug_date", debugDateParam);
                    console.log("🐞 Debug Date Set via URL:", targetDate.toString());
                }
            }
        } else {
            const storedDate = sessionStorage.getItem("pepito_debug_date");
            if (storedDate) {
                const parsed = new Date(storedDate);
                if (!isNaN(parsed)) {
                    targetDate = parsed;
                    console.log("🐞 Debug Date Restored from Session:", targetDate.toString());
                }
            }
        }

        setCurrentDate(targetDate);
        calculateUnlockedDays(targetDate);

        // Update every second for live countdown
        const interval = setInterval(() => {
            const storedDate = sessionStorage.getItem("pepito_debug_date");
            const now = storedDate ? new Date(storedDate) : new Date();
            setCurrentDate(now);
            calculateUnlockedDays(now);
        }, 1000);

        return () => clearInterval(interval);
    }, [searchParams]);

    const calculateUnlockedDays = (now) => {
        const unlocked = DAYS_SCHEDULE.filter(day => {
            const unlockTime = getUnlockTime(day.date);
            return now >= unlockTime;
        }).map(day => day.id);

        setUnlockedDays(unlocked);
    };

    // Get time remaining until a specific day unlocks
    const getTimeUntilUnlock = (dayId) => {
        const day = DAYS_SCHEDULE.find(d => d.id === dayId);
        if (!day) return null;

        const unlockTime = getUnlockTime(day.date);
        const diff = unlockTime - currentDate;

        if (diff <= 0) return null; // Already unlocked

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, total: diff };
    };

    // Get the next day to unlock
    const getNextUnlockingDay = () => {
        const now = currentDate;
        for (const day of DAYS_SCHEDULE) {
            const unlockTime = getUnlockTime(day.date);
            if (now < unlockTime) {
                return { ...day, unlockTime };
            }
        }
        return null; // All days unlocked
    };

    const isDayUnlocked = (dayId) => unlockedDays.includes(dayId);

    return (
        <DateContext.Provider value={{
            currentDate,
            unlockedDays,
            isDayUnlocked,
            getTimeUntilUnlock,
            getNextUnlockingDay,
            daysSchedule: DAYS_SCHEDULE
        }}>
            {children}
        </DateContext.Provider>
    );
}

export function useDate() {
    return useContext(DateContext);
}
