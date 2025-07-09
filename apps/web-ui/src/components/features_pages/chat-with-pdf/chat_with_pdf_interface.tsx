"use client"

import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../ui/button"
import { useRouter } from "next/navigation"
import { PdfViewer } from "./pdf_viewer"
import { ChatInterface } from "./chat_interface"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../ui/resizable"
import { api } from "../../../convex/_generated/api"
import { useAction } from "convex/react"
import { Id } from "../../../convex/_generated/dataModel"
import { useChatStore } from "../../../store/chat.store"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp?: string
  references?: {
    page: number
    text: string
  }[]
}

interface ChatWithPdfInterfaceProps {
  documentId: Id<"documents">
  documentUrl: string
  documentName: string
}

export function ChatWithPdfInterface({
  documentId,
  documentUrl,
  documentName = "Document.pdf",
}: ChatWithPdfInterfaceProps) {
  const router = useRouter()
  const chatAction = useAction(api.actions.chat.chat)
  const chatStore = useChatStore()
  const messages = chatStore.getMessages(documentId)
  const userMessages = messages.filter(msg => msg.role === "user")
  const hasUserMessages = userMessages.length > 0
  const initialAiMessage: Message = {
    id: "welcome-ai-message",
    content: "Hi! I am your AI assistant. You can ask me questions about this document, or select one of the suggested questions below to get started.",
    role: "assistant",
    timestamp: new Date().toISOString(),
  }
  const displayMessages = hasUserMessages ? messages : [initialAiMessage]
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [zoom, setZoom] = React.useState(100)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  // Suggested questions
  const suggestedQuestions = [
    "When does this contract expire?",
    "What are the termination conditions?",
    "Summarize the key points of this document",
    "Are there any confidentiality clauses?",
  ]
  const handleSend = async (input: string) => {
    if (!input.trim()) return
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    } 
    chatStore.addMessage(documentId, userMessage)
    setIsLoading(true)
    try {
      const response = await chatAction({
        documentId: documentId,
        message: input,
        previousMessages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          references: msg.references,
        })),
      })
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date().toISOString(),
        references: Array.isArray(response.references)
          ? response.references.map(ref => ({
              page: typeof ref.page === "number" ? ref.page : 1,
              text: ref.text || (typeof ref === "string" ? ref : "")
            }))
          : undefined,
      }
      chatStore.addMessage(documentId, assistantMessage)
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : 'Unknown error'
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `Error: ${errorDetails}`,
        role: "assistant",
        timestamp: new Date().toISOString(),
      }
      chatStore.addMessage(documentId, errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleDocumentLoad = (numPages: number) => {
    setTotalPages(numPages)
  }



  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <div className="border-b bg-background pb-4 pt-6">
        <div className="container">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{documentName}</h1>
              <p className="text-sm text-muted-foreground">Chat with Document</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
            <PdfViewer
              url={documentUrl}
              currentPage={currentPage}
              totalPages={totalPages}
              zoom={zoom}
              isFullscreen={isFullscreen}
              onZoomIn={() => setZoom((prev) => Math.min(prev + 10, 200))}
              onZoomOut={() => setZoom((prev) => Math.max(prev - 10, 50))}
              onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              onDocumentLoad={handleDocumentLoad}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <ChatInterface
              messages={displayMessages}
              isLoading={isLoading}
              suggestedQuestions={suggestedQuestions}
              onSendMessage={handleSend}
              isFullscreen={isFullscreen}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
