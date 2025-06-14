"use client";
import { useState, useEffect } from "react";

export default function CallToActionButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show button after 5 minutes (300,000 milliseconds)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 300000);

    return () => clearTimeout(timer);
  }, []);

  if (!showButton) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <a
        href="https://calendar.app.google/pa4tCGvqtZq5Jdhj9"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-100 hover:bg-green-200 border border-green-300 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
      >
        Book a Call 📞
      </a>
    </div>
  );
} 