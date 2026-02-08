"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const SECRET_KEY = "pepito";

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showValentineQuestion, setShowValentineQuestion] = useState(true);
    const [visitCount, setVisitCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get visit count for variety in messages
        const storedVisitCount = parseInt(localStorage.getItem("pepito_visit_count") || "0");
        setVisitCount(storedVisitCount);

        // Check for persisted session
        const isAuth = localStorage.getItem("pepito_authenticated") === "true";
        const hasAccepted = localStorage.getItem("pepito_accepted") === "true";

        if (isAuth) {
            setIsAuthenticated(true);
            setShowValentineQuestion(!hasAccepted);
        } else {
            setIsAuthenticated(false);
            setShowValentineQuestion(true);
        }

        setLoading(false);
    }, []);

    const login = (password) => {
        if (password.toLowerCase() === SECRET_KEY) {
            // Use current visit count for display, THEN increment for next time
            const hasAccepted = localStorage.getItem("pepito_accepted") === "true";

            const newVisitCount = visitCount + 1;
            localStorage.setItem("pepito_visit_count", newVisitCount.toString());
            localStorage.setItem("pepito_authenticated", "true"); // Persist session

            setIsAuthenticated(true);
            setShowValentineQuestion(!hasAccepted); // Only show if not previously accepted
            // Keep visitCount as-is for this session's display
            // Only update localStorage for next visit
            return true;
        }
        return false;
    };

    const acceptValentine = () => {
        localStorage.setItem("pepito_accepted", "true");
        setShowValentineQuestion(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            loading,
            showValentineQuestion,
            acceptValentine,
            visitCount
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
