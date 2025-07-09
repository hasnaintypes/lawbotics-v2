"use client"

import React, { useRef, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageList } from "./message_list"
import { SuggestedQuestions } from "./suggested_questions"
import type { Message } from "./chat_with_pdf_interface"

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  isFullscreen: boolean
  suggestedQuestions?: string[]
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  isFullscreen,
  suggestedQuestions = [],
}: ChatInterfaceProps) {
  const [input, setInput] = React.useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    onSendMessage(input)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    onSendMessage(question)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          <MessageList messages={messages} isLoading={isLoading} />

          {messages.length === 1 && suggestedQuestions.length > 0 && !isLoading && (
            <SuggestedQuestions questions={suggestedQuestions} onSelectQuestion={handleSuggestedQuestion} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-background">
        <div className="max-w-3xl mx-auto flex items-center gap-1 sm:gap-2">
          <Button
            size="icon"
            variant="outline"
            className="shrink-0 rounded-full"
            onClick={() => scrollAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Sparkles className="h-4 w-4" />
            <span className="sr-only">Suggestions</span>
          </Button>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-12 py-4 sm:py-6 rounded-full border-primary/20 focus-visible:ring-primary/30 text-sm sm:text-base"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-primary/10"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4 text-primary" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
