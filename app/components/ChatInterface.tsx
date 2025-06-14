"use client";
import { AnamClient, createClient } from "@anam-ai/js-sdk";
import React, { useEffect, useRef, useState } from "react";

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [anamClient, setAnamClient] = useState<AnamClient | null>(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for tracking session duration
  useEffect(() => {
    if (isChatActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isChatActive]);

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize Anam client and get session token
  const initAnamClient = async () => {
    try {
      setIsLoadingAI(true);
      setError(null);

      // Use the provided Persona ID from the requirements
      const personaId = "a5d6a1e3-391b-4976-85eb-204c9b4a55b1";
      
      // Fetch session token from API
      const response = await fetch(`/api/anam-auth/${personaId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get Anam session token");
      }

      const { sessionToken } = await response.json();

      // Create Anam client with session token
      const client = createClient(sessionToken);
      setAnamClient(client);

      return client;
    } catch (err: unknown) {
      console.error("Error initializing Anam client:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize AI Agent");
      return null;
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Start the AI chat session
  const startChat = async () => {
    try {
      setIsLoadingAI(true);
      setElapsedTime(0);

      // Initialize Anam client if not already done
      let client = anamClient;
      if (!client) {
        client = await initAnamClient();
      }

      if (!client) {
        throw new Error("Failed to initialize AI Agent");
      }

      // Start streaming to video and audio elements
      await client.streamToVideoAndAudioElements("anam-video-feed", "anam-audio-feed");

      setIsChatActive(true);
    } catch (err: unknown) {
      console.error("Error starting AI chat:", err);
      setError(err instanceof Error ? err.message : "Failed to start AI Agent");
      setIsChatActive(false);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Stop the AI chat session
  const stopChat = () => {
    if (anamClient) {
      anamClient.stopStreaming();
    }
    setIsChatActive(false);
    setElapsedTime(0);
  };

  // Handle closing the interface
  const handleClose = () => {
    if (anamClient) {
      anamClient.stopStreaming();
      setAnamClient(null);
    }
    setIsChatActive(false);
    setElapsedTime(0);
    onClose();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (anamClient) {
        anamClient.stopStreaming();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [anamClient]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">AI Sales Agent</h1>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 p-2"
            aria-label="Close chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col p-4 min-h-0 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col gap-3">
          {/* Status Bar */}
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm flex-shrink-0">
            <div className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  isChatActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                } mr-3`}
              />
              <span className="text-gray-700 font-medium text-sm">
                {isChatActive ? "Live Session" : "Ready to Start"}
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              <span className="font-medium">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          {/* Video Interface */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden min-h-0">
            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
              {/* Loading/Error/Inactive States */}
              {(isLoadingAI || error || !isChatActive) && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
                  {isLoadingAI && (
                    <div className="text-white text-base flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Connecting to AI Sales Agent...
                    </div>
                  )}
                  {error && (
                    <div className="text-red-400 text-base text-center p-4">
                      <p className="mb-2">Error: {error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                  {!isLoadingAI && !error && !isChatActive && (
                    <div className="text-white text-base flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-500 mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <p className="text-center">Ready to start your sales training session</p>
                    </div>
                  )}
                </div>
              )}

              {/* Video and Audio Elements */}
              <video
                ref={videoRef}
                id="anam-video-feed"
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted={false}
              />
              <audio ref={audioRef} id="anam-audio-feed" autoPlay />
            </div>
          </div>

          {/* Controls - Always visible with enough space */}
          <div className="flex justify-center flex-shrink-0 pb-8">
            {!isChatActive ? (
              <button
                onClick={startChat}
                disabled={isLoadingAI}
                className={`px-6 py-3 ${
                  isLoadingAI
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg shadow-md transition-all flex items-center font-medium`}
              >
                {isLoadingAI ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Starting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Start Chat
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={stopChat}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all flex items-center font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
                Stop Chat
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface; 