import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Calculator, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { SPRING_BOUNCY } from '../constants/animations';
import { haptic } from '../utils/haptics';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export type ModuleType = 'WORD' | 'MATH' | 'VISUAL';

interface ModuleSelectorProps {
  userName: string;
  onSelect: (module: ModuleType) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ userName, onSelect }) => {
  const { t, i18n } = useTranslation();
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
    }
  ];

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

      {/* Soulful Background Elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '40%', background: 'rgba(59, 130, 246, 0.03)', filter: 'blur(60px)' }}
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '35%', background: 'rgba(16, 185, 129, 0.03)', filter: 'blur(80px)' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={i18n.language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
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
                onClick={() => {
                  haptic.success();
                  onSelect(mod.id);
                }}
                style={{
                  backgroundColor: 'white',
                  minWidth: 'min(280px, 80vw)',
                  flex: '0 0 auto',
                  padding: 'clamp(1.5rem, 5vh, 2.5rem) 1.5rem',
                  borderRadius: '2.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                  border: `1px solid rgba(0,0,0,0.05)`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Inner card accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${mod.accent}, transparent 70%)`, opacity: 0.5 }} />
                
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  style={{ 
                    padding: 'clamp(1rem, 3vh, 1.75rem)', 
                    backgroundColor: mod.bg, 
                    color: mod.color, 
                    borderRadius: '2rem', 
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
                    borderRadius: '1.25rem',
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

          <div style={{ display: 'flex', gap: '0.5rem', zIndex: 10, paddingBottom: '1rem' }}>
            {modules.map((_, i) => (
              <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
