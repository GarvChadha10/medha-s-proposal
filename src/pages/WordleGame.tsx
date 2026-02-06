import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WORD = "GAMMA";
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

type TileState = "empty" | "filled" | "correct" | "present" | "absent" | "heart";

interface Tile {
  letter: string;
  state: TileState;
}

// Heart pattern for the grid (which tiles should turn purple)
const HEART_PATTERN = [
  [false, true, false, true, false],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [false, true, true, true, false],
  [false, false, true, false, false],
  [false, false, false, false, false],
];

const WordleGame = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<Tile[][]>(() =>
    Array.from({ length: MAX_ATTEMPTS }, () =>
      Array.from({ length: WORD_LENGTH }, () => ({ letter: "", state: "empty" as TileState }))
    )
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [flipIndices, setFlipIndices] = useState<Set<string>>(new Set());

  const checkGuess = useCallback((guess: string) => {
    const result: TileState[] = Array(WORD_LENGTH).fill("absent");
    const wordArray = WORD.split("");
    const guessArray = guess.split("");
    const used = Array(WORD_LENGTH).fill(false);

    // First pass: correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArray[i] === wordArray[i]) {
        result[i] = "correct";
        used[i] = true;
      }
    }

    // Second pass: present but wrong position
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === "correct") continue;
      
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (!used[j] && guessArray[i] === wordArray[j]) {
          result[i] = "present";
          used[j] = true;
          break;
        }
      }
    }

    return result;
  }, []);

  const revealRow = useCallback(async (rowIndex: number, states: TileState[]) => {
    setIsRevealing(true);
    
    for (let i = 0; i < WORD_LENGTH; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setFlipIndices((prev) => new Set([...prev, `${rowIndex}-${i}`]));
      
      setTimeout(() => {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[rowIndex] = [...newGrid[rowIndex]];
          newGrid[rowIndex][i] = { ...newGrid[rowIndex][i], state: states[i] };
          return newGrid;
        });
      }, 250);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRevealing(false);
  }, []);

  const submitGuess = useCallback(async () => {
    if (currentCol !== WORD_LENGTH || isRevealing) return;

    const guess = grid[currentRow].map((t) => t.letter).join("");
    const states = checkGuess(guess);

    await revealRow(currentRow, states);

    if (guess === WORD) {
      setGameWon(true);
      
      // Wait a moment, then show heart animation
      setTimeout(() => {
        setShowHeartAnimation(true);
        
        // Animate heart pattern
        HEART_PATTERN.forEach((row, rowIndex) => {
          row.forEach((isHeart, colIndex) => {
            if (isHeart && rowIndex < MAX_ATTEMPTS) {
              setTimeout(() => {
                setGrid((prev) => {
                  const newGrid = [...prev];
                  if (newGrid[rowIndex]) {
                    newGrid[rowIndex] = [...newGrid[rowIndex]];
                    newGrid[rowIndex][colIndex] = { 
                      ...newGrid[rowIndex][colIndex], 
                      state: "heart" 
                    };
                  }
                  return newGrid;
                });
                setFlipIndices((prev) => new Set([...prev, `heart-${rowIndex}-${colIndex}`]));
              }, (rowIndex * 5 + colIndex) * 100);
            }
          });
        });

        // Navigate to final page after heart animation
        setTimeout(() => {
          navigate("/final");
        }, 2500);
      }, 1000);
    } else {
      setCurrentRow((prev) => prev + 1);
      setCurrentCol(0);
    }
  }, [currentCol, currentRow, grid, isRevealing, checkGuess, revealRow, navigate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameWon || isRevealing) return;

      if (e.key === "Enter") {
        submitGuess();
        return;
      }

      if (e.key === "Backspace") {
        if (currentCol > 0) {
          setCurrentCol((prev) => prev - 1);
          setGrid((prev) => {
            const newGrid = [...prev];
            newGrid[currentRow] = [...newGrid[currentRow]];
            newGrid[currentRow][currentCol - 1] = { letter: "", state: "empty" };
            return newGrid;
          });
        }
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key) && currentCol < WORD_LENGTH) {
        const letter = e.key.toUpperCase();
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[currentRow] = [...newGrid[currentRow]];
          newGrid[currentRow][currentCol] = { letter, state: "filled" };
          return newGrid;
        });
        setCurrentCol((prev) => prev + 1);
      }
    },
    [currentCol, currentRow, gameWon, isRevealing, submitGuess]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const getTileClass = (state: TileState) => {
    switch (state) {
      case "correct":
        return "correct";
      case "present":
        return "present";
      case "absent":
        return "absent";
      case "heart":
        return "heart";
      case "filled":
        return "filled";
      default:
        return "";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-dark)" }}
      />

      {/* Subtle floating elements */}
      <motion.div
        className="floating-element w-64 h-64 -top-20 -right-20"
        style={{ background: "hsl(174 42% 45%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      />
      <motion.div
        className="floating-element w-48 h-48 bottom-20 -left-10"
        style={{ background: "hsl(280 60% 55%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Title */}
      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
          Guess the Word
        </h1>
        <p className="text-muted-foreground text-sm">
          Type using your keyboard • 5 letters • 6 attempts
        </p>
      </motion.div>

      {/* Game Grid */}
      <motion.div
        className="relative z-10 grid gap-2"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((tile, colIndex) => {
                const isFlipping = flipIndices.has(`${rowIndex}-${colIndex}`) || 
                                   flipIndices.has(`heart-${rowIndex}-${colIndex}`);
                
                return (
                  <motion.div
                    key={colIndex}
                    className={`wordle-tile ${getTileClass(tile.state)}`}
                    initial={tile.state === "filled" ? { scale: 1.1 } : {}}
                    animate={{ 
                      scale: 1,
                      rotateX: isFlipping ? [0, 90, 0] : 0,
                    }}
                    transition={{
                      scale: { duration: 0.1 },
                      rotateX: { duration: 0.5, ease: "easeInOut" },
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {tile.letter}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Hint for mobile users */}
      <motion.p
        className="relative z-10 mt-8 text-muted-foreground/50 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Use your physical keyboard to play
      </motion.p>

      {/* Heart animation overlay */}
      <AnimatePresence>
        {showHeartAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-8xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 1.5 
              }}
            >
              💜
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordleGame;
