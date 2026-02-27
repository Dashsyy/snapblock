import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { haptic } from '../utils/haptics';
import { audio } from '../utils/audio';
import { GameBackground } from './GameBackground';
import { GameHeader } from './GameHeader';
import { ResultsScreen } from './ResultsScreen';
import { SEARCH_MODULE } from '../data/lessons';
import type { LevelType, Lesson } from '../data/lessons';

interface WordSearchGameProps {
  userName: string;
  selectedLevel: LevelType;
  onBack: () => void;
  onModuleComplete: (moduleKey: string) => void;
}

interface GridCell {
  char: string;
  row: number;
  col: number;
  found: boolean;
  partOfCurrentSelection: boolean;
}

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
  userName,
  selectedLevel,
  onBack,
  onModuleComplete
}) => {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [wordsToFind, setWordsToFind] = useState<{ word: string, found: boolean }[]>([]);
  const [selection, setSelection] = useState<{ r: number, c: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const [score, setScore] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime] = useState(Date.now());
  const [isModuleFinished, setIsModuleFinished] = useState(false);
  const [showLessonSuccess, setShowLessonSuccess] = useState(false);
  const [bonusTimer, setBonusTimer] = useState(30);
  const [isBonusActive, setIsBonusActive] = useState(true);

  const gridSize = selectedLevel === 1 ? 6 : selectedLevel === 2 ? 8 : 10;

  const generateGrid = useCallback((lesson: Lesson) => {
    const words = lesson.target.split(',');
    setWordsToFind(words.map(w => ({ word: w, found: false })));
    
    // Initialize empty grid
    let newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    // Place words
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        
        let canPlace = true;
        if (direction === 0 && col + word.length <= gridSize) {
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row][col + i] !== '' && newGrid[row][col + i] !== word[i]) canPlace = false;
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[row][col + i] = word[i];
            placed = true;
          }
        } else if (direction === 1 && row + word.length <= gridSize) {
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row + i][col] !== '' && newGrid[row + i][col] !== word[i]) canPlace = false;
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[row + i][col] = word[i];
            placed = true;
          }
        } else if (direction === 2 && row + word.length <= gridSize && col + word.length <= gridSize) {
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row + i][col + i] !== '' && newGrid[row + i][col + i] !== word[i]) canPlace = false;
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[row + i][col + i] = word[i];
            placed = true;
          }
        }
        attempts++;
      }
    });

    // Fill remaining spaces with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const finalGrid: GridCell[][] = newGrid.map((row, r) => 
      row.map((char, c) => ({
        char: char === '' ? alphabet[Math.floor(Math.random() * alphabet.length)] : char,
        row: r,
        col: c,
        found: false,
        partOfCurrentSelection: false
      }))
    );
    
    setGrid(finalGrid);
    setBonusTimer(30);
    setIsBonusActive(true);
  }, [gridSize]);

  useEffect(() => {
    const moduleLessons = SEARCH_MODULE[selectedLevel];
    setLessons(moduleLessons);
    if (moduleLessons.length > 0) {
      generateGrid(moduleLessons[0]);
    }
  }, [selectedLevel, generateGrid]);

  useEffect(() => {
    if (isModuleFinished) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isModuleFinished]);

  useEffect(() => {
    if (isModuleFinished || !isBonusActive) return;
    const interval = setInterval(() => {
      setBonusTimer(prev => {
        if (prev <= 0) {
          setIsBonusActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isModuleFinished, isBonusActive]);

  const handlePointerDown = (r: number, c: number) => {
    setIsDragging(true);
    setSelection([{ r, c }]);
    haptic.light();
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (isDragging) {
      // Only allow straight lines (horizontal, vertical, diagonal)
      const start = selection[0];
      const dr = Math.abs(r - start.r);
      const dc = Math.abs(c - start.c);
      
      if (dr === 0 || dc === 0 || dr === dc) {
        // Generate path
        const steps = Math.max(dr, dc);
        const newSelection = [];
        const stepR = dr === 0 ? 0 : (r - start.r) / dr;
        const stepC = dc === 0 ? 0 : (c - start.c) / dc;
        
        for (let i = 0; i <= steps; i++) {
          newSelection.push({ 
            r: start.r + i * stepR, 
            c: start.c + i * stepC 
          });
        }
        setSelection(newSelection);
        haptic.light();
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const selectedWord = selection.map(s => grid[s.r][s.c].char).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const wordIdx = wordsToFind.findIndex(w => !w.found && (w.word === selectedWord || w.word === reversedWord));
    
    if (wordIdx !== -1) {
      // Found a word!
      audio.play('snap_correct');
      haptic.success();
      
      setWordsToFind(prev => prev.map((w, i) => i === wordIdx ? { ...w, found: true } : w));
      
      setGrid(prev => {
        const next = [...prev];
        selection.forEach(s => {
          next[s.r][s.c] = { ...next[s.r][s.c], found: true };
        });
        return next;
      });

      // Bonus points
      const points = isBonusActive ? 2 : 1;
      setScore(prev => prev + points);
      
      // Add time boost
      setBonusTimer(prev => Math.min(30, prev + 5));
      setIsBonusActive(true);

      // Check if all words found
      setTimeout(() => {
        setWordsToFind(currentWords => {
          if (currentWords.every(w => w.found)) {
            handleLessonComplete();
          }
          return currentWords;
        });
      }, 500);
    } else {
      if (selection.length > 1) {
        audio.play('wobble_error');
        haptic.error();
      }
    }
    
    setSelection([]);
  };

  const handleLessonComplete = () => {
    setShowLessonSuccess(true);
    audio.play('lesson_success');
    haptic.double();
    
    setTimeout(() => {
      setShowLessonSuccess(false);
      if (currentLessonIdx < lessons.length - 1) {
        const nextIdx = currentLessonIdx + 1;
        setCurrentLessonIdx(nextIdx);
        generateGrid(lessons[nextIdx]);
      } else {
        setIsModuleFinished(true);
        onModuleComplete(`SEARCH-${selectedLevel}`);
      }
    }, 2000);
  };

  if (isModuleFinished) {
    return (
      <ResultsScreen 
        userName={userName}
        score={score}
        totalTime={elapsedTime}
        onRestart={() => {
          setIsModuleFinished(false);
          setScore(0);
          setElapsedTime(0);
          setCurrentLessonIdx(0);
          generateGrid(lessons[0]);
        }}
        onHome={onBack}
      />
    );
  }

  return (
    <div style={{ width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <GameBackground isBonusActive={isBonusActive} />
      <GameHeader 
        userName={userName}
        moduleTitle={`${t('modules.SEARCH')} - Lvl ${selectedLevel}`}
        currentLessonIdx={currentLessonIdx}
        totalLessons={lessons.length}
        elapsedTime={elapsedTime}
        score={score}
        onBack={onBack}
      />

      {/* Bonus Bar */}
      <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ 
            width: `${(bonusTimer / 30) * 100}%`,
            backgroundColor: isBonusActive ? '#ec4899' : '#9ca3af'
          }}
          style={{ height: '100%', position: 'absolute', left: 0, top: 0 }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', gap: '2rem' }}>
        
        {/* Words to Find */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', maxWidth: '500px' }}>
          {wordsToFind.map((w, i) => (
            <div 
              key={i} 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: w.found ? '#ec4899' : 'white',
                color: w.found ? 'white' : '#4b5563',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                textDecoration: w.found ? 'line-through' : 'none',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {w.found && <CheckCircle2 size={16} />}
              {w.word}
            </div>
          ))}
        </div>

        {/* The Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '4px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '8px',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            userSelect: 'none',
            touchAction: 'none'
          }}
          onPointerLeave={handlePointerUp}
        >
          {grid.map((row, r) => row.map((cell, c) => {
            const isSelected = selection.some(s => s.r === r && s.c === c);
            return (
              <motion.div
                key={`${r}-${c}`}
                onPointerDown={() => handlePointerDown(r, c)}
                onPointerEnter={() => handlePointerEnter(r, c)}
                onPointerUp={handlePointerUp}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 'clamp(35px, 8vw, 50px)',
                  height: 'clamp(35px, 8vw, 50px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: cell.found ? '#ec4899' : isSelected ? '#fbcfe8' : 'white',
                  color: cell.found ? 'white' : isSelected ? '#be185d' : '#1f2937',
                  borderRadius: '8px',
                  fontWeight: '900',
                  fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, color 0.2s',
                  boxShadow: cell.found ? '0 4px 0 #be185d' : '0 2px 0 rgba(0,0,0,0.05)'
                }}
              >
                {cell.char}
              </motion.div>
            );
          }))}
        </div>

        {isBonusActive && (
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ color: '#ec4899', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Zap size={20} fill="#ec4899" /> 2X BONUS ACTIVE
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showLessonSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              zIndex: 1000,
              textAlign: 'center',
              border: '4px solid #ec4899'
            }}
          >
            <Trophy size={60} color="#ec4899" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '2rem', color: '#ec4899', margin: 0 }}>Category Cleared!</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
