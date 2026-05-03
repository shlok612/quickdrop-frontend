import { memo } from "react";
import { useNavigate } from "react-router-dom";

function RoomHeader({ code, onCopyRoomCode, timerText, isExpiringSoon, isRoomExpired }) {
  const navigate = useNavigate();

  return (
    <header className="room-header">
      <div>
        <button className="room-logo-btn" type="button" onClick={() => navigate("/")}>
          QuickDrop
        </button>
        <p className="room-subtitle">All messages will be permanentely deleted after time limit</p>
      </div>
      <div className="room-code-pill">
        <span>Room</span>
        <strong>{code}</strong>
        <button className="copy-room-btn" type="button" onClick={onCopyRoomCode}>
          Copy
        </button>
      </div>
      <div className={`room-timer-pill ${isRoomExpired ? "expired" : isExpiringSoon ? "warning" : ""}`}>
        Room ends in {timerText}
      </div>
    </header>
  );
}

export default memo(RoomHeader);
