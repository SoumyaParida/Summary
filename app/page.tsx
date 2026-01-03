"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { summarizeRecipe } from "@/utils/AiModal";
import "./Landing.css";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function formatMessageToReactElements(text: string): (string | JSX.Element)[] {
  const parts = text
    .split(/(\*\*.*?\*\*|\*.*?\*|\n)/g) // Split by bold (**text**), italic (*text*), and newline
    .filter(Boolean); // Remove empty strings

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Bold text
      return (
        <b key={index}>{part.slice(2, -2)}</b> // Remove the ** and wrap in <b>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      // Italic text
      return (
        <i key={index}>{part.slice(1, -1)}</i> // Remove the * and wrap in <i>
      );
    }
    if (part === "\n") {
      // Newline
      return <br key={index} />;
    }
    return part; // Regular text
  });
}

function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUrl = searchParams.get("url") || "";
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
  };

  const handleClear = () => {
    setUrl(""); // Clear the URL input
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const passUrl = () => {
    if (url.trim() !== "") {
      router.push(`/dashboard?url=${encodeURIComponent(url)}`);
    } else {
      alert("Please enter a valid YouTube URL.");
    }
  };

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white">
        <header>
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={300}
                height={150}
                priority
                className="hover:opacity-90"
              />
            </Link>

            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-lg font-medium text-gray-500 hover:text-white-600 py-2 px-2 rounded-md bg-gradient-to-tl from-blue-600 to-violet-600 text-white"
              >
                Dashboard
              </Link>
            </div>
          </nav>
        </header>

        <section className="flex flex-col items-center py-4 px-4">
          {/* Adjusted padding for the section */}
          <h1 className="text-7xl font-bold text-center text-gray-800 dark:text-gray-200">
            YouTube Video Summary
          </h1>

          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              <b>
                AI-powered, We turn your favorite YouTube videos into beautifully summarized,
                well-texted guides in any language!
              </b>
            </p>
          </div>

          <div className="overflow-y-auto w-full rounded-md dark:bg-neutral-800 mb-0">
            <Suspense fallback={null}>
             <main className="mt-4 flex min-h-screen flex-col sm:p-8 bg-white">
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <Input
                type="url"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={handleInputChange}
                className="summary-content flex-grow"
              />
              <button
                type="button"
                onClick={handleClear}
                className="text-red-500 underline text-sm"
              >
                <b>Clear</b>
              </button>
            </div>
            <div className="flex items-center">
                <button
                  type="button"
                  disabled={loading}
                  onClick={passUrl}
                  className="font-medium text-gray-500 hover:text-white py-2 px-4 rounded-md bg-gradient-to-tl from-blue-600 to-violet-600 text-white text-center w-full"
                >
                  Summarize
              </button>
            </div>
          </form> 
          </main>
            </Suspense>
          </div>
        </section>


  </div>

  
  {/* Footer Section */}
  <footer className="bg-gray-900 text-white py-6">
    {/* Adjusted padding for footer */}
    <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-between">
        {/* Solutions Section */}
        <div>
          <p className="inline-block text-gray-100">Our Solutions: </p>
          <Link href="/dashboard/content/tutor-ai" className="text-gray-400 hover:text-gray-100">
            Tutor AI
          </Link>
          <span> | </span>
          <Link href="/dashboard/content/contract-summariser" className="text-gray-400 hover:text-gray-100">
            Contract Summariser
          </Link>
          <span> | </span>
          <Link href="/dashboard/content/audio-to-text-ai" className="text-gray-400 hover:text-gray-100">
            Audio to Text
          </Link>
        </div>

        {/* Contact Section */}
        <div>
          <Link href="/contact" className="text-gray-400 hover:text-gray-100">
            Contact Us
          </Link>
          <span> | </span>
          <Link href="/privacy" className="text-gray-400 hover:text-gray-100">
            Privacy Policy
          </Link>
          <span> | </span>
          <Link href="/terms" className="text-gray-400 hover:text-gray-100">
            Terms of Service
          </Link>
        </div>
      </div>
      <p className="mt-4">&copy; 2024 InnoAI. All rights reserved.</p>
    </div>
  </footer>
</div>

  );
}

export default Home