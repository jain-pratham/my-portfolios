"use client";

import { useEffect, useState } from "react";

export default function BackgroundFX() {
  const [pos, setPos] = useState({ x: 50, y: 20 });

  useEffect(() => {
    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 transition-all duration-500"
      style={{
        background: `radial-gradient(480px 260px at ${pos.x}% ${pos.y}%, rgba(39,94,254,0.14), transparent 70%)`
      }}
    />
  );
}
