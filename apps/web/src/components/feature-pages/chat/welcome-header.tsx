"use client";

import { useEffect, useState } from "react";
import { Sparkles, Scale, FileSearch } from "lucide-react";

export function WelcomeHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center py-12 md:py-16 px-4">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 shadow-xl">
          <Scale className="h-10 w-10 text-white" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-4">
          Ask Anything
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Get instant insights from your legal documents with AI-powered
          analysis
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200 shadow-sm">
            <FileSearch className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              Smart Analysis
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-indigo-200 shadow-sm">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Instant Answers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
