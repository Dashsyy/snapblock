import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Calculator, Image as ImageIcon, ArrowRight, ArrowLeft, Trophy, Star, ShieldCheck, Cpu, CheckCircle2, Search } from 'lucide-react';
import { SPRING_BOUNCY } from '../constants/animations';
import { haptic } from '../utils/haptics';
import { audio } from '../utils/audio';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { LevelType } from '../data/lessons';

export type ModuleType = 'WORD' | 'MATH' | 'VISUAL' | 'ELECTRONICS' | 'SEARCH';

interface ModuleSelectorProps {
  userName: string;
  completedModules: string[];
  onSelect: (module: ModuleType, level: LevelType) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ userName, completedModules, onSelect }) => {
  const { t } = useTranslation();
  const [tempModule, setTempModule] = useState<ModuleType | null>(null);
  const iconSize = 'clamp(24px, 5vh, 40px)';

  const modules = [
    {
      id: 'WORD' as ModuleType,
      title: t('modules.WORD'),
      desc: t('moduleDesc.WORD'),
      icon: <Type size={iconSize} />,
      color: '#3b82f6',
      bg: '#eff6ff',
      accent: '#dbeafe'
    },
    {
      id: 'SEARCH' as ModuleType,
      title: t('modules.SEARCH') || 'Word Search',
      desc: t('moduleDesc.SEARCH') || 'Find the hidden words!',
      icon: <Search size={iconSize} />,
      color: '#ec4899',
      bg: '#fdf2f8',
      accent: '#fce7f3'
    },
    {
      id: 'MATH' as ModuleType,
      title: t('modules.MATH'),
      desc: t('moduleDesc.MATH'),
      icon: <Calculator size={iconSize} />,
      color: '#10b981',
      bg: '#f0fdf4',
      accent: '#dcfce7'
    },
    {
      id: 'VISUAL' as ModuleType,
      title: t('modules.VISUAL'),
      desc: t('moduleDesc.VISUAL'),
      icon: <ImageIcon size={iconSize} />,
      color: '#f59e0b',
      bg: '#fffbeb',
      accent: '#fef3c7'
    },
    {
      id: 'ELECTRONICS' as ModuleType,
      title: t('modules.ELECTRONICS'),
      desc: t('moduleDesc.ELECTRONICS'),
      icon: <Cpu size={iconSize} />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      accent: '#ede9fe'
    }
  ];

  const levels: { id: LevelType; icon: React.ReactNode; color: string; bg: string }[] = [
    { id: 1, icon: <Star size={iconSize} />, color: '#3b82f6', bg: '#eff6ff' },
    { id: 2, icon: <Trophy size={iconSize} />, color: '#10b981', bg: '#f0fdf4' },
    { id: 3, icon: <ShieldCheck size={iconSize} />, color: '#f59e0b', bg: '#fffbeb' },
  ];

  const handleModuleSelect = (modId: ModuleType) => {
    haptic.success();
    audio.play('select');
    setTempModule(modId);
  };

  const handleLevelSelect = (level: LevelType) => {
    if (tempModule) {
      haptic.success();
      audio.play('select');
      onSelect(tempModule, level);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: '100%',
        maxWidth: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 0',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        background: '#f8fafc'
      }}
    >
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
        <LanguageSwitcher />
      </div>

      {tempModule && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            audio.play('switch');
            setTempModule(null);
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 100,
            background: 'white',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 'bold',
            color: '#4b5563',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </motion.button>
      )}

      {/* Optimized Background Elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          animate={{
            rotate: [0, 90, 0],
            x: [0, 20, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ 
            position: 'absolute', 
            top: '-10%', 
            left: '-10%', 
            width: '40vw', 
            height: '40vw', 
            borderRadius: '40%', 
            background: 'rgba(59, 130, 246, 0.03)', 
            filter: 'blur(40px)',
            willChange: 'transform'
          }}
        />
        <motion.div
          animate={{
            rotate: [0, -90, 0],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ 
            position: 'absolute', 
            bottom: '-10%', 
            right: '-10%', 
            width: '50vw', 
            height: '50vw', 
            borderRadius: '35%', 
            background: 'rgba(16, 185, 129, 0.03)', 
            filter: 'blur(50px)',
            willChange: 'transform'
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!tempModule ? (
          <motion.div
            key="module-selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 'fit-content' }}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vh, 3rem)', padding: '0 2rem', zIndex: 10 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...SPRING_BOUNCY, delay: 0.2 }}
                style={{ marginBottom: '0.75rem', display: 'inline-block' }}
              >
                <span style={{ backgroundColor: '#dbeafe', color: '#3b82f6', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {t('welcome')}
                </span>
              </motion.div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                {t('hello', { name: userName })}
              </h1>
              <p style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', color: '#6b7280', fontWeight: 500 }}>{t('selectModule')}</p>
            </motion.div>

            <div
              className="no-scrollbar scroll-snap-x"
              style={{
                display: 'flex',
                gap: '1.25rem',
                width: '100%',
                overflowX: 'auto',
                padding: '1rem 2rem 2rem 2rem',
                WebkitOverflowScrolling: 'touch',
                zIndex: 10
              }}
            >
              {modules.map((mod, i) => (
                <motion.div
                  key={mod.id}
                  className="scroll-snap-align-center"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, ...SPRING_BOUNCY }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleModuleSelect(mod.id)}
                  style={{
                    backgroundColor: 'white',
                    minWidth: 'min(280px, 80vw)',
                    flex: '0 0 auto',
                    padding: 'clamp(1.5rem, 5vh, 2.5rem) 1.5rem',
                    borderRadius: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                    border: `1px solid rgba(0,0,0,0.05)`,
                    position: 'relative',
                    overflow: 'hidden',
                    willChange: 'transform'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${mod.accent}, transparent 70%)`, opacity: 0.5 }} />

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    style={{
                      padding: 'clamp(1rem, 3vh, 1.75rem)',
                      backgroundColor: mod.bg,
                      color: mod.color,
                      borderRadius: '1.25rem',
                      marginBottom: 'clamp(1rem, 3vh, 2rem)',
                      boxShadow: `0 10px 20px ${mod.color}20`
                    }}
                  >
                    {mod.icon}
                  </motion.div>

                  <h2 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem' }}>{mod.title}</h2>
                  <p style={{ color: '#6b7280', marginBottom: 'clamp(1.5rem, 4vh, 2rem)', lineHeight: 1.4, fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}>{mod.desc}</p>

                  <motion.div
                    whileHover={{ x: 5 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'white',
                      fontWeight: 'bold',
                      backgroundColor: mod.color,
                      padding: 'clamp(0.6rem, 2vh, 0.8rem) clamp(1.5rem, 4vw, 2rem)',
                      borderRadius: '1rem',
                      boxShadow: `0 8px 15px ${mod.color}40`,
                      marginTop: 'auto'
                    }}
                  >
                    {t('play')} <ArrowRight size={18} />
                  </motion.div>
                </motion.div>
              ))}
              <div style={{ minWidth: '1px', flex: '0 0 auto' }} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="level-selection"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 'fit-content' }}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vh, 3rem)', padding: '0 2rem', zIndex: 10 }}
            >
              <h1 style={{ fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                {t('selectLevel')}
              </h1>
              <p style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', color: '#6b7280', fontWeight: 500 }}>
                {modules.find(m => m.id === tempModule)?.title}
              </p>
            </motion.div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                width: '100%',
                padding: '1rem 2rem 2rem 2rem',
                zIndex: 10,
                maxWidth: '500px'
              }}
            >
              {levels.map((level, i) => {
                const isCompleted = completedModules.includes(`${tempModule}-${level.id}`);
                return (
                  <motion.div
                    key={level.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.1, ...SPRING_BOUNCY }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLevelSelect(level.id)}
                    style={{
                      backgroundColor: 'white',
                      padding: '1.25rem',
                      borderRadius: '1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
                      border: isCompleted ? `2px solid ${level.color}40` : `1px solid rgba(0,0,0,0.05)`,
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      padding: '1rem',
                      backgroundColor: level.bg,
                      color: level.color,
                      borderRadius: '1rem',
                    }}>
                      {level.icon}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.25rem' }}>
                        {t(`levels.${level.id}`)}
                      </h2>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>
                        {t(`levelDesc.${level.id}`)}
                      </p>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 size={24} color={level.color} style={{ marginLeft: 'auto' }} />
                    ) : (
                      <ArrowRight size={24} style={{ marginLeft: 'auto', color: '#d1d5db' }} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '0.5rem', zIndex: 10, paddingBottom: '1rem' }}>
        {modules.map((_, i) => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
        ))}
      </div>
    </motion.div>
  );
};
