import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ============================================
// ADD YOUR IMAGES HERE - Just add more items to this array!
// You can use local paths (e.g., "/images/photo1.jpg") or URLs
// ============================================
const SLIDESHOW_IMAGES: string[] = [
  // Example entries - replace with your actual images:
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1920&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1920&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1920&q=80",
  // Add more images below:
  // "/images/medha1.jpg",
  // "/images/medha2.jpg",
  // "/images/medha3.jpg",
  // ... add as many as you want!
];

const FinalReveal = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundBlur = useTransform(scrollYProgress, [0, 0.3], [0, 20]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [0.15, 0.08]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);

  // Image slideshow - loops through all images
  useEffect(() => {
    if (SLIDESHOW_IMAGES.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Attempt to play audio
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && !audioStarted) {
        try {
          await audioRef.current.play();
          setAudioStarted(true);
        } catch {
          // Autoplay was prevented, we'll try on user interaction
          console.log("Autoplay prevented, waiting for user interaction");
        }
      }
    };

    playAudio();

    // Try to play on any user interaction
    const handleInteraction = () => {
      if (audioRef.current && !audioStarted) {
        audioRef.current.play().then(() => setAudioStarted(true)).catch(() => {});
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };
  }, [audioStarted]);

  return (
    <div ref={containerRef} className="relative min-h-[200vh]">
      {/* Audio element - user will add their own audio source */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: "none" }}
      >
        {/* User will add source: <source src="/your-song.mp3" type="audio/mpeg" /> */}
      </audio>

      {/* Background slideshow - supports unlimited images */}
      <div className="fixed inset-0 overflow-hidden">
        {SLIDESHOW_IMAGES.map((src, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{
                opacity: backgroundOpacity,
                filter: `blur(${backgroundBlur}px)`,
              }}
            />
          </motion.div>
        ))}
        
        {/* Dark overlay for text readability */}
        <div 
          className="absolute inset-0"
          style={{ background: "var(--gradient-dark)" }}
        />
      </div>

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Initial view - just images */}
      <div className="h-screen flex items-center justify-center relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="text-muted-foreground text-lg font-body">
            Scroll down...
          </p>
          <motion.div
            className="mt-4 text-2xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Text reveal section */}
      <motion.div 
        className="min-h-screen flex items-center justify-center relative z-10 px-6"
        style={{ opacity: textOpacity, y: textY }}
      >
        <div className="reveal-text max-w-2xl mx-auto p-8 md:p-12 rounded-2xl">
          <motion.h2
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-gradient-turquoise mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Dear Medha,
          </motion.h2>

          <div className="space-y-6 text-foreground/90 font-body text-lg md:text-xl leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              From the moment I met you, I knew there was something extraordinary about you. 
              Your smile lights up every room, and your laughter is the sweetest melody I've ever heard.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Every day with you feels like a gift. You make the ordinary moments feel magical, 
              and I find myself falling more in love with you with each passing day.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              You are my best friend, my confidant, and my greatest adventure. 
              I can't imagine my life without you in it.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gradient-purple font-heading text-2xl md:text-3xl text-center pt-4"
            >
              Happy Valentine's Day, my love.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center text-muted-foreground italic"
            >
              Forever yours,
              <br />
              <span className="text-foreground not-italic font-medium">Garvv</span>
            </motion.p>
          </div>

          {/* Heart decoration */}
          <motion.div
            className="flex justify-center gap-4 mt-12"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <span className="text-4xl">💜</span>
            <span className="text-4xl">🤍</span>
            <span className="text-4xl">💜</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Extra scroll space for full reveal */}
      <div className="h-[50vh]" />
    </div>
  );
};

export default FinalReveal;
