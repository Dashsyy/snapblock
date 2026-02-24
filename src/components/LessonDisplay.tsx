import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonDisplayProps {
  currentLesson: any;
}

export const LessonDisplay: React.FC<LessonDisplayProps> = ({ currentLesson }) => {
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
