"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Heart, Star, Sun, Moon, Cloud, Flower2, CloudLightning, Gem, Flame, LucideIcon,
} from "lucide-react";

const iconSet: { icon: LucideIcon; color: string }[] = [
  { icon: Heart, color: "text-red-400" },
  { icon: Star, color: "text-yellow-400" },
  { icon: Sun, color: "text-orange-400" },
  { icon: Moon, color: "text-purple-400" },
  { icon: Cloud, color: "text-blue-400" },
  { icon: Flower2, color: "text-green-400" },
  { icon: CloudLightning, color: "text-yellow-500" },
  { icon: Gem, color: "text-cyan-400" },
  { icon: Flame, color: "text-red-500" },
];

const shuffleCards = (level: number) => {
  const numPairs = Math.min(level + 3, iconSet.length);
  const selectedIcons = iconSet.slice(0, numPairs);
  const cards = selectedIcons.flatMap(({ icon, color }, index) => [
    { id: index * 2, icon, color, isMatched: false, isFlipped: false },
    { id: index * 2 + 1, icon, color, isMatched: false, isFlipped: false },
  ]);
  return cards.sort(() => Math.random() - 0.5);
};

export default function MemoryGame() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState(shuffleCards(level));
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowPreview(false), 1500);
  }, [showPreview]);

  useEffect(() => {
    if (!showPreview) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [showPreview]);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      if (cards[first].icon === cards[second].icon) {
        setCards((prev) =>
          prev.map((card, i) =>
            i === first || i === second ? { ...card, isMatched: true } : card
          )
        );
        setMatches((m) => m + 1);
        setSelectedCards([]);
        setScore((s) => s + 100 + streak * 10); // ✅ Use functional update
        setStreak((s) => s + 1);
  
        if (matches + 1 === cards.length / 2) {
          setTimeout(() => {
            toast.success(`🎉 Level ${level} Complete! Next Level...`);
            setLevel((l) => l + 1);
            setCards(shuffleCards(level + 1));
            setMatches(0);
            setShowPreview(true);
            setTimer(30 - level);
          }, 500);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === first || i === second ? { ...card, isFlipped: false } : card
            )
          );
          setSelectedCards([]);
          setStreak(0);
        }, 600);
      }
    }
  }, [selectedCards, level, cards, matches, streak]); // ✅ Add missing dependencies
  

  useEffect(() => {
    if (timer === 0) {
      toast.error("⏳ Time's up! Try again!");
      setLevel(1);
      setCards(shuffleCards(1));
      setMatches(0);
      setTimer(30);
      setShowPreview(true);
      setScore(0);
    }
  }, [timer]);

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index) || cards[index].isMatched || showPreview) return;
    setSelectedCards([...selectedCards, index]);
    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-blue-300 mb-4">Memory Match Game</h1>
      <p className="text-lg text-gray-300 mb-2">Level: {level} | ⏳ Time Left: {timer}s</p>
      <p className="text-lg text-gray-400 mb-2">Matches: {matches}/{cards.length / 2} | Score: {score}</p>
      <p className="text-lg text-green-400 mb-2">🔥 Streak: {streak}</p>

      <div
        className="grid gap-2 p-2 bg-gray-800 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl"
        style={{ gridTemplateColumns: `repeat(${Math.min(3 + Math.floor(level / 2), 6)}, 1fr)` }}
      >
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className="w-full aspect-square flex items-center justify-center bg-gray-700 rounded-lg border cursor-pointer shadow-md"
              animate={{ rotateY: card.isFlipped || showPreview ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {(card.isFlipped || showPreview) && <IconComponent className={`w-10 h-10 ${card.color}`} />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}