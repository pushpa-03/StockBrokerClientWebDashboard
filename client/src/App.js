import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

import { io } from "socket.io-client";

const socket = io("https://stock-dashboard-backend-o3t7.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});


export default function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("stock_user");
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    const s = io(SOCKET_URL, { autoConnect: false });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("stock_user", JSON.stringify(user));
    else localStorage.removeItem("stock_user");
  }, [user]);

  return (
    <div className="app-root">
          <header className="app-header header-glass">
      <div className="brand">
        <h1>Stock Broker Client</h1>
        <div className="sub">Real-time simulated market</div>
      </div>
    </header>


      <main className="app-main">
        {!user ? (
          <Login socket={socket} onLogin={(u) => setUser(u)} />
        ) : (
          <Dashboard socket={socket} user={user} onLogout={() => setUser(null)} />
        )}
      </main>

      <footer className="app-footer">
        <small>Stock Broker Dashboard</small>
      </footer>
    </div>
  );
}
