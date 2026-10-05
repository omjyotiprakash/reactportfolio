import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroAnimation({ onFinish }) {
  const greetings = useMemo(
    () => [
      "Hello",
      "नमस्ते",
      "Hola",
      "Bonjour",
      "Ciao",
      "Olá",
      "Здравствуйте",
      "Merhaba",
      "Γειά",
      "Salam",
      "ନମସ୍କାର",
    ],
    []
  );

  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [startExit, setStartExit] = useState(false)

  useEffect(() => {
    let timer
    if (index < greetings.length - 1) {
      timer = setTimeout(() => setIndex((i) => i + 1), 300)
    } else {
      timer = setTimeout(() => setStartExit(true), 700);
    }
    return () => clearTimeout(timer);
  }, [index, greetings.length]);

  useEffect(() => {
    if (!startExit) return;

    const finishTimeout = setTimeout(() => setVisible(false), 480);
    return () => clearTimeout(finishTimeout);
  }, [startExit]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            opacity: 0,
            transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
          }}
          style={{ WebkitClipPath: "circle(150% at 50% 50%)", clipPath: "circle(150% at 50% 50%)" }}
        >
          <motion.div
            key={index}
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 20, scale: 1 }}
            animate={startExit ? { opacity: 0.9, scale: 0.6, rotate: 360 } : { opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={startExit ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] } : { duration: 0.28 }}
            style={{ willChange: "transform, opacity" }}
          >
            <motion.h1
              key={`greet-${index}`}
              className="text-5xl md:text-7xl lg:text-8xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {greetings[index]}
            </motion.h1>
          </motion.div>

          {startExit && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.18, scale: 1.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "40vmax",
                height: "40vmax",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,0,0,0.0) 0%, rgba(0,0,0,1) 60%)",
                pointerEvents: "none",
                mixBlendMode: "normal",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
