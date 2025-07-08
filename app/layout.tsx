import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CallToActionButton from "./components/CallToActionButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Nic | Sales at Anam",
  description: "Talk to AI Nic, your sales representative at Anam. Experience AI-powered sales conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <div className="h-screen flex flex-col">
          <div className="flex-1 flex flex-col min-h-0" style={{ paddingBottom: "120px" }}>
            {children}
          </div>
          <CallToActionButton />
          
          {/* Footer with required branding - Always visible */}
          <footer className="w-full py-6 px-4 bg-white border-t border-gray-200 flex-shrink-0 relative flex flex-col" style={{ height: "120px" }}>
            <div className="flex-1 flex items-center justify-center">
              <div className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2">
                <a
                  href="https://www.linkedin.com/in/nsiegle/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 hover:bg-blue-200 border border-blue-300 text-black px-2 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg text-sm sm:text-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <span className="hidden sm:inline">Nic&apos;s LinkedIn</span>
                  <span className="sm:hidden">LinkedIn</span>
                </a>
              </div>
              <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2">
                <a
                  href="https://calendar.app.google/pa4tCGvqtZq5Jdhj9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 hover:bg-blue-200 border border-blue-300 text-black px-2 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg text-sm sm:text-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <span className="hidden sm:inline">Book time with human Nic here.</span>
                  <span className="sm:hidden">Book a Call</span>
                </a>
              </div>
            </div>
            <div className="w-full text-center">
              <p className="text-gray-500 text-xs">
                Powered with <span className="font-bold">ANAM.AI</span>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
