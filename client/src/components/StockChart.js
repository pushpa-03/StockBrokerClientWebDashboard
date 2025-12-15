import React from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

export default function StockChart({ data = [], symbol }) {
  // data should be [{ time: 'hh:mm:ss', price: number }, ...]
  return (
    <div className="chart-card card">
      <h4>{symbol} — Live (simulated)</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
