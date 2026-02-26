import { useState, useEffect, useCallback } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { ModuleSelector } from './components/ModuleSelector';
import type { ModuleType } from './components/ModuleSelector';
import type { LevelType } from './data/lessons';
import { GameContainer } from './components/GameContainer';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelType | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

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

  return (
    <GameContainer
      userName={userName}
      selectedModule={selectedModule}
      selectedLevel={selectedLevel}
      onBack={handleBackToModules}
      onModuleComplete={handleModuleComplete}
    />
  );
}

export default App;
