import { useState, useRef, useEffect, useCallback } from 'react';
import type { BlockType } from '../components/Block';
import type { ModuleType } from '../components/ModuleSelector';
import { WORD_MODULE, MATH_MODULE, VISUAL_MODULE, ELECTRONICS_MODULE } from '../data/lessons';
import type { LevelType, Lesson } from '../data/lessons';
import { haptic } from '../utils/haptics';
import { audio } from '../utils/audio';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

/**
 * Fisher-Yates Shuffle for uniform randomness
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const useGameLogic = (userName: string | null, selectedModule: ModuleType | null, selectedLevel: LevelType | null) => {
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  
  const currentLesson = moduleLessons[currentLessonIdx];
  const targetWord = currentLesson?.target || "";

  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [filledSlots, setFilledSlots] = useState<boolean[]>([]);
  const [placedChars, setPlacedChars] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModuleFinished, setIsModuleFinished] = useState(false);
  const [showLessonSuccess, setShowLessonSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hintBlockId, setHintBlockId] = useState<string | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHintTimeout = useCallback(() => {
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    setHintBlockId(null);
    
    hintTimeoutRef.current = setTimeout(() => {
      // Find the first empty slot
      const firstEmptyIdx = filledSlots.findIndex(s => !s);
      if (firstEmptyIdx !== -1 && targetWord) {
        const neededChar = targetWord[firstEmptyIdx];
        // Find a block in the tray that has this char and is not placed
        const availableBlock = blocks.find(b => b.char === neededChar && !b.isPlaced);
        if (availableBlock) {
          setHintBlockId(availableBlock.id);
        }
      }
    }, 10000); // 10 seconds hint
  }, [filledSlots, targetWord, blocks]);

  useEffect(() => {
    if (!isModuleFinished && !showLessonSuccess) {
      resetHintTimeout();
    }
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, [resetHintTimeout, isModuleFinished, showLessonSuccess, currentLessonIdx]);
  
  const [lessonTimer, setLessonTimer] = useState(15);
  const [initialLessonTimer, setInitialLessonTimer] = useState(15);
  const [isBonusActive, setIsBonusActive] = useState(true);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

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
    
    const allChars = shuffle(trayChars);
    
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
    if (userName && selectedModule && selectedLevel) {
      let allLessons: Lesson[] = [];
      if (selectedModule === 'MATH') {
        allLessons = MATH_MODULE[selectedLevel];
      } else if (selectedModule === 'VISUAL') {
        allLessons = VISUAL_MODULE[selectedLevel];
      } else if (selectedModule === 'ELECTRONICS') {
        allLessons = ELECTRONICS_MODULE[selectedLevel];
      } else {
        allLessons = WORD_MODULE[selectedLevel];
      }
      
      const shuffled = shuffle(allLessons);
      setModuleLessons(shuffled.slice(0, 5));
      setCurrentLessonIdx(0);
      setIsModuleFinished(false);
      setScore(0);
      setElapsedTime(0);
      setStartTime(Date.now());
    }
  }, [userName, selectedModule, selectedLevel]);

  useEffect(() => {
    if (moduleLessons.length > 0) {
      initializeLesson(currentLessonIdx > 0);
    }
  }, [moduleLessons, currentLessonIdx, initializeLesson]);

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
    const bonusMessages = ['superFast', 'amazing', 'fantastic', 'bravo'];
    const standardMessages = ['awesome', 'wellDone', 'greatJob', 'keepItUp'];
    const messagePool = points === 2 ? bonusMessages : standardMessages;
    const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
    
    setScore(prev => prev + points);
    setLastPointsEarned(points);
    setSuccessMessage(randomMessage);
    setShowLessonSuccess(true);
    haptic.double();
    audio.play('lesson_success');
    
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
        resetHintTimeout();
        
        if (selectedModule === 'MATH' || isCorrect) {
          if (isCorrect) {
            haptic.success();
            audio.play('snap_correct');
          } else if (selectedModule === 'MATH') {
            haptic.error();
            // Sound is now handled by Block.tsx for drops
          }

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

  const handleKeyPress = useCallback((key: string) => {
    if (!targetWord || isModuleFinished || showLessonSuccess) return;
    
    const pressedChar = key.toUpperCase();
    
    // Find the first empty slot and check if it matches the pressed key
    const firstEmptyIdx = filledSlots.findIndex(s => !s);
    if (firstEmptyIdx !== -1) {
      const correctChar = targetWord[firstEmptyIdx];
      
      if (pressedChar === correctChar) {
        // Find the block in tray to "place" it
        const availableBlock = blocks.find(b => b.char === pressedChar && !b.isPlaced);
        if (availableBlock) {
          haptic.success();
          audio.play('snap_correct');
          resetHintTimeout();
          
          setPlacedChars(prev => {
            const next = [...prev];
            next[firstEmptyIdx] = pressedChar;
            return next;
          });

          setFilledSlots(prev => {
            const next = [...prev];
            next[firstEmptyIdx] = true;
            return next;
          });

          setBlocks(prev => prev.map(b => 
            b.id === availableBlock.id ? { ...b, isPlaced: true } : b
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
        }
      } else if (/^[A-Z0-9]$/.test(pressedChar)) {
        // Only trigger error if it's a valid character but wrong
        haptic.error();
        audio.play('wobble_error');
        resetHintTimeout();
      }
    }
  }, [targetWord, isModuleFinished, showLessonSuccess, filledSlots, blocks, resetHintTimeout, handleLessonComplete]);

  const clearLesson = useCallback(() => {
    if (!targetWord) return;
    resetHintTimeout();
    audio.play('clear');
    setFilledSlots(new Array(targetWord.length).fill(false));
    setPlacedChars(new Array(targetWord.length).fill(null));
    setBlocks(prev => prev.map(b => ({ ...b, isPlaced: false })));
  }, [targetWord, resetHintTimeout]);

  const resetGame = useCallback(() => {
    if (selectedModule && selectedLevel) {
      let allLessons: Lesson[] = [];
      if (selectedModule === 'MATH') {
        allLessons = MATH_MODULE[selectedLevel];
      } else if (selectedModule === 'VISUAL') {
        allLessons = VISUAL_MODULE[selectedLevel];
      } else if (selectedModule === 'ELECTRONICS') {
        allLessons = ELECTRONICS_MODULE[selectedLevel];
      } else {
        allLessons = WORD_MODULE[selectedLevel];
      }
      const shuffled = shuffle(allLessons);
      setModuleLessons(shuffled.slice(0, 5));
    }
    setCurrentLessonIdx(0);
    setIsModuleFinished(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setScore(0);
  }, [selectedModule, selectedLevel]);

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
    successMessage,
    currentLesson,
    targetWord,
    slotRefs,
    handleDrop,
    handleKeyPress,
    clearLesson,
    resetGame,
    setScore,
    setElapsedTime,
    setIsModuleFinished,
    setCurrentLessonIdx,
    isDragging,
    setIsDragging,
    hintBlockId,
    totalLessons: moduleLessons.length
  };
};

