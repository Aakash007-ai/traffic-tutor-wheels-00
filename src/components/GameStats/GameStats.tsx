import AnimatedTransition from "../AnimatedTransition";
import { Heart, Zap } from "lucide-react";
import { Card } from "@/components/Card";
import { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from "react";

type GameStatsProps = {
  onGameOver: () => void;
};

type Stats = {
  score: number;
  lives: number;
};

type GameStatsHandle = {
  setStats: (isCorrect: boolean, score: number) => void;
};

const GameStats = forwardRef<GameStatsHandle, GameStatsProps>(({ onGameOver }, ref) => {
  const [stats, setStats] = useState<Stats>({ score: 0, lives: 3 });

  const updateStats = useCallback((isCorrect: boolean, score: number) => {
    setStats(prev => ({
      score: isCorrect ? prev.score + score : prev.score, // Keep the previous score if incorrect
      lives: isCorrect ? prev.lives : Math.max(0, prev.lives - 1), // Ensure lives don't go negative
    }));
  }, []);

  useImperativeHandle(ref, () => ({
    setStats: updateStats,
  }));

  useEffect(() => {
    if (stats.lives === 0) {
      onGameOver();
      setStats({ score: 0, lives: 3 }); // Reset stats
    }
  }, [stats.lives, onGameOver]); // Removed `stats` dependency to avoid infinite loop

  return (
    <AnimatedTransition animation="fade">
      <div className="mb-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
        <Card glass className="py-3 flex justify-center">
          <div className="flex flex-col items-center">
            <Zap className="h-5 w-5 text-amber-500 mb-1" />
            <p className="text-xs text-muted-foreground">SCORE</p>
            <p className="font-bold">{stats.score}</p>
          </div>
        </Card>

        <Card glass className="py-3 flex justify-center">
          <div className="flex flex-col items-center">
            <Heart className="h-5 w-5 text-red-500 mb-1" />
            <p className="text-xs text-muted-foreground">LIVES</p>
            <div className="flex">
              {Array.from({ length: stats.lives }).map((_, i) => (
                <Heart key={i} className="h-4 w-4 text-red-500 fill-red-500 mr-1" />
              ))}
              {Array.from({ length: 3 - stats.lives }).map((_, i) => (
                <Heart key={i + stats.lives} className="h-4 w-4 text-red-200 mr-1" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AnimatedTransition>
  );
});

export default GameStats;