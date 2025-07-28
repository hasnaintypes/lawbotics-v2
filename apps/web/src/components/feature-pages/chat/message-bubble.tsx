"use client";

import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { User, Bot, ExternalLink } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

/**
 * Message Bubble Component
 *
 * Displays individual chat messages with appropriate styling for user/bot messages.
 * Includes support for document references and citations.
 */
export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
          <Bot className="h-5 w-5 text-slate-600" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] space-y-3",
          isUser && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-6 py-4 shadow-sm transition-all duration-300",
            isUser
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-900",
            isLast && "animate-in slide-in-from-bottom-3 duration-500"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </p>
        </div>

        {/* References */}
        {message.references && message.references.length > 0 && (
          <div className="space-y-2 max-w-full">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
              Document References
            </p>
            <div className="space-y-2">
              {message.references.map((ref, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {ref.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 font-bold text-xs bg-white px-2 py-1 rounded-full border border-slate-200">
                      <span>Page {ref.page}</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center shadow-sm">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
