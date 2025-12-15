// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const { v4: uuidv4 } = require("uuid");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: ["http://localhost:3000"], methods: ["GET", "POST"] }
// });

// const TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];
// const stocks = {};
// TICKERS.forEach(t => {
//   stocks[t] = {
//     ticker: t,
//     price: +(100 + Math.random() * 3000).toFixed(2),
//     lastUpdated: new Date().toISOString()
//   };
// });

// // socketId => { email, subscriptions:Set }
// const clients = new Map();

// function randomWalkPrice(oldPrice) {
//   const pct = (Math.random() * 2 - 1) / 100;
//   const next = oldPrice * (1 + pct);
//   return +next.toFixed(2);
// }

// const UPDATE_INTERVAL_MS = 1000;
// setInterval(() => {
//   TICKERS.forEach(t => {
//     stocks[t].price = randomWalkPrice(stocks[t].price);
//     stocks[t].lastUpdated = new Date().toISOString();
//   });


//   clients.forEach((info, socketId) => {
//     const socket = io.sockets.sockets.get(socketId);
//     if (!socket) return;
//     const subs = info.subscriptions || new Set();
//     if (subs.size === 0) return;
//     const payload = [];
//     subs.forEach(sym => {
//       if (stocks[sym]) payload.push(stocks[sym]);
//     });
//     if (payload.length) socket.emit("price-update", payload);
//   });
// }, UPDATE_INTERVAL_MS);

// io.on("connection", socket => {
//   console.log("connect", socket.id);
//   clients.set(socket.id, { email: null, subscriptions: new Set() });

//   socket.on("login", (payload, ack) => {
//     const email = payload && payload.email ? String(payload.email) : `user-${uuidv4()}`;
//     const info = clients.get(socket.id) || {};
//     info.email = email;
//     clients.set(socket.id, info);
//     const resp = { success: true, tickers: TICKERS, stocks, socketId: socket.id };
//     if (ack) ack(resp);
//     broadcastActiveUsers();
//   });

//   socket.on("subscribe", (payload, ack) => {
//     const info = clients.get(socket.id) || { subscriptions: new Set() };
//     if (!payload || !Array.isArray(payload.tickers)) {
//       if (ack) ack({ success: false });
//       return;
//     }
//     info.subscriptions = new Set(payload.tickers.filter(t => TICKERS.includes(t)));
//     clients.set(socket.id, info);
//     if (ack) {
//       const prices = Array.from(info.subscriptions).map(t => stocks[t]);
//       ack({ success: true, subscribed: Array.from(info.subscriptions), prices });
//     }
//     broadcastActiveUsers();
//   });

//   socket.on("disconnect", () => {
//     console.log("disconnect", socket.id);
//     clients.delete(socket.id);
//     broadcastActiveUsers();
//   });
// });

// app.get("/api/stocks", (req, res) => {
//   res.json({ tickers: TICKERS, stocks });
// });

// app.get("/api/active-users", (req, res) => {
//   const arr = [];
//   clients.forEach((info, socketId) => {
//     arr.push({ socketId, email: info.email, subscribed: Array.from(info.subscriptions || []) });
//   });
//   res.json(arr);
// });

// function broadcastActiveUsers() {
//   const arr = [];
//   clients.forEach((info, socketId) => {
//     arr.push({ socketId, email: info.email, subscribed: Array.from(info.subscriptions || []) });
//   });
//   io.emit("active-users", arr);
// }

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`Server running on ${PORT}`));
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
