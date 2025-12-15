import React, { useEffect, useState, useRef, useContext } from "react";
import StockCard from "./StockCard";
import StockChart from "./StockChart";
import TransactionTable from "./TransactionTable";
import ProfileMenu from "./ProfileMenu";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext";

export default function Dashboard({ socket, user, onLogout }) {
  const [availableTickers, setAvailableTickers] = useState([]);
  const [prices, setPrices] = useState({});
  const [subscriptions, setSubscriptions] = useState(() => {
    const s = localStorage.getItem(`subscriptions_${user?.email}`);
    return s ? JSON.parse(s) : [];
  });
  const [activeUsers, setActiveUsers] = useState([]);
  const [chartData, setChartData] = useState({});
  const [portfolio, setPortfolio] = useState({});
  const [balance, setBalance] = useState(10000);
  const [history, setHistory] = useState(() => {
  const h = localStorage.getItem(`transactions_${user?.email}`);
  return h ? JSON.parse(h) : [];
});

  const { theme, setTheme } = useContext(ThemeContext);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    if (!socket) return;
    if (!socket.connected) socket.connect();

    socket.emit("login", { email: user.email }, (resp) => {
      if (resp) {
        setAvailableTickers(resp.tickers || []);
        setPrices(resp.stocks || {});
      }
    });
   


    socket.on("price-update", (payload) => {
      setPrices(prev => {
        const copy = { ...prev };
        payload.forEach(s => {
          copy[s.ticker] = s;
        });
        return copy;
      });


      payload.forEach(s => {
        setChartData(prev => {
          const arr = prev[s.ticker] ? [...prev[s.ticker]] : [];
          arr.push({ time: new Date().toLocaleTimeString(), price: s.price });
          if (arr.length > 30) arr.shift();
          return { ...prev, [s.ticker]: arr };
        });
      });
    });

    socket.on("active-users", (list) => setActiveUsers(list || []));

    return () => {
      socket.off("price-update");
      socket.off("active-users");
      mountedRef.current = false;
    };

  }, [socket]);

   useEffect(() => {
  if (!user?.email) return;
  localStorage.setItem(
    `transactions_${user.email}`,
    JSON.stringify(history)
  );
}, [history, user?.email]);
useEffect(() => {
  const h = localStorage.getItem(`transactions_${user.email}`);
  setHistory(h ? JSON.parse(h) : []);
}, [user.email]);
  useEffect(() => {

    localStorage.setItem(`subscriptions_${user.email}`, JSON.stringify(subscriptions));
    if (socket && socket.connected) {
      socket.emit("subscribe", { tickers: subscriptions }, (ack) => {
        if (ack?.prices) {
          setPrices(prev => {
            const copy = { ...prev };
            ack.prices.forEach(s => copy[s.ticker] = s);
            return copy;
          });
        }
      });
    }

  }, [subscriptions]);

  function toggleTicker(t) {
    setSubscriptions(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));
  }

  function addTransaction(type, stock, price) {
    const tx = { id: Date.now(), type, stock, price, time: new Date().toLocaleTimeString() };
    setHistory(prev => [tx, ...prev].slice(0, 200));
  }

  function buy(stock, price) {
    if (!price) return toast.error("Price not available");
    if (balance < price) return toast.error("Insufficient balance");
    setBalance(prev => +(prev - price).toFixed(2));
    setPortfolio(prev => ({ ...prev, [stock]: (prev[stock] || 0) + 1 }));
    addTransaction("BUY", stock, price);
    toast.success(`Bought 1 ${stock} @ $${price}`);
  }

  function sell(stock, price) {
    if (!portfolio[stock]) return toast.error("You don't own this stock");
    setBalance(prev => +(prev + price).toFixed(2));
    setPortfolio(prev => ({ ...prev, [stock]: prev[stock] - 1 }));
    addTransaction("SELL", stock, price);
    toast.success(`Sold 1 ${stock} @ $${price}`);
  }

  function downloadSnapshot() {
    const rows = [["Ticker", "Price", "LastUpdated"]];
    subscriptions.forEach(t => {
      const s = prices[t] || {};
      rows.push([t, s.price ?? "", s.lastUpdated ?? ""]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `snapshot_${user.email}_${Date.now()}.csv`);
    toast.info("Snapshot downloaded");
  }

  function handleChangeEmail(newEmail) {
    if (!newEmail || !newEmail.includes("@")) return toast.error("Invalid email");
    const newUser = { email: newEmail, socketId: user.socketId };
    localStorage.setItem("stock_user", JSON.stringify(newUser));
    toast.success("Email changed — reload to apply");

    onLogout();
  }

  return (
    <div className="dashboard-grid">
      <ToastContainer />

      {/* ===================== TOP ROW ===================== */}
      <div className="top-row">
        <aside className="card side-panel">
          <h4>Active Users</h4>
          <ul className="active-list">
            {activeUsers.map(u => (
              <li key={u.socketId}>
                <div className="user-email">{u.email}</div>
                <div className="user-subs small muted">
                  {(u.subscribed || []).join(", ") || "—"}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="card control-panel">
          <div className="control-top">
            <div>
              <strong>{user.email}</strong>
              <div className="small muted">Balance: ${balance.toFixed(2)}</div>
            </div>

            <div className="top-actions">
              <button className="btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
              </button>
              <ProfileMenu user={user} onLogout={onLogout} onChangeEmail={handleChangeEmail} />
            </div>
          </div>

          <hr />
          <h4>Subscribe Stocks</h4>

          <div className="ticker-list">
            {availableTickers.map(t => {
              const isSub = subscriptions.includes(t);
              const priceObj = prices[t] || {};
              return (
                <div key={t} className="ticker-row">
                  <div className="ticker-id">{t}</div>
                  <div className="ticker-price">${priceObj.price ?? "—"}</div>

                  <div className="ticker-actions">
                    <button
                      className={`btn ${isSub ? "" : "primary"}`}
                      onClick={() => toggleTicker(t)}
                    >
                      {isSub ? "Unsubscribe" : "Subscribe"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="form-actions" style={{ marginTop: 12 }}>
            <button className="btn" onClick={downloadSnapshot}>Download Snapshot</button>
            <button className="btn danger" onClick={onLogout}>Sign out</button>
          </div>
        </section>
      </div>

      {/* ===================== MIDDLE ROW ===================== */}
      <div className="middle-row">

        <div className="card watchlist">
          <h3 className="section-title">My Watchlist</h3>

          <div className="grid-cards">
            {subscriptions.length === 0 && <div className="muted">No subscriptions yet</div>}
            {subscriptions.map(t => (
              <StockCard
                key={t}
                stock={prices[t] ? { ...prices[t], ticker: t } : { ticker: t }}
                onBuy={buy}
                onSell={sell}
                owned={portfolio[t] || 0}
              />
            ))}
          </div>
        </div>


        <div className="card charts-panel">
          <h3 className="section-title">Charts</h3>

          <div className="charts-row">
            {subscriptions.map(t => (
              <StockChart key={t} data={chartData[t] || []} symbol={t} />
            ))}

            {subscriptions.length === 0 && (
              <div className="muted">Subscribe to a ticker to see charts</div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== BOTTOM ROW ===================== */}
      <div className="card transaction-row">
        <TransactionTable history={history} />
      </div>
    </div>
  );



}
