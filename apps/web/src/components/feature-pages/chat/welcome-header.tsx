"use client";

import { useEffect, useState } from "react";
import { MessageSquare, FileSearch, Zap } from "lucide-react";

interface WelcomeHeaderProps {
  onSuggestedClick?: (message: string) => void;
}

/**
 * Welcome Header Component
 *
 * Displays welcome message and feature highlights when chat is empty.
 * Includes animated entrance effect.
 */
export function WelcomeHeader({ onSuggestedClick }: WelcomeHeaderProps) {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6 shadow-lg border border-slate-200">
          <MessageSquare className="h-10 w-10 text-slate-600" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
          Ask Anything
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Get instant insights from your legal documents with AI-powered
          analysis
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <FileSearch className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Smart Analysis
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <Zap className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Instant Answers
            </span>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">
            Try asking:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() =>
                onSuggestedClick?.("What are the key points in this document?")
              }
              className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer text-left"
            >
              <p className="text-sm text-slate-700">
                "What are the key points in this document?"
              </p>
            </button>
            <button
              onClick={() => onSuggestedClick?.("Summarize the main findings")}
              className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer text-left"
            >
              <p className="text-sm text-slate-700">
                "Summarize the main findings"
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
