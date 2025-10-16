"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function ShootingStars() {
  const stars = useMemo(() => new Array(15).fill(0), []);

  return (
    <div className="fixed absolute top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden z-[9999]">
      {stars.map((_, i) => {
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.5; // top half of screen
        const endX = startX + 400; // move diagonally
        const endY = startY + 100;

        return (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[120px] bg-gradient-to-b from-white to-transparent opacity-80 blur-[1px]"
            style={{ left: startX, top: startY, rotate: 120 }}
            initial={{ opacity: 0 }}
            animate={{
              x: endX,
              y: endY,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 3, // slower streak
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
