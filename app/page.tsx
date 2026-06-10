"use client";

import { useState, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const fakeReply = async (text: string, startIndex: number) => {
    const reply = `这是一个模拟AI回复：你刚刚说的是「${text}」，我正在思考如何回答这个问题...`;

    let result = "";

    for (let i = 0; i < reply.length; i++) {
      await new Promise((r) => setTimeout(r, 30)); // 模拟延迟

      result += reply[i];

      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[startIndex] = {
          role: "assistant",
          content: result,
        };
        return newMsgs;
      });

      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };

    const assistantPlaceholder: Message = {
      role: "assistant",
      content: "",
    };

    const newMessages = [...messages, userMsg, assistantPlaceholder];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    await fakeReply(input, newMessages.length - 1);

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>🧠 Fake AI Chat（可部署版）</h2>

      <div ref={chatRef} style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.msg,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#DCF8C6" : "#F1F1F1",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="输入内容..."
        />

        <button style={styles.button} onClick={sendMessage} disabled={loading}>
          发送
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  chatBox: {
    height: 400,
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  msg: {
    padding: "8px 12px",
    borderRadius: 12,
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  inputBox: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    borderRadius: 8,
    background: "#0070f3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};