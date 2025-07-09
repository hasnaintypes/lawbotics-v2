import { Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Message } from "@/components/chat-with-pdf/chat-with-pdf-interface";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isLoading && <LoadingIndicator />}
    </>
  );
}

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: MessageItemProps) {
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
      >
        {message.role === "assistant" && (
          <div className="mr-3 flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        <div
          className={`rounded-xl p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          <div className="mb-1 text-sm">{message.content}</div>
          {message.references && (
            <MessageReferences references={message.references} />
          )}
        </div>
      </div>
    </div>
  );
}

interface MessageReferencesProps {
  references: {
    page: number;
    text: string;
  }[];
}

function MessageReferences({ references }: MessageReferencesProps) {
  const handleGoToPage = (page: number) => {
    // Emit an event to notify parent components about page navigation
    const event = new CustomEvent('gotopage', { detail: { page } });
    window.dispatchEvent(event);
  };

  return (
    <div className="mt-4 space-y-2">
      <Separator />
      <div className="text-xs font-semibold">References:</div>
      <div className="space-y-2">
        {references.map((ref, index) => (
          <div
            key={index}
            className="text-xs p-2 rounded bg-background/50 border border-border"
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium">Page {ref.page}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-[10px]"
                onClick={() => handleGoToPage(ref.page)}
              >
                Go to page
              </Button>
            </div>
            <p className="text-xs">{ref.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex">
        <div className="mr-3 flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="rounded-xl bg-muted p-4">
          <div className="flex space-x-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
