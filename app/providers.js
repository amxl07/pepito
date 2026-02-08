"use client";

import { AuthProvider } from "@/lib/auth-context";
import { DateProvider } from "@/lib/date-context";
import { Suspense } from "react";
import CursorHearts from "@/components/CursorHearts";

export function Providers({ children }) {
    return (
        <Suspense fallback={<div style={{ opacity: 0 }}></div>}>
            <AuthProvider>
                <DateProvider>
                    <CursorHearts />
                    {children}
                </DateProvider>
            </AuthProvider>
        </Suspense>
    );
}
