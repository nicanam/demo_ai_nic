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
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <a
                  href="https://www.linkedin.com/in/nsiegle/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 hover:bg-blue-200 border border-blue-300 text-black px-6 py-3 rounded-lg shadow-lg text-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Nic's LinkedIn
                </a>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <a
                  href="https://calendar.app.google/pa4tCGvqtZq5Jdhj9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 hover:bg-blue-200 border border-blue-300 text-black px-6 py-3 rounded-lg shadow-lg text-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Book time with human Nic here.
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
