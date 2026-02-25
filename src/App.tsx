import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TargetZone } from './components/TargetZone';
import { ResultsScreen } from './components/ResultsScreen';
import { IntroScreen } from './components/IntroScreen';
import { ModuleSelector } from './components/ModuleSelector';
import type { ModuleType } from './components/ModuleSelector';
import type { LevelType } from './data/lessons';
import { Zap, Trophy } from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { useTranslation } from 'react-i18next';

// Sub-components
import { GameHeader } from './components/GameHeader';
import { GameBackground } from './components/GameBackground';
import { LessonDisplay } from './components/LessonDisplay';
import { Tray } from './components/Tray';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelType | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const { t } = useTranslation();

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snapblocks_progress');
    if (saved) {
      try {
        setCompletedModules(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  // Save progress when it changes
  useEffect(() => {
    if (completedModules.length > 0) {
      localStorage.setItem('snapblocks_progress', JSON.stringify(completedModules));
    }
  }, [completedModules]);
  
  const {
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
    totalLessons
  } = useGameLogic(userName, selectedModule, selectedLevel);

  // Update progress when module is finished
  useEffect(() => {
    if (isModuleFinished && selectedModule && selectedLevel) {
      const moduleKey = `${selectedModule}-${selectedLevel}`;
      setCompletedModules(prev => {
        if (!prev.includes(moduleKey)) {
          return [...prev, moduleKey];
        }
        return prev;
      });
    }
  }, [isModuleFinished, selectedModule, selectedLevel]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  const updateSlotRects = useCallback(() => {
    Object.keys(slotRefs.current).forEach(key => {
      const idx = parseInt(key);
      const el = document.querySelector(`.target-slot[data-index="${idx}"]`);
      if (el) {
        slotRefs.current[idx] = el.getBoundingClientRect();
      }
    });
  }, [slotRefs]);

  useEffect(() => {
    window.addEventListener('resize', updateSlotRects);
    window.addEventListener('scroll', updateSlotRects, true);
    return () => {
      window.removeEventListener('resize', updateSlotRects);
      window.removeEventListener('scroll', updateSlotRects, true);
    };
  }, [updateSlotRects]);

  const onSlotMount = (index: number, element: HTMLDivElement | null) => {
    if (element) {
      slotRefs.current[index] = element.getBoundingClientRect();
    }
  };

  const getModuleTitle = () => {
    if (!selectedModule || !selectedLevel) return '';
    return `${t(`modules.${selectedModule}`)} - ${t(`levels.${selectedLevel}`)}`;
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setSelectedLevel(null);
    setCurrentLessonIdx(0);
    setIsModuleFinished(false);
    setScore(0);
    setElapsedTime(0);
  };

  if (!userName) {
    return <IntroScreen onStart={(name) => setUserName(name)} />;
  }

  if (!selectedModule || !selectedLevel) {
    return (
      <ModuleSelector 
        userName={userName} 
        completedModules={completedModules}
        onSelect={(mod, level) => {
          setSelectedModule(mod);
          setSelectedLevel(level);
        }} 
      />
    );
  }

  if (isModuleFinished) {
    return (
      <ResultsScreen 
        userName={userName}
        score={score} 
        totalTime={elapsedTime} 
        onRestart={resetGame} 
        onHome={handleBackToModules}
      />
    );
  }

  return (
    <div 
      className={`app-container ${isDragging ? 'is-dragging' : ''}`} 
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GameBackground isBonusActive={isBonusActive} />

      <GameHeader 
        userName={userName}
        moduleTitle={getModuleTitle()}
        currentLessonIdx={currentLessonIdx}
        totalLessons={totalLessons}
        elapsedTime={elapsedTime}
        score={score}
        onBack={handleBackToModules}
      />

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
        
        <LessonDisplay currentLesson={currentLesson} />

        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
             {isBonusActive ? (
               <motion.div 
                 animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3b82f6', fontWeight: 900, fontSize: '0.9rem' }}
               >
                 <Zap size={18} fill="#3b82f6" />
                 <span>{t('bonusActive')}</span>
                 <span style={{ backgroundColor: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '10px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>{lessonTimer}s</span>
               </motion.div>
             ) : (
               <span style={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '0.9rem' }}>{t('timesUp')}</span>
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
                  {t('clear')}
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
                {t(successMessage)}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Trophy size={20} color={lastPointsEarned === 2 ? '#3b82f6' : '#10b981'} />
                <span style={{ fontWeight: '900', fontSize: '1.5rem', color: '#1f2937' }}>+{lastPointsEarned}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Tray 
        blocks={blocks} 
        handleDrop={handleDrop} 
        containerRef={containerRef} 
        hintBlockId={hintBlockId}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    </div>
  );
}

export default App;
