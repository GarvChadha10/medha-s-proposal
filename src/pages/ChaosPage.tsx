import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ChaosPage = () => {
  const navigate = useNavigate();
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    // Allow clicking after 3 seconds
    const timer = setTimeout(() => {
      setCanClick(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (canClick) {
      navigate("/");
    }
  };

  // Generate floating warning text positions
  const warningTexts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden flex items-center justify-center cursor-pointer"
      onClick={handleClick}
      style={{ background: "var(--gradient-chaos)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Pulsing red/purple overlay */}
      <motion.div
        className="absolute inset-0 chaos-bg"
        style={{
          background: "radial-gradient(ellipse at center, hsl(0 60% 20% / 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Floating warning texts */}
      {warningTexts.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-destructive/30 font-bold text-xl pointer-events-none select-none"
          style={{ top: item.top, left: item.left }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            delay: item.delay,
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🚨 WARNING 🚨
        </motion.div>
      ))}

      {/* Alarm emoji borders */}
      <motion.div 
        className="absolute top-0 left-0 right-0 flex justify-around py-4 text-3xl"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i}>🚨</span>
        ))}
      </motion.div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 flex justify-around py-4 text-3xl"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i}>🚨</span>
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Video container */}
        <motion.div
          className="relative mb-8 rounded-2xl overflow-hidden border-4 border-destructive/50 shadow-2xl"
          style={{ boxShadow: "0 0 60px hsl(0 70% 50% / 0.3)" }}
          animate={{ 
            rotate: [-1, 1, -1],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Video placeholder - replace src with actual video */}
          <div className="w-80 h-60 md:w-[500px] md:h-[375px] bg-card flex items-center justify-center">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              {/* User will add their video source here */}
              <source src="" type="video/mp4" />
              {/* Fallback content */}
            </video>
            
            {/* Placeholder when no video */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card">
              <motion.span 
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                😤
              </motion.span>
              <p className="text-muted-foreground text-sm">Video placeholder</p>
              <p className="text-muted-foreground/50 text-xs mt-1">Add your video here</p>
            </div>
          </div>
        </motion.div>

        {/* ARE YOU MAD text */}
        <motion.h1
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold"
          style={{ 
            color: "hsl(0 70% 55%)",
            textShadow: "0 0 40px hsl(0 70% 50% / 0.5)",
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ARE YOU MAD??
        </motion.h1>

        {/* Click to go back hint */}
        <motion.p
          className="mt-12 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: canClick ? 0.7 : 0 }}
          transition={{ duration: 0.5 }}
        >
          Click anywhere to go back and reconsider...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default ChaosPage;
