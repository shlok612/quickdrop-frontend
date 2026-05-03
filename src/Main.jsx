import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Room from "./Room.jsx";
import Footer from "./components/layout/Footer";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/room/:code" element={<Room />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);