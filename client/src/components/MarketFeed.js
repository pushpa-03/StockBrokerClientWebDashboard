import React from "react";

export default function MarketFeed({ feed }) {
  return (
    <div className="card market-feed">
      <h4>Market Activity</h4>

      <ul>
        {feed.length === 0 && (
          <li className="muted">No recent activity</li>
        )}

        {feed.map((f) => (
          <li key={f.id} className={f.type === "BUY" ? "buy" : "sell"}>
            <span className="stock">{f.stock}</span>
            <span className="action">{f.type}</span>
            <span className="price">₹{f.price}</span>
            <span className="time">{f.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
