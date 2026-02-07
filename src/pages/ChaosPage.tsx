import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

const ChaosPage = () => {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [canLeave, setCanLeave] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFirstInteraction = async () => {
    // FIRST click → start chaos
    if (!started) {
      setStarted(true);

      try {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          await videoRef.current.play();
        }

        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
        }
      } catch (e) {
        console.log("Playback blocked:", e);
      }

      // allow leaving after 4 sec
      setTimeout(() => {
        setCanLeave(true);
      }, 4000);

      return;
    }

    // SECOND click → go back
    if (canLeave) {
      navigate("/");
    }
  };

  return (
    <motion.div
      onClick={handleFirstInteraction}
      className="relative min-h-screen flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: "var(--gradient-chaos)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
      >
        <source src="/chaos.mp4" type="video/mp4" />
      </video>

      {/* Audio */}
      <audio ref={audioRef} preload="auto">
        <source src="/audio.mp3" type="audio/mpeg" />
      </audio>

      {/* Text */}
      {!started && (
        <motion.h1
          className="z-10 text-white text-5xl md:text-7xl font-bold text-center px-6"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Tap the screen.
        </motion.h1>
      )}

      {started && !canLeave && (
        <motion.h1
          className="z-10 text-red-500 text-6xl md:text-8xl font-bold text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          ARE YOU MAD??
        </motion.h1>
      )}

      {canLeave && (
        <motion.p
          className="absolute bottom-10 text-white/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Tap again to go back
        </motion.p>
      )}
    </motion.div>
  );
};

export default ChaosPage;
