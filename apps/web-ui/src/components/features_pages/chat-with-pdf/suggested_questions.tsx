"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuggestedQuestionsProps {
  questions: string[]
  onSelectQuestion: (question: string) => void
}

export function SuggestedQuestions({ questions, onSelectQuestion }: SuggestedQuestionsProps) {
  if (!questions.length) return null

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Ask about this document</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            className="rounded-full text-xs px-4 py-2 h-auto bg-secondary/50 hover:bg-secondary"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
