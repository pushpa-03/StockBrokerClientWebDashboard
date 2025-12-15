const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];
const stocks = {};

TICKERS.forEach(t => {
  stocks[t] = {
    ticker: t,
    price: +(100 + Math.random() * 3000).toFixed(2),
    lastUpdated: new Date().toISOString()
  };
});

const clients = new Map();

function randomWalkPrice(oldPrice) {
  const pct = (Math.random() * 2 - 1) / 100;
  return +(oldPrice * (1 + pct)).toFixed(2);
}

setInterval(() => {
  TICKERS.forEach(t => {
    stocks[t].price = randomWalkPrice(stocks[t].price);
    stocks[t].lastUpdated = new Date().toISOString();
  });

  clients.forEach((info, socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) return;

    const subs = info.subscriptions || new Set();
    if (!subs.size) return;

    const payload = [];
    subs.forEach(sym => stocks[sym] && payload.push(stocks[sym]));
    payload.length && socket.emit("price-update", payload);
  });
}, 1000);

io.on("connection", socket => {
  clients.set(socket.id, { email: null, subscriptions: new Set() });

  socket.on("login", (payload, ack) => {
    const email = payload?.email || `user-${uuidv4()}`;
    const info = clients.get(socket.id);
    info.email = email;
    clients.set(socket.id, info);

    ack?.({
      success: true,
      tickers: TICKERS,
      stocks,
      socketId: socket.id
    });

    broadcastActiveUsers();
  });

  socket.on("subscribe", (payload, ack) => {
    const info = clients.get(socket.id);
    info.subscriptions = new Set(
      (payload?.tickers || []).filter(t => TICKERS.includes(t))
    );

    clients.set(socket.id, info);

    ack?.({
      success: true,
      subscribed: [...info.subscriptions],
      prices: [...info.subscriptions].map(t => stocks[t])
    });

    broadcastActiveUsers();
  });

  socket.on("disconnect", () => {
    clients.delete(socket.id);
    broadcastActiveUsers();
  });
});

app.get("/api/stocks", (_, res) => {
  res.json({ tickers: TICKERS, stocks });
});

app.get("/api/active-users", (_, res) => {
  const users = [];
  clients.forEach((info, socketId) => {
    users.push({
      socketId,
      email: info.email,
      subscribed: [...info.subscriptions]
    });
  });
  res.json(users);
});

function broadcastActiveUsers() {
  const users = [];
  clients.forEach((info, socketId) => {
    users.push({
      socketId,
      email: info.email,
      subscribed: [...info.subscriptions]
    });
  });
  io.emit("active-users", users);
}

app.get("/", (req, res) => {
  res.send("Stock Broker Backend is running");
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
