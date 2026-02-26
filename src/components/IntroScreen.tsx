import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { audio } from '../utils/audio';

interface IntroScreenProps {
  onStart: (name: string) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const { t, i18n } = useTranslation();

  const heroMessages = t('heroMessages', { returnObjects: true }) as string[];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % heroMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroMessages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      audio.unlock();
      onStart(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: '100%',
        maxWidth: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
        <LanguageSwitcher />
      </div>

      {/* Background elements optimized for mobile performance */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            position: 'absolute', 
            top: '15%', 
            left: '10%', 
            width: 'min(300px, 70vw)', 
            height: 'min(300px, 70vw)', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', 
            filter: 'blur(30px)',
            willChange: 'transform'
          }}
        />
        <motion.div 
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            position: 'absolute', 
            bottom: '10%', 
            right: '15%', 
            width: 'min(400px, 80vw)', 
            height: 'min(400px, 80vw)', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)', 
            filter: 'blur(40px)',
            willChange: 'transform'
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i18n.language}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.05, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            backgroundColor: 'white',
            padding: '2.5rem 1.5rem',
            borderRadius: '3rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            border: '4px solid #f1f5f9'
          }}
        >
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '2rem', marginBottom: '1.5rem', color: '#3b82f6' }}>
            <Sparkles size={40} />
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem', lineHeight: 1.1 }}>
            {t('introTitle')}
          </h1>
          
          <div style={{ height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0, fontWeight: 500 }}
              >
                {heroMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
                {t('whatsYourName')}
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enterName')}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  borderRadius: '1.5rem',
                  border: '2px solid #e2e8f0',
                  fontSize: '1.1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                width: '100%',
                padding: '1.2rem',
                borderRadius: '1.5rem',
                border: 'none',
                backgroundColor: name.trim() ? '#3b82f6' : '#94a3b8',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: name.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s',
                boxShadow: name.trim() ? '0 8px 0 #2563eb' : 'none'
              }}
            >
              <Play size={24} fill="currentColor" />
              {t('startLearning')}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
