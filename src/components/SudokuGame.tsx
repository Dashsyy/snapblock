import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { haptic } from '../utils/haptics';
import { audio } from '../utils/audio';
import { GameBackground } from './GameBackground';
import { GameHeader } from './GameHeader';
import { ResultsScreen } from './ResultsScreen';
import { SUDOKU_MODULE } from '../data/lessons';
import type { LevelType, Lesson } from '../data/lessons';

interface SudokuGameProps {
  userName: string;
  selectedLevel: LevelType;
  onBack: () => void;
  onModuleComplete: (moduleKey: string) => void;
}

interface SudokuCell {
  value: number;
  isInitial: boolean;
  row: number;
  col: number;
}

export const SudokuGame: React.FC<SudokuGameProps> = ({
  userName,
  selectedLevel,
  onBack,
  onModuleComplete
}) => {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [grid, setGrid] = useState<SudokuCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);
  
  const [score, setScore] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime] = useState(Date.now());
  const [isModuleFinished, setIsModuleFinished] = useState(false);
  const [showLessonSuccess, setShowLessonSuccess] = useState(false);
  const [bonusTimer, setBonusTimer] = useState(10);
  const [isBonusActive, setIsBonusActive] = useState(true);

  // Parse displayHint: "size,subR,subC"
  const currentHint = lessons[currentLessonIdx]?.displayHint || "4,2,2";
  const [gridSize, subR, subC] = currentHint.split(',').map(Number);

  const initSudoku = useCallback((lesson: Lesson) => {
    if (!lesson) return;
    const rows = lesson.target.split(',');
    
    const newGrid: SudokuCell[][] = rows.map((rowStr, r) => 
      rowStr.split('').map((char, c) => ({
        value: char === '0' ? 0 : parseInt(char),
        isInitial: char !== '0',
        row: r,
        col: c
      }))
    );

    setGrid(newGrid);
    setBonusTimer(10);
    setIsBonusActive(true);
    setSelectedCell(null);
  }, []);

  useEffect(() => {
    const moduleLessons = SUDOKU_MODULE[selectedLevel];
    setLessons(moduleLessons);
    if (moduleLessons.length > 0) {
      initSudoku(moduleLessons[0]);
    }
  }, [selectedLevel, initSudoku]);

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

  const isValidPlacement = (r: number, c: number, val: number, currentGrid: SudokuCell[][]) => {
    // Row check
    for (let i = 0; i < gridSize; i++) {
      if (i !== c && currentGrid[r][i].value === val) return false;
    }
    // Col check
    for (let i = 0; i < gridSize; i++) {
      if (i !== r && currentGrid[i][c].value === val) return false;
    }
    // Subgrid check
    const startR = Math.floor(r / subR) * subR;
    const startC = Math.floor(c / subC) * subC;
    for (let i = startR; i < startR + subR; i++) {
      for (let j = startC; j < startC + subC; j++) {
        if ((i !== r || j !== c) && currentGrid[i][j].value === val) return false;
      }
    }
    return true;
  };

  const handleCellClick = (r: number, c: number) => {
    if (grid[r][c].isInitial) return;
    setSelectedCell({ r, c });
    haptic.light();
  };

  const handleNumberSelect = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;

    if (isValidPlacement(r, c, num, grid)) {
      audio.play('snap_correct');
      haptic.success();
      
      const newGrid = [...grid];
      newGrid[r][c] = { ...newGrid[r][c], value: num };
      setGrid(newGrid);

      // Points
      setScore(prev => prev + (isBonusActive ? 2 : 1));
      setBonusTimer(10);
      setIsBonusActive(true);

      // Check if finished
      const isComplete = newGrid.every(row => row.every(cell => cell.value !== 0));
      if (isComplete) {
        handleLessonComplete();
      }
    } else {
      audio.play('wobble_error');
      haptic.error();
    }
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
        initSudoku(lessons[nextIdx]);
      } else {
        setIsModuleFinished(true);
        onModuleComplete(`SUDOKU-${selectedLevel}`);
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
          initSudoku(lessons[0]);
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
        moduleTitle={`${t('modules.SUDOKU')} - Lvl ${selectedLevel}`}
        currentLessonIdx={currentLessonIdx}
        totalLessons={lessons.length}
        elapsedTime={elapsedTime}
        score={score}
        onBack={onBack}
      />

      <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ 
            width: `${(bonusTimer / 10) * 100}%`,
            backgroundColor: isBonusActive ? '#6366f1' : '#9ca3af'
          }}
          style={{ height: '100%', position: 'absolute', left: 0, top: 0 }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', gap: '1.5rem' }}>
        
        {/* Sudoku Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '2px',
            backgroundColor: '#1f2937',
            padding: '4px',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxWidth: 'min(90vw, 500px)',
            width: '100%'
          }}
        >
          {grid.map((row, r) => row.map((cell, c) => {
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isSubgridEndR = (r + 1) % subR === 0 && r < gridSize - 1;
            const isSubgridEndC = (c + 1) % subC === 0 && c < gridSize - 1;

            return (
              <motion.div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                whileTap={{ scale: cell.isInitial ? 1 : 0.95 }}
                style={{
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: cell.isInitial ? '#f3f4f6' : isSelected ? '#e0e7ff' : 'white',
                  color: cell.isInitial ? '#1f2937' : '#6366f1',
                  fontWeight: cell.isInitial ? '900' : 'bold',
                  fontSize: gridSize > 6 ? '1.2rem' : '1.5rem',
                  cursor: cell.isInitial ? 'default' : 'pointer',
                  borderRight: isSubgridEndC ? '3px solid #1f2937' : 'none',
                  borderBottom: isSubgridEndR ? '3px solid #1f2937' : 'none',
                  position: 'relative'
                }}
              >
                {cell.value !== 0 ? cell.value : ''}
                {isSelected && (
                  <motion.div 
                    layoutId="selection"
                    style={{ position: 'absolute', inset: 0, border: '3px solid #6366f1', zIndex: 10 }} 
                  />
                )}
              </motion.div>
            );
          }))}
        </div>

        {/* Number Tray */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {Array.from({ length: gridSize }).map((_, i) => (
            <motion.button
              key={i + 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNumberSelect(i + 1)}
              style={{
                width: gridSize > 6 ? '40px' : '50px',
                height: gridSize > 6 ? '40px' : '50px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#6366f1',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>

        {isBonusActive && (
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ color: '#6366f1', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Zap size={20} fill="#6366f1" /> FOCUS BONUS ACTIVE
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
              border: '4px solid #6366f1'
            }}
          >
            <Trophy size={60} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '2rem', color: '#6366f1', margin: 0 }}>Puzzle Mastered!</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
