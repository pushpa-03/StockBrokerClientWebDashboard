import React from "react";

export default function TransactionTable({ history = [] }) {
  return (
    <div className="transaction-table card">
      <h4>Transaction History</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr>
                <td colSpan="4" className="muted">No transactions yet</td>
              </tr>
            )}
            {history.map(h => (
              <tr key={h.id}>
                <td>{h.time}</td>
                <td className={h.type === "BUY" ? "green" : "red"}>{h.type}</td>
                <td>{h.stock}</td>
                <td>${h.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
