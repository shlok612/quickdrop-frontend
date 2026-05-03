import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import AdBanner from "./components/ads/AdBanner";

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [duration, setDuration] = useState(5);
  const [joinError, setJoinError] = useState("");
  const navigate = useNavigate();

  // Create room
  const createRoom = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/rooms/create", {
        duration,
      });
      navigate(`/room/${res.data.code}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  // Join room — validate first
  const joinRoom = async () => {
    if (!roomCode) return;
    setJoinError("");

    try {
      const res = await axios.post("http://localhost:5000/api/rooms/join", {
        code: roomCode,
      });

      if (res.data.success) {
        navigate(`/room/${roomCode}`);
      } else {
        setJoinError("Not a valid room code.");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Room not found") {
        setJoinError("Not a valid room code.");
      } else if (msg === "Room expired") {
        setJoinError("This room has expired.");
      } else if (msg === "Room is full") {
        setJoinError("This room is full.");
      } else {
        setJoinError("Not a valid room code.");
      }
    }
  };

  return (
    <div className="container fade-in">
      <h1 className="title home-title">QuickDrop</h1>
      <AdBanner slot="1234567890" className="home-top-ad" />

      <div className="home-options-grid">
        <section className="home-card">
          <h2>Create Room</h2>
          <p>Get a code and share to others.</p>
          <label className="home-label" htmlFor="duration-select">
            Room duration
          </label>
          <select
            id="duration-select"
            className="input home-input"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={30}>30 min</option>
            <option value={60}>1 hour</option>
          </select>
          <button className="button home-action" onClick={createRoom}>
            Create Room
          </button>
        </section>

        <section className="home-card">
          <h2>Join Room</h2>
          <p>Join with your room code.</p>
          <input
            className="input home-input"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase());
              setJoinError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                joinRoom();
              }
            }}
          />
          {joinError && (
            <p style={{ color: "#ff6b6b", margin: 0, fontSize: "0.9rem" }}>
              {joinError}
            </p>
          )}
          <button className="button home-action" onClick={joinRoom}>
            Join Room
          </button>
        </section>
      </div>

      <section className="home-usecase">
        <h3>Why QuickDrop?</h3>
        <p>
          QuickDrop is designed for fast temporary collaboration. Create a room, share the code, and
          instantly exchange messages, images, files, and code snippets in real time. Choose a room
          duration (5 min, 10 min, 30 min, or 1 hour) based on your session and let it expire
          automatically for secure, temporary collaboration.
        </p>
      </section>

      <AdBanner slot="9876543210" className="home-bottom-ad" />

      <footer className="home-footer">
        <p>
          Built by <strong>Shlok Katiyar</strong>
        </p>
        <a className="footer-email" href="mailto:shlokkatiyar62@gmail.com">
          shlokkatiyar62@gmail.com
        </a>
        <a
          className="footer-github"
          href="https://github.com/shlok612"
          target="_blank"
          rel="noreferrer"
          aria-label="Shlok Katiyar GitHub"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4a3.2 3.2 0 0 0-1.4-1.8c-1.1-.7.1-.7.1-.7a2.5 2.5 0 0 1 1.8 1.3 2.6 2.6 0 0 0 3.6 1 2.5 2.5 0 0 1 .8-1.6c-2.7-.3-5.5-1.4-5.5-6a4.7 4.7 0 0 1 1.2-3.2A4.4 4.4 0 0 1 5.8 5s1-.3 3.2 1.2a11.2 11.2 0 0 1 6 0C17.2 4.7 18.2 5 18.2 5a4.4 4.4 0 0 1 .1 3.4 4.7 4.7 0 0 1 1.2 3.2c0 4.6-2.8 5.7-5.5 6a2.8 2.8 0 0 1 .8 2.2v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z"
            />
          </svg>
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  );
}

export default App;