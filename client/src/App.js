import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const SOCKET_URL = "https://stock-dashboard-backend-o3t7.onrender.com";

export default function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // 👈 NEW

  // 🔌 Create & connect socket ONCE
  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      setReady(true);
    });

    setSocket(s);

    return () => s.disconnect();
  }, []);

  // 🔐 Restore user AFTER socket is ready
  useEffect(() => {
    if (!ready) return;

    const saved = localStorage.getItem("stock_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("stock_user");
      }
    }
  }, [ready]);

  // 💾 Persist login
  useEffect(() => {
    if (user) localStorage.setItem("stock_user", JSON.stringify(user));
    else localStorage.removeItem("stock_user");
  }, [user]);

  if (!ready) {
    return <div className="app-loading">Connecting to server…</div>;
  }

  return (
    <div className="app-root">
      <header className="app-header header-glass">
        <h1>Stock Broker Client</h1>
        <div className="sub">Real-time simulated market</div>
      </header>

      <main className="app-main">
        {!user ? (
          <Login socket={socket} onLogin={setUser} />
        ) : (
          <Dashboard
            socket={socket}
            user={user}
            onLogout={() => setUser(null)}
          />
        )}
      </main>

      <footer className="app-footer">
        <small>Stock Broker Dashboard</small>
      </footer>
    </div>
  );
}
