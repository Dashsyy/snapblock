import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { SPRING_BOUNCY } from '../constants/animations';

interface IntroScreenProps {
  onStart: (name: string) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
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
      {/* Background elements reused from App/Results */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '15%', left: '10%', width: 'min(350px, 80vw)', height: 'min(350px, 80vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '10%', right: '15%', width: 'min(450px, 90vw)', height: 'min(450px, 90vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={SPRING_BOUNCY}
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
          WordSnap Academy
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          Ready to become a spelling hero?
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
              WHAT'S YOUR NAME?
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
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
            START LEARNING
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
