"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatBot() {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [chatInitialMessage, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );
  const [input, setInput] = useState("");
  const initialMessageSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
        credentials: "include",
      }),
    [],
  );

  const { messages, sendMessage, status } = useChat({ transport });

  useEffect(() => {
    if (
      chatOpen &&
      chatInitialMessage &&
      messages.length === 0 &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: chatInitialMessage });
    }
  }, [chatOpen, chatInitialMessage, messages.length, sendMessage]);

  useEffect(() => {
    if (!chatOpen) {
      initialMessageSentRef.current = false;
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setChatOpen(null);
      setChatInitialMessage(null);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage({ text });
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <Sheet open={chatOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="flex h-[85vh] flex-col gap-0 p-0">
        <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
          <SheetTitle className="font-anton text-lg uppercase tracking-wide">
            Gym App
          </SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center gap-3 pt-8">
              <p className="text-sm text-muted-foreground">
                Como posso te ajudar?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  sendMessage({ text: "Monte meu plano de treino" })
                }
              >
                Monte meu plano de treino
              </Button>
            </div>
          )}

          {messages.map((message, index) => {
            const textContent = message.parts
              .filter(isTextUIPart)
              .map((p) => p.text)
              .join("");

            const isLastMessage = index === messages.length - 1;
            const streamMode =
              message.role === "assistant" &&
              isLastMessage &&
              status === "streaming"
                ? "streaming"
                : "static";

            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  {message.role === "user" ? (
                    <p>{textContent}</p>
                  ) : (
                    <Streamdown mode={streamMode}>{textContent}</Streamdown>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-secondary px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 flex gap-2 border-t border-border p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Escreva uma mensagem..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
