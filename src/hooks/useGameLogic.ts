import { useState, useRef, useEffect, useCallback } from 'react';
import type { BlockType } from '../components/Block';
import type { ModuleType } from '../components/ModuleSelector';
import { WORD_MODULE, MATH_MODULE, VISUAL_MODULE } from '../data/lessons';
import { haptic } from '../utils/haptics';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const useGameLogic = (userName: string | null, selectedModule: ModuleType | null) => {
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [filledSlots, setFilledSlots] = useState<boolean[]>([]);
  const [placedChars, setPlacedChars] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModuleFinished, setIsModuleFinished] = useState(false);
  const [showLessonSuccess, setShowLessonSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const moduleLessons = selectedModule === 'MATH' ? MATH_MODULE : selectedModule === 'VISUAL' ? VISUAL_MODULE : WORD_MODULE;
  const currentLesson = moduleLessons[currentLessonIdx];
  const targetWord = currentLesson?.target || "";
  
  const [lessonTimer, setLessonTimer] = useState(15);
  const [initialLessonTimer, setInitialLessonTimer] = useState(15);
  const [isBonusActive, setIsBonusActive] = useState(true);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  const slotRefs = useRef<{ [key: number]: DOMRect }>({});

  const initializeLesson = useCallback((keepScore = true) => {
    if (!targetWord) return;
    const wordChars = targetWord.split('');
    
    let trayChars: string[] = [];
    if (selectedModule === 'MATH') {
      trayChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      trayChars = [...trayChars, ...Array.from({ length: 5 }, () => Math.floor(Math.random() * 10).toString())];
    } else {
      const randomChars = Array.from({ length: 15 - wordChars.length }, () => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      );
      trayChars = [...wordChars, ...randomChars];
    }
    
    const allChars = trayChars.sort(() => Math.random() - 0.5);
    
    const newBlocks: BlockType[] = allChars.map((char, i) => ({
      id: `${char}-${i}-${Math.random()}`,
      char,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      trayIndex: i,
      isPlaced: false,
    }));

    const duration = Math.max(10, targetWord.length * 5);
    setLessonTimer(duration);
    setInitialLessonTimer(duration);
    setIsBonusActive(true);

    setBlocks(newBlocks);
    setFilledSlots(new Array(targetWord.length).fill(false));
    setPlacedChars(new Array(targetWord.length).fill(null));
    setShowLessonSuccess(false);
    if (!keepScore) {
      setScore(0);
      setElapsedTime(0);
      setStartTime(Date.now());
    }
  }, [targetWord, selectedModule]);

  useEffect(() => {
    if (userName && selectedModule) {
      initializeLesson();
    }
  }, [initializeLesson, userName, selectedModule]);

  useEffect(() => {
    if (isModuleFinished || !userName || !selectedModule) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isModuleFinished, userName, selectedModule]);

  useEffect(() => {
    if (isModuleFinished || showLessonSuccess || !targetWord || !userName || !selectedModule) return;
    
    if (lessonTimer <= 0) {
      setIsBonusActive(false);
      return;
    }

    const interval = setInterval(() => {
      setLessonTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [lessonTimer, isModuleFinished, showLessonSuccess, targetWord, userName, selectedModule]);

  const handleLessonComplete = useCallback(() => {
    const points = isBonusActive ? 2 : 1;
    setScore(prev => prev + points);
    setLastPointsEarned(points);
    setShowLessonSuccess(true);
    haptic.double();
    
    setTimeout(() => {
      if (currentLessonIdx < moduleLessons.length - 1) {
        setCurrentLessonIdx(prev => prev + 1);
      } else {
        setIsModuleFinished(true);
      }
    }, 1500);
  }, [isBonusActive, currentLessonIdx, moduleLessons.length]);

  const handleDrop = useCallback((blockId: string, x: number, y: number): boolean => {
    if (!targetWord) return false;
    const block = blocks.find(b => b.id === blockId);
    if (!block) return false;

    for (let i = 0; i < targetWord.length; i++) {
      if (filledSlots[i]) continue;
      
      const slotRect = slotRefs.current[i];
      if (!slotRect) continue;

      const isInside = (
        x >= slotRect.left &&
        x <= slotRect.right &&
        y >= slotRect.top &&
        y <= slotRect.bottom
      );

      if (isInside) {
        const isCorrect = block.char === targetWord[i];
        
        if (selectedModule === 'MATH' || isCorrect) {
          if (isCorrect) haptic.success();
          else if (selectedModule === 'MATH') haptic.error();

          setPlacedChars(prev => {
            const next = [...prev];
            next[i] = block.char;
            return next;
          });

          setFilledSlots(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });

          setBlocks(prev => prev.map(b => 
            b.id === blockId ? { ...b, isPlaced: true } : b
          ));

          setTimeout(() => {
            setPlacedChars(currentPlaced => {
              const allCorrect = currentPlaced.every((char, idx) => char === targetWord[idx]);
              const allFilled = currentPlaced.every(char => char !== null);
              
              if (allFilled && allCorrect) {
                handleLessonComplete();
              }
              return currentPlaced;
            });
          }, 0);

          return true;
        }
      }
    }
    return false;
  }, [targetWord, blocks, filledSlots, selectedModule, handleLessonComplete]);

  const clearLesson = useCallback(() => {
    if (!targetWord) return;
    setFilledSlots(new Array(targetWord.length).fill(false));
    setPlacedChars(new Array(targetWord.length).fill(null));
    setBlocks(prev => prev.map(b => ({ ...b, isPlaced: false })));
  }, [targetWord]);

  const resetGame = useCallback(() => {
    setCurrentLessonIdx(0);
    setIsModuleFinished(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    initializeLesson(false);
  }, [initializeLesson]);

  return {
    currentLessonIdx,
    blocks,
    filledSlots,
    placedChars,
    score,
    elapsedTime,
    isModuleFinished,
    showLessonSuccess,
    lessonTimer,
    initialLessonTimer,
    isBonusActive,
    lastPointsEarned,
    currentLesson,
    targetWord,
    slotRefs,
    handleDrop,
    clearLesson,
    resetGame,
    setScore,
    setElapsedTime,
    setIsModuleFinished,
    setCurrentLessonIdx,
    isDragging,
    setIsDragging
  };
};
