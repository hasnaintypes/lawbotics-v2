"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks";
import {
  MessageBubble,
  ChatInput,
  WelcomeHeader,
} from "@/components/feature-pages/chat";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  documentId: string;
  documentUrl: string;
}

export function ChatInterface({ documentId, documentUrl }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage } = useChat(documentId);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setHasStartedChat(messages.length > 0);
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setHasStartedChat(true);
    await sendMessage(message);
  };


  return (
    <div className="relative h-full flex flex-col">

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col h-full">
        {/* Welcome Header - Only show when no messages */}
        {!hasStartedChat && (
          <div className="flex-shrink-0">
            <WelcomeHeader />
          </div>
        )}

        {/* Messages Area - Scrollable */}
        <div
          ref={scrollAreaRef}
          className={cn(
            "flex-1 overflow-y-auto px-4 md:px-6",
            hasStartedChat ? "py-6" : "pb-6"
          )}
        >
          <div className="max-w-4xl mx-auto">
            {/* Messages */}
            {hasStartedChat && (
              <div className="space-y-6">
                {messages.map((message: any, index: any) => (
                  <MessageBubble
                    key={index}
                    message={message}
                    isLast={index === messages.length - 1}
                  />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-lg border border-purple-100 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" />
                          <div
                            className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          Analyzing document...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Fixed Chat Input */}
        <div className="flex-shrink-0 px-4 md:px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
