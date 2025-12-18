import React, { useState } from "react";

export default function ProfileMenu({
  user,
  walletBalance,
  onAddMoney,
  onLogout,
  onChangeEmail,
}) {
  const [open, setOpen] = useState(false);

  const handleAddMoney = () => {
    const amt = Number(prompt("Enter amount to add (₹)"));
    if (amt > 0) onAddMoney(amt);
  };

  const showAbout = () => {
    alert(
      `📈 Stock Broker Dashboard

Features:
• Live Stock Prices
• Buy / Sell Orders
• Wallet & Portfolio
• Real-time P&L
• Charts & Indicators
• IPO & Alerts
• Market News

Built with React + Socket.IO`
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-icon" onClick={() => setOpen(true)}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="User"
        />
      </div>

      {open && (
        <div className="profile-dropdown">
          {/* CLOSE */}
          <button className="close-btn" onClick={() => setOpen(false)}>
            ✕
          </button>

          <div className="profile-email">{user.email}</div>

          <div className="wallet-balance">
            Wallet Balance: <strong>₹{walletBalance.toLocaleString()}</strong>
          </div>

          <button className="primary" onClick={handleAddMoney}>
            ➕ Add Money
          </button>

          <button
            onClick={() => {
              const newEmail = prompt("New Email", user.email);
              if (newEmail) onChangeEmail(newEmail);
            }}
          >
            ✉ Change Email
          </button>

          <button onClick={showAbout}>ℹ About App</button>

          <hr />

          <button className="danger" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
