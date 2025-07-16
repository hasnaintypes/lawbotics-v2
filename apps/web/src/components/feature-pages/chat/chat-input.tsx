"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [message])

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 transition-all duration-300",
            isFocused ? "border-purple-400 shadow-2xl bg-white/90" : "border-gray-200 hover:border-purple-300",
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
              "text-base placeholder:text-gray-400 pr-32 py-5 px-6 rounded-3xl font-medium",
            )}
            disabled={isLoading}
          />

          <div className="absolute right-4 bottom-4 flex items-center gap-2">
          
            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-all duration-300",
                "bg-gradient-to-r from-purple-600 to-indigo-600",
                "hover:from-purple-700 hover:to-indigo-700",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl",
              )}
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between mt-3 px-2">
        <p className="text-xs text-gray-400">Press Enter to send, Shift + Enter for new line</p>
        <p className="text-xs text-gray-400">{message.length}/2000</p>
      </div>
    </div>
  )
}
