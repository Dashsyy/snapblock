import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameBackgroundProps {
  isBonusActive?: boolean;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ isBonusActive = true }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
      <AnimatePresence>
        {isBonusActive ? (
          <motion.div
            key="bonus-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 40%, rgba(16, 185, 129, 0.05) 80%, transparent 100%)' 
            }}
          >
            {/* Primary Pulse Glow */}
            <motion.div
              animate={{ 
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}
            />

            <motion.div 
              animate={{ 
                x: [-20, 60, -20], 
                y: [-30, 40, -30],
                scale: [1, 1.2, 1],
                backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(16, 185, 129, 0.2)', 'rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '5%', left: '5%', width: 'min(500px, 100vw)', height: 'min(500px, 100vw)', borderRadius: '50%', filter: 'blur(70px)' }}
            />
            <motion.div 
              animate={{ 
                x: [20, -60, 20], 
                y: [30, -40, 30],
                scale: [1, 1.3, 1],
                backgroundColor: ['rgba(16, 185, 129, 0.2)', 'rgba(245, 158, 11, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(16, 185, 129, 0.2)']
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', bottom: '10%', right: '5%', width: 'min(600px, 110vw)', height: 'min(600px, 110vw)', borderRadius: '50%', filter: 'blur(90px)' }}
            />
            
            {/* Rapid shimmer blobs */}
            <motion.div 
              animate={{ 
                opacity: [0, 0.3, 0],
                x: [100, -100],
                y: [100, -100]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', top: '30%', right: '20%', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', filter: 'blur(40px)' }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="normal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'absolute', inset: 0, background: 'transparent' }}
          >
            <motion.div 
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(156, 163, 175, 0.05)', filter: 'blur(40px)' }}
            />
            <motion.div 
              animate={{ x: [0, -20, 0], y: [0, 40, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', bottom: '25%', right: '15%', width: '350px', height: '350px', borderRadius: '50%', backgroundColor: 'rgba(156, 163, 175, 0.05)', filter: 'blur(50px)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
