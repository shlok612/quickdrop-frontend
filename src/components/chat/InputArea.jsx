import { memo, useEffect, useRef } from "react";

function InputArea({ text, onTextChange, onSendText, onUpload, disabled, isTyping }) {
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 160)}px`;
  }, [text]);

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendText();
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="input-wrapper">
      {isTyping ? (
        <div className="typing-indicator" aria-live="polite">
          <span>You are typing</span>
          <span className="typing-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      ) : null}

      <div className="chat-input-area">
        <button
          className="icon-button"
          type="button"
          onClick={openFilePicker}
          aria-label="Upload a file"
          disabled={disabled}
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(event) => onUpload(event.target.files?.[0])}
          disabled={disabled}
        />

        <textarea
          ref={textAreaRef}
          className="chat-textarea"
          placeholder="Type a message..."
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={disabled}
        />

        <button className="send-button" type="button" onClick={onSendText} disabled={disabled}>
          Send
        </button>
      </div>
    </div>
  );
}

export default memo(InputArea);
