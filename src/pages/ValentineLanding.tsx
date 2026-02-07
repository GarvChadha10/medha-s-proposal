import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Chime sound as base64 (short soft bell)
const CHIME_SOUND = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleS4PT5rO3bF2Jg1Fkc7dpHEjDEqR0NmhcCYPT5XL2J1sJBFTlMvUnmsQE1qUzNOXZhEWXpPK0pNiEhhglMrPjl8UG2SVyc2KWBQZY5bJypJlFRxnl8jIj2EWHWqYxsaMXBUca5rGxolYFBxsmsbFh1UVHGyayMSGUhMbbZvJw4RQERpvnMnChE8SEHGdy8KCTRAQc53LwYJNEBFznczBgk4QEnOdzMGCThATc5zMwYFNEBRznMvBgEwQFnOcysGASxAYc5zKwH9KEBlzmsnAfUkPGnObyMB8SQ8bcp3HwHtIDxtzncbAe0gQG3Odx8B7SBAbc53GwHtIEBtzncbAe0gQG3Ocxr96RxAcc5zGv3pHEBxznMa/eUcQHHOcxr96RxAcc53Gv3lHDx1zncW/ekcPHXOdxb95Rw8dc53Fv3lGDx5znsS/eEYPHnOexL94Rg8ec57Ev3hGDx5znsS+eEYOH3Ofw754RQ4fc5/DvnhFDh9zn8O+eEUOH3Ofw754RQ4fc5/DvnhFDh9zn8O+eEUOH3Oew754RA4gc5/DvXhEDiBzn8O9eEQOIHOfw714RA4gc5/DvXhEDiBzn8O9eEQNIXSgwr14Qw0hdKDCvXhDDSF0oMK9eEMNIXSgwr14Qw0hdKDCvXhDDSF0oMK9eEMMInShwbx3QgwidKHBvHdCDCJ0ocG8d0IMInShwbx3QgwidKHBvHdCDCJ0ocG8d0ILI3Siwbt2QQsjdKLBu3ZBCyN0osG7dkELI3Siwbt2QQsjdKLBu3ZBCyN0osG7dkEKJHWjwLp1QAokdaPAunVACiR1o8C6dUAKJHWjwLp1QAokdaPAunVACiR1o8C6dT8KJXakv7l0PwoldqS/uXQ/CiV2pL+5dD8KJXakv7l0PwoldqS/uXQ/CiV1pL+5dD8JJnakvrl0PgkmdrS+uHQ+CSZ2tL64dD4JJna0vrh0PgkmdrS+uHQ+CSZ2tL64dD4JJna0vrh0PQkndrW9t3M9CSd2tb23cz0JJ3a1vbdzPQkndrW9t3M9CSd2tb23cz0JJ3a1vbdzPAkod7a8tnI8CCh3tryydjwIKHe2vLZyPAgod7a8tnI8CCh3tryydjwIKHe2vLZyPAgod7a8snY7CCl3t7u1cTsIKXe3u7VxOwgpd7e7tXE7CCl3t7u1cTsIKXe3u7VxOwgpd7e7tXE6CCp4uLq0cDoIKni4urRwOggqeLi6tHA6CCp4uLq0cDoIKni4urRwOggqeLi6tHA5CSt4ubmzbzkJK3i5ubNvOQkreLm5s285CSt4ubmzbzkJK3i5ubNvOQkreLm5s285CCtpubmzbTkILHm6uLJuOQgsebi4sm45CCx5uriybTkILHm5uLJuOQgsebi4sm05CCx5ubiybjkILHm5uLJuOAgterl4sW04CC16uXixbTgILXq5eLFtOAgterl4sW04CC16uXixbTgILXq5eLBtOAgte7l3sWw4CC17t3iwbDgILXu3eLBsOAgte7d4sGw4CC17t3iwbDgILXu3eLBsNwgutrh3r2s3CC62uHevazcILra4d69rNwgutrh3r2s3CC62uHevazcILra4d69qNwgvt7h2rmo3CC+2uHauajcIL7a4dq5qNwgvtrh2rmo3CC+2uHauajcIL7a4dq5qNgkwt7d1rWk2CTG3t3WtaTYJMbe3da1pNgkxtrZ1rWk2CTG2tnWtaTYJMba2da1pNgkxtrZ1rWk1CTK1tnSsaDUJMrW2dKxoNQkytbZ0rGg1CTK1tnSsaDUJMrW2dKxoNQkytbZ0rGg1CTK1tnSsaDUJMrW2dKxoNQk=";

