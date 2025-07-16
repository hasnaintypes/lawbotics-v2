"use client";

import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { User, Bot, ExternalLink } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <Bot className="h-5 w-5 text-white" />
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
            "rounded-3xl px-6 py-4 shadow-lg transition-all duration-300",
            isUser
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900",
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
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
              Document References
            </p>
            <div className="space-y-2">
              {message.references.map((ref, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 text-xs shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {ref.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-purple-600 font-bold text-xs bg-white px-2 py-1 rounded-full">
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
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
