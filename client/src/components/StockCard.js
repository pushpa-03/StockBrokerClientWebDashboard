import React from "react";
import { motion } from "framer-motion";

export default function StockCard({ stock, onBuy, onSell, owned = 0 }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="stock-card">
      <div className="stock-row">
        <div>
          <div className="stock-ticker">{stock.ticker}</div>
          <div className="stock-meta small muted">Updated: {stock.lastUpdated ? new Date(stock.lastUpdated).toLocaleTimeString() : "—"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="stock-price">${stock.price ?? "—"}</div>
          <div className="small muted">Owned: {owned}</div>
        </div>
      </div>

      <div className="stock-actions">
        <button className="btn" onClick={() => onBuy(stock.ticker, stock.price)}>Buy</button>
        <button className="btn danger" onClick={() => onSell(stock.ticker, stock.price)}>Sell</button>
      </div>
    </motion.div>
  );
}