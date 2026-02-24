import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Block } from './components/Block';
import type { BlockType } from './components/Block';
import { TargetZone } from './components/TargetZone';
import { ResultsScreen } from './components/ResultsScreen';
import { IntroScreen } from './components/IntroScreen';
import { ModuleSelector } from './components/ModuleSelector';
import type { ModuleType } from './components/ModuleSelector';
import { WORD_MODULE, MATH_MODULE, VISUAL_MODULE } from './data/lessons';
import { haptic } from './utils/haptics';
import { Trophy, Timer, Star, Zap, User, ArrowLeft } from 'lucide-react';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [filledSlots, setFilledSlots] = useState<boolean[]>([]);
  const [placedChars, setPlacedChars] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModuleFinished, setIsModuleFinished] = useState(false);
  const [showLessonSuccess, setShowLessonSuccess] = useState(false);
  
  const moduleLessons = selectedModule === 'MATH' ? MATH_MODULE : selectedModule === 'VISUAL' ? VISUAL_MODULE : WORD_MODULE;
  const currentLesson = moduleLessons[currentLessonIdx];
  const targetWord = currentLesson?.target || "";
  
  const [lessonTimer, setLessonTimer] = useState(15);
  const [initialLessonTimer, setInitialLessonTimer] = useState(15);
  const [isBonusActive, setIsBonusActive] = useState(true);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
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

  const onSlotMount = (index: number, element: HTMLDivElement | null) => {
    if (element) {
      slotRefs.current[index] = element.getBoundingClientRect();
    }
  };

  const handleDrop = (blockId: string, x: number, y: number) => {
    if (!targetWord) return;
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

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

          return;
        }
      }
    }
  };

  const handleLessonComplete = () => {
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
  };

  const clearLesson = () => {
    if (!targetWord) return;
    setFilledSlots(new Array(targetWord.length).fill(false));
    setPlacedChars(new Array(targetWord.length).fill(null));
    setBlocks(prev => prev.map(b => ({ ...b, isPlaced: false })));
  };

  const resetGame = () => {
    setCurrentLessonIdx(0);
    setIsModuleFinished(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    initializeLesson(false);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setCurrentLessonIdx(0);
    setIsModuleFinished(false);
    setScore(0);
    setElapsedTime(0);
  };

  if (!userName) {
    return <IntroScreen onStart={(name) => setUserName(name)} />;
  }

  if (!selectedModule) {
    return <ModuleSelector userName={userName} onSelect={(mod) => setSelectedModule(mod)} />;
  }

  if (isModuleFinished) {
    return (
      <ResultsScreen 
        userName={userName}
        score={score} 
        totalTime={elapsedTime} 
        onRestart={resetGame} 
      />
    );
  }

  return (
    <div 
      className="app-container" 
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />
      </div>

      <header style={{ 
        padding: '0.75rem 1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        borderBottom: '2px solid #d1d5db',
        flexWrap: 'wrap',
        gap: '0.5rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={handleBackToModules}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#1f2937' }}>WordSnap</h1>
          </div>
          <div style={{ height: '24px', width: '2px', backgroundColor: '#e5e7eb' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontWeight: 'bold' }}>
            <User size={18} />
            <span style={{ fontSize: '0.9rem' }}>{userName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{currentLessonIdx + 1}/10</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', fontWeight: 'bold' }}>
            <Timer size={18} color="#3b82f6" />
            <span>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', fontWeight: 'bold' }}>
            <Trophy size={18} color="#f59e0b" />
            <span>{score}</span>
          </div>
        </div>
      </header>

      <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ 
            width: `${(lessonTimer / initialLessonTimer) * 100}%`,
            backgroundColor: isBonusActive ? '#3b82f6' : '#9ca3af'
          }}
          style={{ height: '100%', position: 'absolute', left: 0, top: 0 }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '1rem' }}>
        
        <AnimatePresence mode="wait">
          {currentLesson && (
            <motion.div
              key={currentLesson.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {currentLesson.icon && (
                <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '3rem', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginBottom: '1.5rem', color: '#3b82f6' }}>
                  {currentLesson.icon}
                </div>
              )}
              {currentLesson.displayHint && (
                <div style={{ 
                  fontSize: 'min(5rem, 12vw)', 
                  fontWeight: 900, 
                  color: '#1f2937', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  backgroundColor: 'white',
                  padding: '1.5rem 3rem',
                  borderRadius: '2rem',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  border: '4px solid #f1f5f9'
                }}>
                  {currentLesson.displayHint}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
             {isBonusActive ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem' }}>
                 <Zap size={18} fill="#3b82f6" />
                 <span>BONUS ACTIVE (x2 POINTS!)</span>
                 <span style={{ backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '10px' }}>{lessonTimer}s</span>
               </div>
             ) : (
               <span style={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '0.9rem' }}>TIME'S UP! (NORMAL SCORE)</span>
             )}
          </div>

          <TargetZone
            targetWord={targetWord}
            placedChars={placedChars}
            filledSlots={filledSlots}
            onSlotMount={onSlotMount}
            isMathMode={selectedModule === 'MATH'}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', minHeight: '60px' }}>
            <AnimatePresence>
              {filledSlots.some(s => s) && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearLesson}
                  style={{
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#4b5563',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
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
                backgroundColor: 'rgba(255,255,255,0.95)',
                padding: '1.5rem 2rem',
                borderRadius: '2rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                zIndex: 1000,
                textAlign: 'center',
                border: `4px solid ${lastPointsEarned === 2 ? '#3b82f6' : '#10b981'}`,
                width: 'min(300px, 80%)'
              }}
            >
              <h2 style={{ fontSize: '2rem', color: lastPointsEarned === 2 ? '#3b82f6' : '#10b981', margin: 0 }}>
                {lastPointsEarned === 2 ? 'SUPER FAST!' : 'AWESOME!'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Trophy size={20} color={lastPointsEarned === 2 ? '#3b82f6' : '#10b981'} />
                <span style={{ fontWeight: '900', fontSize: '1.5rem', color: '#1f2937' }}>+{lastPointsEarned}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        style={{
          minHeight: '220px',
          maxHeight: '40vh',
          backgroundColor: '#ffffff',
          borderTop: '2px solid #d1d5db',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          overflow: 'visible'
        }}
      >
        <div className="tray-grid">
          {Array.from({ length: 15 }).map((_, i) => {
            const block = blocks.find(b => b.trayIndex === i);
            return (
              <div 
                key={i} 
                className="tray-slot"
                style={{ 
                  borderRadius: 12, 
                  backgroundColor: '#f9fafb',
                  border: '2px dashed #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <AnimatePresence>
                  {block && !block.isPlaced && (
                    <motion.div
                      key={block.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ position: 'absolute' }}
                    >
                      <Block
                        block={block}
                        onDrop={handleDrop}
                        containerRef={containerRef}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
