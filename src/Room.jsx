import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_URL } from "./config";
import "./index.css";

function Room() {
  const { code } = useParams();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [myId, setMyId] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null); // seconds remaining
  const [toast, setToast] = useState(null);
  const [dragging, setDragging] = useState(false);

  // ── Refs ────────────────────────────────────────────────
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const toastTimerRef = useRef(null);
  const dragCounterRef = useRef(0);

  const isExpired = timeLeft !== null && timeLeft <= 0;

  // ── Toast helper ────────────────────────────────────────
  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  // ── Load room history ──────────────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (data.success) {
          setMessages(data.files || []);
          setExpiresAt(data.expiresAt);
        } else {
          console.log("Room not found or expired");
        }
      } catch (err) {
        console.error("Error fetching room:", err);
      }
    };

    fetchRoom();
  }, [code]);

  // ── Socket setup ───────────────────────────────────────
  useEffect(() => {
    if (socketRef.current) return; // prevent multiple connections

    socketRef.current = io(API_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current.id);
      setMyId(socketRef.current.id);

      // Join room ONLY after connect
      socketRef.current.emit("join_room", { code });
    });

    socketRef.current.on("joined_room", () => {
      console.log("Joined room successfully");
    });

    socketRef.current.on("new_text", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socketRef.current.on("new_file", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socketRef.current.on("error", (msg) => {
      console.error("Socket error:", msg);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [code]);

  // ── Countdown timer ────────────────────────────────────
  useEffect(() => {
    if (!expiresAt) return;

    const calcRemaining = () => {
      const remaining = Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000
      );
      return remaining;
    };

    setTimeLeft(calcRemaining());

    const interval = setInterval(() => {
      const remaining = calcRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // ── Auto scroll ────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Format time ────────────────────────────────────────
  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ── Timer pill class ───────────────────────────────────
  const timerClass = () => {
    if (isExpired) return "room-timer-pill expired";
    if (timeLeft !== null && timeLeft <= 60) return "room-timer-pill warning";
    return "room-timer-pill";
  };

  // ── Send text ──────────────────────────────────────────
  const sendText = () => {
    if (!text.trim() || isExpired) return;

    if (!socketRef.current) {
      console.log("Socket not ready");
      return;
    }

    socketRef.current.emit("send_text", {
      content: text,
    });

    setText("");

    // Re-focus textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // ── Handle key down in textarea ────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  // ── File upload ────────────────────────────────────────
  const handleUpload = async (file) => {
    if (!file || isExpired) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && socketRef.current) {
        socketRef.current.emit("send_file", {
          fileUrl: data.fileUrl,
          filename: data.filename,
        });
        showToast("File uploaded!");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }

    // Reset file input so same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ── Drag & drop ────────────────────────────────────────
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  // ── Copy message ───────────────────────────────────────
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      showToast("Copied!");
    });
  };

  // ── Format timestamp ──────────────────────────────────
  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div
      className={`room-container${isExpired ? " expired" : ""}${dragging ? " dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div className="room-header">
        <div>
          <button
            className="room-logo-btn"
            onClick={() => navigate("/")}
            title="Back to home"
          >
            QuickDrop
          </button>
          <p className="room-subtitle">Real-time temporary sharing</p>
        </div>

        <div className="room-code-pill">
          <span>Room</span>
          <strong>{code}</strong>
          <button
            className="copy-room-btn"
            onClick={() => {
              navigator.clipboard.writeText(code);
              showToast("Room code copied!");
            }}
            title="Copy room code"
          >
            📋
          </button>
        </div>

        {timeLeft !== null && (
          <div className={timerClass()}>
            {isExpired
              ? "⏰ Room expired"
              : `⏳ Room ends in ${formatTime(timeLeft)}`}
          </div>
        )}
      </div>

      {/* ── Chat area ───────────────────────────────────── */}
      <div className={`chat-box${messages.length === 0 ? " empty" : ""}`}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>No messages yet</h3>
            <p>Send a message or drop a file to get started.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.uploadedBy === myId;
            return (
              <div
                key={i}
                className={`message-row ${isMine ? "mine" : "other"}`}
              >
                <div
                  className={`message-bubble ${isMine ? "mine" : "other"}`}
                >
                  {msg.type === "text" ? (
                    <div className="message-content">
                      <div className="message-body">
                        <p className="message-text">{msg.content}</p>
                      </div>
                      <button
                        className="copy-msg-btn"
                        onClick={() => copyMessage(msg.content)}
                        title="Copy message"
                      >
                        📋
                      </button>
                    </div>
                  ) : (
                    <a
                      className="file-msg-link"
                      href={msg.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📁 {msg.filename}
                    </a>
                  )}
                  <div className="message-time">
                    {formatTimestamp(msg.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* ── Input area ──────────────────────────────────── */}
      <div className="input-wrapper">
        <div className="chat-input-area">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Type a message..."
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExpired}
          />

          <button
            className="icon-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isExpired}
            title="Upload file"
          >
            📎
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={(e) => handleUpload(e.target.files[0])}
          />

          <button
            className="send-button"
            onClick={sendText}
            disabled={isExpired || !text.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {/* ── Expired overlay ─────────────────────────────── */}
      {isExpired && (
        <div className="room-expired-overlay">
          <h3>⏰ Room has ended. Create a new one.</h3>
          <button className="button" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      )}

      {/* ── Toast ───────────────────────────────────────── */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Room;
