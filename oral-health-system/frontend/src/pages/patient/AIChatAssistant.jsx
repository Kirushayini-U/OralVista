import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Bot,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";
import api from "../../api/axios.js";

import {
  getStoredUser,
} from "../../api/authStorage.js";

const suggestedQuestions = [
  "What causes bleeding gums?",
  "How can I reduce tooth sensitivity?",
  "What are the signs of tooth decay?",
  "How should I prevent bad breath?",
];

const initialAssistantMessage = (
  patientName
) => ({
  id: crypto.randomUUID(),
  role: "assistant",
  content:
    `Hello ${patientName}! I am your OralVista virtual dental assistant. ` +
    "Ask me about oral hygiene, dental symptoms and preventive care.",
  createdAt: new Date(),
});

export default function AIChatAssistant() {
  const storedUser = getStoredUser();

  const patientName = useMemo(() => {
    const name =
      storedUser?.fullName?.trim();

    if (!name) {
      return "Patient";
    }

    return name.split(" ")[0];
  }, [storedUser]);

  const [messages, setMessages] =
    useState(() => [
      initialAssistantMessage(
        patientName
      ),
    ]);

  const [input, setInput] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  const historyForApi = useMemo(
    () =>
      messages
        .slice(-10)
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages]
  );

  const sendMessage = async (
    selectedMessage
  ) => {
    const cleanMessage = String(
      selectedMessage ?? input
    ).trim();

    if (!cleanMessage || sending) {
      return;
    }

    if (cleanMessage.length > 1000) {
      setError(
        "Please keep your message below 1,000 characters."
      );

      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanMessage,
      createdAt: new Date(),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setError("");
    setSending(true);

    try {
      const response = await api.post(
        "/chat/message",
        {
          message: cleanMessage,
          history: historyForApi,
        }
      );

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          response.data?.reply ||
          "I could not generate a response.",
        urgent:
          response.data?.urgent === true,
        outOfScope:
          response.data?.outOfScope ===
          true,
        createdAt: new Date(),
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (requestError) {
      console.error(
        "AI chat request failed:",
        requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          "The dental assistant is unavailable. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    sendMessage(input);
  };

  const formatTime = (date) =>
    new Intl.DateTimeFormat(
      undefined,
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);

  return (
    <PatientLayout
      title="AI Chat Assistant"
      breadcrumb="Dashboard › AI Chat Assistant"
    >
      <div className="min-h-[calc(100vh-8rem)] rounded-[30px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-5">
        <div className="grid min-h-[720px] overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-xl shadow-sky-100/60 lg:grid-cols-[1.55fr_0.9fr]">
          {/* Chat section */}
          <section className="flex min-w-0 flex-col">
            <header className="border-b border-slate-100 bg-gradient-to-r from-white via-sky-50/70 to-teal-50/60 px-7 py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-200 bg-gradient-to-br from-cyan-100 to-teal-100 text-teal-700">
                    <Bot size={31} />

                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-800">
                        OralVista Dental Assistant
                      </h2>

                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        AI enabled
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-teal-700">
                      Preliminary oral-health guidance
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                    <ShieldCheck size={15} />
                    Educational guidance
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                    <LockKeyhole size={15} />
                    No chat storage
                  </span>
                </div>
              </div>
            </header>

            {/* Suggestions */}
            <div className="border-b border-slate-100 px-7 py-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-700">
                <Sparkles size={16} />
                Suggested questions
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {suggestedQuestions.map(
                  (question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() =>
                        sendMessage(question)
                      }
                      disabled={sending}
                      className="shrink-0 rounded-full border border-sky-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {question}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-7 py-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-100" />

                <span className="text-xs font-semibold text-slate-400">
                  Today
                </span>

                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="space-y-5">
                {messages.map((message) => {
                  const isUser =
                    message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="mt-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                          <Bot size={21} />
                        </div>
                      )}

                      <div
                        className={`max-w-[78%] ${
                          isUser
                            ? "items-end"
                            : "items-start"
                        } flex flex-col`}
                      >
                        <div
                          className={`rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm ${
                            isUser
                              ? "rounded-br-md bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                              : message.urgent
                                ? "rounded-bl-md border border-red-200 bg-red-50 text-red-800"
                                : "rounded-bl-md bg-slate-100 text-slate-700"
                          }`}
                        >
                          {message.urgent && (
                            <div className="mb-2 flex items-center gap-2 font-bold">
                              <AlertCircle size={17} />
                              Urgent guidance
                            </div>
                          )}

                          {message.content}
                        </div>

                        <span className="mt-1.5 text-[10px] text-slate-400">
                          {formatTime(
                            message.createdAt
                          )}
                        </span>
                      </div>

                      {isUser && (
                        <div className="mt-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-white">
                          <UserRound size={20} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {sending && (
                  <div className="flex items-end gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                      <Bot size={21} />
                    </div>

                    <div className="flex items-center gap-3 rounded-3xl rounded-bl-md bg-slate-100 px-5 py-4 text-sm text-slate-500">
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />

                      OralVista is preparing a response...
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* Error and input */}
            <footer className="border-t border-slate-100 bg-white px-6 py-5">
              {error && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-3"
              >
                <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-100">
                  <textarea
                    rows={2}
                    value={input}
                    maxLength={1000}
                    placeholder="Ask an oral-health question..."
                    onChange={(event) => {
                      setInput(
                        event.target.value
                      );

                      setError("");
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                        handleSubmit(event);
                      }
                    }}
                    className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />

                  <div className="mt-1 text-right text-[10px] text-slate-400">
                    {input.length}/1000
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !input.trim()
                  }
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  {sending ? (
                    <LoaderCircle
                      size={21}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={21} />
                  )}
                </button>
              </form>

              <p className="mt-3 text-center text-[11px] text-slate-400">
                Do not enter passwords, identification
                numbers or other sensitive information.
              </p>
            </footer>
          </section>

          {/* Information panel */}
          <aside className="relative hidden overflow-hidden border-l border-sky-100 bg-gradient-to-b from-cyan-50 via-sky-50 to-teal-100 p-8 lg:flex lg:flex-col">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-sky-200/70" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-teal-700">
                <HeartPulse size={16} />
                Virtual dental guide
              </span>

              <h3 className="mt-7 text-4xl font-black tracking-tight text-slate-800">
                Hello, {patientName}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Ask questions about everyday oral
                care, symptoms and preventive
                guidance.
              </p>
            </div>

            <div className="relative mt-auto space-y-4">
              <div className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-sky-100 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <MessageCircle size={21} />
                  </div>

                  <div>
                    <strong className="block text-sm text-slate-700">
                      Oral-health support
                    </strong>

                    <span className="text-xs text-slate-400">
                      Available when the AI service
                      is online
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50/90 p-5 text-xs leading-6 text-amber-800">
                <strong className="mb-1 block">
                  Medical disclaimer
                </strong>

                OralVista provides general
                educational information. It does
                not diagnose conditions or replace
                examination and treatment by a
                qualified dentist.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PatientLayout>
  );
}