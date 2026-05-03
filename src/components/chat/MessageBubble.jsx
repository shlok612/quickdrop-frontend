import { memo } from "react";

function renderTextWithCode(content) {
  const parts = [];
  const regex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <p key={`text-${key++}`} className="message-text">
          {content.slice(lastIndex, match.index)}
        </p>
      );
    }

    const language = match[1] || "code";
    const code = match[2].trim();
    parts.push(
      <div key={`code-${key++}`} className="message-code-block">
        <span className="message-code-lang">{language}</span>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(
      <p key={`text-${key++}`} className="message-text">
        {content.slice(lastIndex)}
      </p>
    );
  }

  return parts.length > 0 ? parts : <p className="message-text">{content}</p>;
}

function MessageBubble({ message, isMine, onCopy }) {
  const messageTime = formatMessageTime(message);

  return (
    <div className={`message-row ${isMine ? "mine" : "other"}`}>
      <article className={`message-bubble ${isMine ? "mine" : "other"}`}>
        {message.type === "text" ? (
          <div className="message-content">
            <div className="message-body">{renderTextWithCode(message.content || "")}</div>
            <button
              className="copy-msg-btn"
              type="button"
              aria-label="Copy message"
              onClick={() => onCopy(message.content || "")}
            >
              Copy
            </button>
          </div>
        ) : (
          <a className="file-msg-link" href={message.url} target="_blank" rel="noreferrer">
            <span aria-hidden="true">📎</span>
            <span>{message.filename || "Shared file"}</span>
          </a>
        )}
        {messageTime ? <div className="message-time">{messageTime}</div> : null}
      </article>
    </div>
  );
}

function formatMessageTime(message) {
  const rawTime = message?.createdAt || message?.timestamp || message?.updatedAt;
  if (!rawTime) return "";

  const date = new Date(rawTime);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default memo(MessageBubble);
