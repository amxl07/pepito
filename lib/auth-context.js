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

        // Always start with NOT authenticated - require name every time
        setIsAuthenticated(false);
        setShowValentineQuestion(true);
        setLoading(false);
    }, []);

    const login = (password) => {
        if (password.toLowerCase() === SECRET_KEY) {
            const newVisitCount = visitCount + 1;
            localStorage.setItem("pepito_visit_count", newVisitCount.toString());

            setIsAuthenticated(true);
            setShowValentineQuestion(true); // Always show Valentine question after login
            setVisitCount(newVisitCount);
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