const FloatingElement = ({ 
  className, 
  delay = 0,
  color = "primary",
  mouseX,
  mouseY,
}: { 
  className: string; 
  delay?: number;
  color?: "primary" | "accent";
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) => {
  // Elements drift away from cursor
  const x = useTransform(mouseX, [0, 1], [20, -20]);
  const y = useTransform(mouseY, [0, 1], [20, -20]);
  const springX = useSpring(x, { stiffness: 30, damping: 20 });
  const springY = useSpring(y, { stiffness: 30, damping: 20 });

  return (
    <motion.div
      className={`floating-element ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay, duration: 2 }}
      style={{
        background: color === "primary" 
          ? "hsl(174 42% 45%)" 
          : "hsl(280 60% 55%)",
        animationDelay: `${delay}s`,
        x: springX,
        y: springY,
      }}
    />
  );
};

const FloralSilhouette = ({ 
  className, 
  delay = 0 
}: { 
  className: string; 
  delay?: number;
}) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.06 }}
    transition={{ delay: delay + 2, duration: 3 }}
  >
    <motion.svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 3, 0],
      }}
      transition={{ 
        duration: 12, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      style={{ filter: "blur(8px)" }}
    >
      <ellipse cx="50" cy="25" rx="12" ry="22" fill="hsl(280 60% 55%)" transform="rotate(-20 50 50)" opacity="0.7" />
      <ellipse cx="50" cy="25" rx="12" ry="22" fill="hsl(174 42% 45%)" transform="rotate(20 50 50)" opacity="0.5" />
      <ellipse cx="50" cy="30" rx="10" ry="18" fill="hsl(280 40% 35%)" opacity="0.6" />
      <path d="M48 50 Q 45 70 40 90" stroke="hsl(174 30% 35%)" strokeWidth="2" fill="none" opacity="0.4" />
    </motion.svg>
  </motion.div>
);

const ValentineLanding = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Animation sequence states
  const [showDot, setShowDot] = useState(true);
  const [dotExpanded, setDotExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showIdleText, setShowIdleText] = useState(false);
  
  // No button position
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  
  // Cursor tracking for interactive background
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Gradient shift based on cursor
  const gradientX = useTransform(mouseX, [0, 1], [-5, 5]);
  const gradientY = useTransform(mouseY, [0, 1], [-5, 5]);
  const springGradientX = useSpring(gradientX, { stiffness: 50, damping: 30 });
  const springGradientY = useSpring(gradientY, { stiffness: 50, damping: 30 });

  // Cinematic entrance sequence
  useEffect(() => {
    const timeline = [
      { delay: 500, action: () => setDotExpanded(true) },
      { delay: 1500, action: () => setShowDot(false) },
      { delay: 1600, action: () => setShowContent(true) },
      { delay: 2000, action: () => setShowLine1(true) },
      { delay: 2600, action: () => setShowLine2(true) },
      { delay: 3200, action: () => setShowLine3(true) },
      { delay: 4000, action: () => setShowButtons(true) },
    ];

    const timers = timeline.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Idle timeout
  useEffect(() => {
    if (!showButtons) return;
    
    const idleTimer = setTimeout(() => {
      setShowIdleText(true);
      setTimeout(() => setShowIdleText(false), 4000);
    }, 12000);

    return () => clearTimeout(idleTimer);
  }, [showButtons]);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // No button evasion
  const handleNoButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Move away from cursor
    const moveX = deltaX > 0 ? -80 : 80;
    const moveY = deltaY > 0 ? -40 : 40;
    
    setNoButtonOffset(prev => ({
      x: Math.max(-150, Math.min(150, prev.x + moveX * 0.5)),
      y: Math.max(-100, Math.min(100, prev.y + moveY * 0.5)),
    }));
  };

  const handleYes = () => {
    // Play chime
    if (!audioRef.current) {
      audioRef.current = new Audio(CHIME_SOUND);
    }
    audioRef.current.play().catch(() => {});
    
    // Brief flash then navigate
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: fixed; inset: 0; z-index: 1000;
      background: hsl(174 42% 45% / 0.3);
      animation: flash 0.4s ease-out forwards;
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => {
      flash.remove();
      navigate("/wordle");
    }, 400);
  };

  const handleNo = () => {
    navigate("/chaos");
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Flash animation style */}
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 40px hsl(174 42% 45% / 0.4); }
          50% { box-shadow: 0 0 60px hsl(174 42% 45% / 0.6), 0 0 80px hsl(174 42% 45% / 0.3); }
        }
        .btn-yes-enhanced {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        .btn-yes-enhanced:hover::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          background: radial-gradient(circle at center, hsl(174 42% 55% / 0.4) 0%, transparent 70%);
          animation: ripple 0.6s ease-out;
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Black screen with glowing dot */}
      <motion.div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: showDot ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ pointerEvents: showDot ? "auto" : "none" }}
      >
        <motion.div
          className="rounded-full"
          style={{ background: "hsl(174 42% 45%)" }}
          initial={{ width: 8, height: 8, opacity: 0 }}
          animate={{ 
            width: dotExpanded ? "300vmax" : 8, 
            height: dotExpanded ? "300vmax" : 8,
            opacity: 1,
          }}
          transition={{ 
            duration: dotExpanded ? 1.2 : 0.5, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        />
      </motion.div>

      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Background gradient with cursor interaction */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          background: "var(--gradient-dark)",
          x: springGradientX,
          y: springGradientY,
        }}
      />
      
      {/* Floating elements with cursor interaction */}
      <FloatingElement 
        className="w-96 h-96 -top-20 -left-20" 
        delay={0}
        color="primary"
        mouseX={mouseX}
        mouseY={mouseY}
      />
      <FloatingElement 
        className="w-80 h-80 top-1/4 -right-10" 
        delay={0.5}
        color="accent"
        mouseX={mouseX}
        mouseY={mouseY}
      />
      <FloatingElement 
        className="w-64 h-64 bottom-20 left-1/4" 
        delay={1}
        color="primary"
        mouseX={mouseX}
        mouseY={mouseY}
      />
      <FloatingElement 
        className="w-48 h-48 -bottom-10 right-1/3" 
        delay={1.5}
        color="accent"
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Subtle floral silhouettes */}
      <FloralSilhouette className="w-40 h-40 top-16 right-16" delay={0} />
      <FloralSilhouette className="w-32 h-32 bottom-24 left-12" delay={0.5} />
      <FloralSilhouette className="w-24 h-24 top-1/3 left-8" delay={1} />

      {/* Abstract lily/flower shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 opacity-20"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: showContent ? 0.2 : 0, rotate: 0 }}
        transition={{ delay: 0.8, duration: 1.5 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="30" rx="15" ry="25" fill="hsl(280 60% 55%)" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="30" rx="15" ry="25" fill="hsl(280 50% 45%)" transform="rotate(30 50 50)" />
          <ellipse cx="50" cy="30" rx="15" ry="25" fill="hsl(280 40% 35%)" />
          <circle cx="50" cy="55" r="8" fill="hsl(174 42% 45%)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-16 w-24 h-24 opacity-15"
        initial={{ opacity: 0, rotate: 20 }}
        animate={{ opacity: showContent ? 0.15 : 0, rotate: 0 }}
        transition={{ delay: 1.2, duration: 1.5 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="35" rx="12" ry="20" fill="hsl(174 42% 55%)" transform="rotate(-25 50 50)" />
          <ellipse cx="50" cy="35" rx="12" ry="20" fill="hsl(174 35% 45%)" transform="rotate(25 50 50)" />
          <ellipse cx="50" cy="35" rx="12" ry="20" fill="hsl(174 30% 35%)" />
        </svg>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showLine1 ? 1 : 0, y: showLine1 ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          Will you be my
        </motion.h1>
        
        <motion.h2 
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-semibold text-gradient-turquoise mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showLine2 ? 1 : 0, y: showLine2 ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          Valentine
        </motion.h2>

        <motion.p 
          className="font-heading text-4xl md:text-5xl lg:text-6xl italic text-gradient-purple mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showLine3 ? 1 : 0, y: showLine3 ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          Medha?
        </motion.p>

        {/* Micro text */}
        <motion.p
          className="text-muted-foreground/40 text-sm mb-12 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: showLine3 ? 0.4 : 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          I made something for you.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showButtons ? 1 : 0, y: showButtons ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.button
            className="btn-valentine btn-yes btn-yes-enhanced"
            onClick={handleYes}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes, absolutely
          </motion.button>

          <motion.button
            className="btn-valentine btn-no"
            onClick={handleNo}
            onMouseEnter={handleNoButtonHover}
            animate={{ 
              x: noButtonOffset.x, 
              y: noButtonOffset.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileTap={{ scale: 0.98 }}
          >
            No...
          </motion.button>
        </motion.div>

        {/* Idle text */}
        <motion.p
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 text-muted-foreground/50 text-sm whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: showIdleText ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          You're taking too long…
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ValentineLanding;
