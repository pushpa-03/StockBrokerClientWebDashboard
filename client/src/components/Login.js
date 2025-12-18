import React, { useState, useEffect } from "react";

export default function Login({ socket, onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("stock_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.email) setEmail(parsed.email);
      } catch {}
    }
  }, []);

  // ✅ clearFields function
  function clearFields() {
    setEmail("");
    setError(null);
    setLoading(false);
  }

  function handleLogin(e) {
  e.preventDefault();
  setError(null);

  if (!email || !email.includes("@")) {
    setError("Please enter a valid email.");
    return;
  }

  setLoading(true);

  socket.emit("login", { email }, (resp) => {
    setLoading(false);

    if (resp?.success) {
      const user = { email, socketId: resp.socketId };
      localStorage.setItem("stock_user", JSON.stringify(user));
      onLogin(user);
    } else {
      setError("Login failed. Try again.");
    }

    clearFields();
  });
}


  return (
    <div className="login-outer">
      <div className="card login-card enhanced">
        <div className="login-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="login-avatar"
            alt="avatar"
          />
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            Sign in to access your live stock dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <div className="error login-error">{error}</div>}

          <button className="btn primary login-btn" disabled={loading}>
            {loading ? "Connecting..." : "Sign in"}
          </button>
        </form>

        <div className="login-footer">
          <span className="login-hint">
            Use any email — subscription persists locally.
          </span>
        </div>
      </div>
    </div>
  );
}
