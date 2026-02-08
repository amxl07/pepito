"use client";

import { useDate } from "@/lib/date-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
// Dynamic imports for Days? Or just static map. Static is fine for 8 days.
import Day1 from "@/components/days/Day1";
import Day2 from "@/components/days/Day2";
import Day3 from "@/components/days/Day3";

import Day4 from "@/components/days/Day4";
import Day5 from "@/components/days/Day5";

import Day6 from "@/components/days/Day6";
import Day7 from "@/components/days/Day7";

import Day8 from "@/components/days/Day8";

const DayComponents = {
    1: Day1,
    2: Day2,
    3: Day3,
    4: Day4,
    5: Day5,
    6: Day6,
    7: Day7,
    8: Day8,
};

export default function DayPage() {
    const params = useParams();
    const id = parseInt(params.id);
    const { unlockedDay } = useDate();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (id > unlockedDay) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1>Not yet... 👀</h1>
                <Link href="/" style={{ marginTop: '20px', textDecoration: 'underline' }}>Back</Link>
            </div>
        );
    }

    const Component = DayComponents[id];

    if (!Component) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1>Coming Soon...</h1>
                <Link href="/">Back</Link>
            </div>
        );
    }

    return (
        <div style={{ height: '90vh', padding: '20px', position: 'relative' }}>
            <Link href="/" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '1.5rem', textDecoration: 'none' }}>←</Link>
            <Component />
        </div>
    );
}
