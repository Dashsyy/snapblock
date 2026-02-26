import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroScreen } from './components/IntroScreen';
import { ModuleSelector } from './components/ModuleSelector';
import type { ModuleType } from './components/ModuleSelector';
import type { LevelType } from './data/lessons';
import { GameContainer } from './components/GameContainer';
import { audio } from './utils/audio';
import { Sparkles } from 'lucide-react';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelType | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const loadingMessages = [
    "Preparing Fun...",
    "Shuffling Blocks...",
    "Sharpening Pencils...",
    "Loading Magic...",
    "Getting Ready..."
  ];

  // Rotate loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
      }, 800) as any;
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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

  const handleStart = async (name: string) => {
    setIsLoading(true);
    setUserName(name);
    // Ensure sounds are loaded before showing the next screen
    await audio.unlock();
    // Small delay for the loading feel so they can see the messages
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setSelectedLevel(null);
  };

  const handleModuleComplete = useCallback((moduleKey: string) => {
    setCompletedModules(prev => {
      if (!prev.includes(moduleKey)) {
        return [...prev, moduleKey];
      }
      return prev;
    });
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!userName ? (
        <IntroScreen key="intro" onStart={handleStart} />
      ) : isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            width: '100%',
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            gap: '1.5rem'
          }}
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ color: '#3b82f6' }}
          >
            <Sparkles size={60} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.h2 
              key={loadingMsgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1f2937', minHeight: '2rem' }}
            >
              {loadingMessages[loadingMsgIdx]}
            </motion.h2>
          </AnimatePresence>
        </motion.div>
      ) : !selectedModule || !selectedLevel ? (
        <ModuleSelector 
          key="selector"
          userName={userName} 
          completedModules={completedModules}
          onSelect={(mod, level) => {
            setSelectedModule(mod);
            setSelectedLevel(level);
          }} 
        />
      ) : (
        <motion.div
          key="game"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ width: '100%', height: '100%' }}
        >
          <GameContainer
            userName={userName}
            selectedModule={selectedModule}
            selectedLevel={selectedLevel}
            onBack={handleBackToModules}
            onModuleComplete={handleModuleComplete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
