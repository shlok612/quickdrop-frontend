import { memo } from "react";
import MessageBubble from "./MessageBubble";

function ChatBox({ messages, myId, bottomRef, onCopy }) {
  if (!messages.length) {
    return (
      <section className="chat-box empty" aria-live="polite">
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            💬
          </div>
          <h3>No messages yet</h3>
          <p>Be the first to send a text or share a file in this room.</p>
        </div>
        <div ref={bottomRef} />
      </section>
    );
  }

  return (
    <section className="chat-box" aria-live="polite">
      {messages.map((message, index) => (
        <MessageBubble
          key={`${message.uploadedBy || "unknown"}-${message.createdAt || index}-${index}`}
          message={message}
          isMine={message.uploadedBy === myId}
          onCopy={onCopy}
        />
      ))}
      <div ref={bottomRef} />
    </section>
  );
}

export default memo(ChatBox);
