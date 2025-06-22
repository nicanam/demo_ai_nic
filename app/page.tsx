"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AnamClient, createClient } from "@anam-ai/js-sdk";

export default function Home() {
  const [isChatActive, setIsChatActive] = useState(false);
  const [anamClient, setAnamClient] = useState<AnamClient | null>(null);
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
      
      // Set chat active first to render video elements
      setIsChatActive(true);

      // Wait for next tick to ensure DOM is updated
      await new Promise(resolve => setTimeout(resolve, 100));

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
    <>
      {/* Black Header Bar with Logo */}
      <header className="h-[100px] bg-black flex items-center justify-center flex-shrink-0">
        <Image
          src="/anam_logo.png"
          alt="Anam Logo"
          width={400}
          height={100}
          className="h-full w-auto object-contain"
          priority
        />
      </header>

      {/* Main Content - Constrained to fit between header and footer */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 overflow-hidden">
        <div className="w-full text-center flex flex-col h-full max-w-6xl mx-auto">
          {/* Main Text */}
          <div className="mb-2 flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Talk to AI Sales Agent
            </h1>
          </div>

          {/* Preview Image OR Video Chat - Takes available space */}
          <div className="flex-1 flex flex-col justify-center min-h-0 mb-2">
            {!isChatActive ? (
              // Preview Image - Responsive to available space
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/sales_agent_preview.png"
                  alt="AI Sales Agent Preview"
                  width={800}
                  height={600}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            ) : (
              // Video Chat Interface - Responsive height
              <div className="w-full bg-gray-900 flex flex-col p-3 rounded-lg h-full min-h-0">
                {/* Status Bar */}
                <div className="flex justify-between items-center bg-white p-2 mb-3 rounded-lg shadow-sm flex-shrink-0">
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

                {/* Video Area - Takes remaining space */}
                <div className="relative w-full flex-1 bg-black flex items-center justify-center rounded-lg overflow-hidden">
                  {/* Loading/Error States */}
                  {(isLoadingAI || error) && (
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
                    </div>
                  )}

                  {/* Video and Audio Elements */}
                  <video
                    ref={videoRef}
                    id="anam-video-feed"
                    className="w-full h-full object-cover rounded-lg"
                    autoPlay
                    playsInline
                    muted={false}
                  />
                  <audio ref={audioRef} id="anam-audio-feed" autoPlay />
                </div>
              </div>
            )}
          </div>

          {/* Start/Stop Button */}
          <div className="flex-shrink-0">
            {!isChatActive ? (
              <button
                onClick={startChat}
                disabled={isLoadingAI}
                className={`px-6 py-3 ${
                  isLoadingAI
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105`}
              >
                {isLoadingAI ? "Starting..." : "Start Chatting with AI Sales Agent"}
              </button>
            ) : (
              <button
                onClick={stopChat}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-200"
              >
                Stop Chat
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
