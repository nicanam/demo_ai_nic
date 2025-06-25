"use client";

export default function LinkedInButton() {
  return (
    <div className="fixed bottom-8 left-8 z-50">
      <a
        href="https://www.linkedin.com/in/nsiegle/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-100 hover:bg-blue-200 border border-blue-300 text-black px-6 py-3 rounded-lg shadow-lg text-lg font-medium transition-all duration-200 transform hover:scale-105"
      >
        Nic's LinkedIn
      </a>
    </div>
  );
} 