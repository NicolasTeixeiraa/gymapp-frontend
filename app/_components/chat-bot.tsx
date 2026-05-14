"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { revalidateWorkoutDataAction } from "@/app/actions";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

const messageSchema = z.object({
  text: z.string().min(1),
});

type Props = {
  fullscreen?: boolean;
  initialMessage?: string;
};

export function ChatBot({ fullscreen = false, initialMessage }: Props) {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [chatInitialMessage, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "" },
  });
  const router = useRouter();
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

  const { messages, sendMessage, status } = useChat({
    transport,
    onData: (part) => {
      if (part.type === "data-workout-plan-created") {
        revalidateWorkoutDataAction();
        router.refresh();
      }
    },
  });

  const isActive = fullscreen || chatOpen;
  const effectiveInitialMessage = initialMessage || chatInitialMessage;

  useEffect(() => {
    if (
      isActive &&
      effectiveInitialMessage &&
      messages.length === 0 &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: effectiveInitialMessage });
    }
  }, [isActive, effectiveInitialMessage, messages.length, sendMessage]);

  useEffect(() => {
    if (!isActive) {
      initialMessageSentRef.current = false;
    }
  }, [isActive]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setChatOpen(null);
      setChatInitialMessage(null);
    }
  };

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    form.reset();
    sendMessage({ text: values.text });
  };

  const isLoading = status === "submitted" || status === "streaming";

  const chatContent = (
    <>
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
                  <span>{textContent}</span>
                ) : (
                  <Streamdown
                    mode={streamMode}
                    components={{ p: "div" }}
                  >
                    {textContent}
                  </Streamdown>
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

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="shrink-0 flex gap-2 border-t border-border p-4"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Escreva uma mensagem..."
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send size={18} />
          </Button>
        </form>
      </Form>
    </>
  );

  if (fullscreen) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {chatContent}
      </div>
    );
  }

  return (
    <Sheet open={chatOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="flex h-[85vh] flex-col gap-0 p-0">
        <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
          <SheetTitle className="font-anton text-lg uppercase tracking-wide">
            Gym App
          </SheetTitle>
        </SheetHeader>
        {chatContent}
      </SheetContent>
    </Sheet>
  );
}
