import React, { useState } from "react";

export default function ProfileMenu({ user, onLogout, onChangeEmail }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-icon" onClick={() => setOpen((v) => !v)}>
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="user" />
      </div>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-email">{user.email}</div>

          <button onClick={() => alert("Help:\n- Open Dashboard\n- Subscribe to tickers\n- Use Buy/Sell to simulate trades")}>📘 Help</button>

          <button
            onClick={() => {
              const newEmail = prompt("Enter new email", user.email);
              if (newEmail && newEmail.includes("@")) onChangeEmail(newEmail);
            }}
          >
            ✉ Change Email
          </button>

          <button onClick={() => alert("Stock Broker Dashboard v1.0\nMade by EscrowStack")}>ℹ About</button>

          <hr />

          <button className="danger" onClick={onLogout}>🚪 Logout</button>
        </div>
      )}
    </div>
  );
}
