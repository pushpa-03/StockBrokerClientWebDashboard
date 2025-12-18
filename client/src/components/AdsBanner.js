import React, { useEffect, useRef, useState } from "react";

const ADS = [
  {
    id: 1,
    title: "Trade Faster",
    desc: "Zero brokerage on first 30 days",
    img: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf",
    cta: "Start Trading",
  },
  {
    id: 2,
    title: "Advanced Charts",
    desc: "Professional indicators & insights",
    img: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7",
    cta: "View Charts",
  },
  {
    id: 3,
    title: "IPO Alerts",
    desc: "Apply to IPOs with one click",
    img: "https://images.unsplash.com/photo-1604594849809-dfedbc827105",
    cta: "Explore IPOs",
  },
];

export default function AdsBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);

  /* ---------- AUTO SLIDE ---------- */
  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ADS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [paused]);

  const ad = ADS[index];

  /* ---------- ANALYTICS ---------- */
  const trackAdClick = () => {
    console.log("📊 Ad Clicked:", ad.title, "| ID:", ad.id);

    // Later you can send to backend
    // fetch("/api/ad-click", { method: "POST", body: JSON.stringify(ad) });
  };

  /* ---------- SWIPE HANDLERS ---------- */
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50) {
      // swipe left
      setIndex((i) => (i + 1) % ADS.length);
    } else if (diff < -50) {
      // swipe right
      setIndex((i) => (i - 1 + ADS.length) % ADS.length);
    }
  };

  return (
    <div
      className="ad-slider card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img src={ad.img} alt={ad.title} className="ad-image" />

      <div className="ad-overlay">
        <h3>{ad.title}</h3>
        <p>{ad.desc}</p>

        <button className="btn primary" onClick={trackAdClick}>
          {ad.cta}
        </button>
      </div>

      {/* Dots */}
      <div className="ad-dots">
        {ADS.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
