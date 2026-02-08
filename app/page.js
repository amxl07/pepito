"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import LoginScreen from "@/components/LoginScreen";
import ValentineQuestion from "@/components/ValentineQuestion";
import Dashboard from "@/components/Dashboard";

// Different intro messages for return visits
const INTRO_MESSAGES = [
  ["Hey Pepito...", "I have something to ask you 💕"],
  ["Welcome back, my love...", "You know what's coming 🥰"],
  ["Missed me?", "I missed you too 💖"],
  ["Hello again, beautiful!", "Ready for the question? 💝"],
  ["There you are!", "I've been waiting for you 🌹"],
  ["My favorite person is here!", "Time for our daily ritual 💗"],
];

export default function Home() {
  const { isAuthenticated, loading, showValentineQuestion, acceptValentine, visitCount } = useAuth();
  const [step, setStep] = useState(0); // 0: Check, 1: Intro, 2: Question, 3: Dashboard

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (showValentineQuestion) {
        setStep(1); // Start with intro, then go to question
      } else {
        setStep(3); // Go straight to dashboard
      }
    }
  }, [loading, isAuthenticated, showValentineQuestion]);

  if (loading) return null;

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {step === 1 && (
        <IntroSequence
          onComplete={() => setStep(2)}
          visitCount={visitCount}
        />
      )}

      {step === 2 && (
        <ValentineQuestion
          onYes={() => {
            acceptValentine();
            setStep(3);
          }}
          visitCount={visitCount}
        />
      )}

      {step === 3 && (
        <Dashboard />
      )}
    </main>
  );
}

function IntroSequence({ onComplete, visitCount = 0 }) {
  const [textIndex, setTextIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const messageIndex = visitCount % INTRO_MESSAGES.length;
  const messages = INTRO_MESSAGES[messageIndex];

  useEffect(() => {
    // Show first message
    const t1 = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    // Transition to second message
    const t2 = setTimeout(() => {
      setFadeOut(false);
      setTextIndex(1);
    }, 2200);

    // Fade out and complete
    const t3 = setTimeout(() => {
      setFadeOut(true);
    }, 4000);

    const t4 = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={fadeOut ? '' : 'fade-in'}
      style={{
        textAlign: 'center',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      <h1
        style={{
          fontSize: '2.2rem',
          background: 'linear-gradient(135deg, #d14d4d, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {messages[textIndex]}
      </h1>
    </div>
  );
}
