# Stock Broker Client Web Dashboard

This project is a **real-time Stock Broker Client Web Dashboard**.  
The application enables users to log in, subscribe to stock tickers, and receive **live stock price updates without refreshing the page**.

---

## Problem Statement

Create a Stock Broker Client Web Dashboard that allows users to:

1. Login using an email address  
2. Subscribe to supported stock tickers (GOOG, TSLA, AMZN, META, NVDA)  
3. View live price updates of subscribed stocks without refreshing the dashboard  
4. Support multiple users simultaneously with independent subscriptions and asynchronous updates  

---

## Features

- Email-based login (no password required)

- Subscribe and unsubscribe to supported stock tickers

- Real-time stock price updates using WebSockets (Socket.IO)

- Multi-user support with independent subscriptions

- Asynchronous dashboard updates without page refresh

- Virtual stock trading (Buy/Sell)

- Portfolio management per user

- Virtual balance tracking with validations

- Persistent transaction history per user (stored locally)

- Real-time stock price charts

- Live active users list with subscribed stocks

- Light/Dark theme toggle

- Download subscribed stock snapshot as CSV

- Toast notifications for user actions

- Client–Server architecture

- Deployment-ready for Render

---

## Tech Stack

### Frontend
- React.js
- Socket.IO Client
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js
- Socket.IO
- UUID
- CORS

---

## Application Flow

1. User logs in using an email address.
2. A WebSocket connection is established with the backend.
3. User subscribes to selected stock tickers.
4. Backend simulates live stock price changes.
5. Stock price updates are pushed to subscribed users every second.
6. Multiple users receive real-time updates independently.
7. User can Buy or Sell stocks using the dashboard controls.
8. Backend tracks all connected users and their subscriptions.
9. User can download a CSV snapshot of current subscribed stocks.
10. Users can toggle Light/Dark theme via the ThemeContext and change their email without logging out.

---

## Supported Stock Tickers

- GOOG (Google)
- TSLA (Tesla)
- AMZN (Amazon)
- META (Meta)
- NVDA (NVIDIA)

---

## Run Project Locally

### Backend Setup
```bash
cd server
npm install
node index.js
npm start

### Frontend Setup
```bash
cd client
npm install

---



