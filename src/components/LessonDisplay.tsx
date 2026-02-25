import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LessonDisplayProps {
  currentLesson: any;
}

export const LessonDisplay: React.FC<LessonDisplayProps> = ({ currentLesson }) => {
  const { i18n } = useTranslation();

  const speak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentLesson?.target) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentLesson.target);
    utterance.lang = i18n.language === 'km' ? 'km-KH' : 'en-US';
    utterance.rate = 0.8; // Slightly slower for kids
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AnimatePresence mode="wait">
      {currentLesson && (
        <motion.div
          key={currentLesson.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          style={{ marginBottom: 'min(1.5rem, 3vh)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ position: 'relative' }}>
            {currentLesson.icon && (
              <div style={{ 
                padding: 'min(2rem, 4vh)', 
                backgroundColor: 'white', 
                borderRadius: '3rem', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.05)', 
                marginBottom: 'min(1.5rem, 3vh)', 
                color: '#3b82f6' 
              }}>
                {currentLesson.icon}
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={speak}
              style={{
                position: 'absolute',
                bottom: currentLesson.icon ? 10 : -10,
                right: -10,
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
                zIndex: 10
              }}
            >
              <Volume2 size={24} />
            </motion.button>
          </div>

          {currentLesson.displayHint && (
            <div style={{ 
              fontSize: 'min(5rem, 10vh, 12vw)', 
              fontWeight: 900, 
              color: '#1f2937', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: 'white',
              padding: 'min(1.5rem, 3vh) min(3rem, 6vw)',
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
  );
};
