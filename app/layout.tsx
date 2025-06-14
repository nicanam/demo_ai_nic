import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CallToActionButton from "./components/CallToActionButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Sales Agent | Practice Sales Conversations",
  description: "Practice your sales conversations with AI-powered persona avatars. Improve your pitch and close more deals with realistic sales simulations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 antialiased flex flex-col h-screen`}>
        <div className="flex-1 min-h-0">
          {children}
        </div>
        <CallToActionButton />
        
        {/* Footer with required branding */}
        <footer className="w-full py-3 px-4 bg-white border-t border-gray-200 flex-shrink-0 relative">
          <div className="w-full text-center">
            <p className="text-gray-500 text-xs">
              Powered with <span className="font-bold">ANAM.AI</span>
            </p>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <a
              href="https://calendar.app.google/pa4tCGvqtZq5Jdhj9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-100 hover:bg-blue-200 text-gray-600 px-3 py-1 rounded text-xs transition-colors"
            >
              Talk to REAL SALES HUMAN at ANAM
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
