import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FloatingElement = ({ 
  className, 
  delay = 0,
  color = "primary" 
}: { 
  className: string; 
  delay?: number;
  color?: "primary" | "accent";
}) => (
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
    }}
  />
);

const ValentineLanding = () => {
  const navigate = useNavigate();

  const handleYes = () => {
    navigate("/wordle");
  };

  const handleNo = () => {
    navigate("/chaos");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-dark)" }}
      />
      
      {/* Floating elements */}
      <FloatingElement 
        className="w-96 h-96 -top-20 -left-20" 
        delay={0}
        color="primary"
      />
      <FloatingElement 
        className="w-80 h-80 top-1/4 -right-10" 
        delay={0.5}
        color="accent"
      />
      <FloatingElement 
        className="w-64 h-64 bottom-20 left-1/4" 
        delay={1}
        color="primary"
      />
      <FloatingElement 
        className="w-48 h-48 -bottom-10 right-1/3" 
        delay={1.5}
        color="accent"
      />

      {/* Abstract lily/flower shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 opacity-20"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 0.2, rotate: 0 }}
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
        animate={{ opacity: 0.15, rotate: 0 }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.h1 
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Will you be my
        </motion.h1>
        
        <motion.h2 
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-semibold text-gradient-turquoise mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Valentine
        </motion.h2>

        <motion.p 
          className="font-heading text-4xl md:text-5xl lg:text-6xl italic text-gradient-purple mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Medha?
        </motion.p>

        {/* Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            className="btn-valentine btn-yes"
            onClick={handleYes}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Yes, absolutely
          </motion.button>

          <motion.button
            className="btn-valentine btn-no"
            onClick={handleNo}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            No...
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ValentineLanding;
