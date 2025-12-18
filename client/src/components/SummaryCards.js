import React from "react";

export default function SummaryCards({
  balance,
  portfolio,
  subscriptions,
  history,
}) {
  const totalHoldings = Object.values(portfolio).reduce((a, b) => a + b, 0);
  const totalTrades = history.length;

  return (
    <div className="summary-grid">
      <div className="summary-card balance">
        <div className="label">Wallet Balance</div>
        <div className="value">₹{balance.toLocaleString()}</div>
      </div>

      <div className="summary-card holdings">
        <div className="label">Holdings</div>
        <div className="value">{totalHoldings}</div>
      </div>

      <div className="summary-card watchlist">
        <div className="label">Watchlist</div>
        <div className="value">{subscriptions.length}</div>
      </div>

      <div className="summary-card trades">
        <div className="label">Total Trades</div>
        <div className="value">{totalTrades}</div>
      </div>
    </div>
  );
}
