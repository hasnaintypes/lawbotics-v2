"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

/**
 * Chat Input Component
 *
 * Handles message input with auto-resize textarea and send functionality.
 * Includes keyboard shortcuts and loading states.
 */
export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300",
            isFocused
              ? "border-slate-400 shadow-md"
              : "border-slate-200 hover:border-slate-300"
          )}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask me anything about your document..."
            className={cn(
              "min-h-[64px] max-h-[120px] resize-none border-0 focus-visible:ring-0 bg-transparent",
              "text-base placeholder:text-slate-400 pr-32 py-5 px-6 rounded-2xl font-medium"
            )}
            disabled={isLoading}
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-all duration-300",
                "bg-slate-900 hover:bg-slate-800",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              )}
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-between mt-3 px-2">
        <p className="text-xs text-slate-400">
          Press Enter to send, Shift + Enter for new line
        </p>
        <p className="text-xs text-slate-400">{message.length}/2000</p>
      </div>
    </div>
  );
}
