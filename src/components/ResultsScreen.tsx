import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Clock, Star, Home } from 'lucide-react';
import { SPRING_BOUNCY } from '../constants/animations';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { audio } from '../utils/audio';
import { LanguageSwitcher } from './LanguageSwitcher';

interface ResultsScreenProps {
  userName: string;
  score: number;
  totalTime: number;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ userName, score, totalTime, onRestart, onHome }) => {
  const { t } = useTranslation();

  useEffect(() => {
    audio.play('module_complete');
  }, []);

  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  // Calculate Performance
  const percentage = (score / 10) * 100;
  
  let grade = { label: t('keepTrying'), color: '#94a3b8', desc: t('moduleDesc.WORD') };
  if (percentage === 100) {
    grade = { label: t('perfect'), color: '#3b82f6', desc: t('introSub') };
  } else if (percentage >= 80) {
    grade = { label: t('excellent'), color: '#10b981', desc: t('introSub') };
  } else if (percentage >= 50) {
    grade = { label: t('goodJob'), color: '#f59e0b', desc: t('introSub') };
  } else {
    grade = { label: t('needImprovement'), color: '#ef4444', desc: t('introSub') };
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: '100%',
        maxWidth: '100vw',
        height: '100dvh',
        background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f1f5f9 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
        <LanguageSwitcher />
      </div>

      {/* Decorative Background Blobs - Optimized */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            position: 'absolute', 
            top: '20%', 
            left: '15%', 
            width: 'min(250px, 70vw)', 
            height: 'min(250px, 70vw)', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', 
            filter: 'blur(30px)',
            willChange: 'transform'
          }}
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            position: 'absolute', 
            bottom: '15%', 
            right: '15%', 
            width: 'min(300px, 80vw)', 
            height: 'min(300px, 80vw)', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)', 
            filter: 'blur(40px)',
            willChange: 'transform'
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={SPRING_BOUNCY}
        style={{
          backgroundColor: 'white',
          padding: 'clamp(1.5rem, 5vh, 3rem)',
          borderRadius: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          maxWidth: '500px',
          width: '100%',
          border: `8px solid ${grade.color}20`,
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Trophy size={clampSize(60, 80)} color={grade.color} style={{ margin: '0 auto' }} />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            style={{
              backgroundColor: grade.color,
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '2rem',
              fontWeight: '900',
              fontSize: '0.8rem',
              display: 'inline-block',
              marginTop: '1rem',
              boxShadow: `0 4px 0 ${grade.color}80`
            }}
          >
            {grade.label}
          </motion.div>
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.3rem)', fontWeight: 900, color: '#1f2937', marginBottom: '0.25rem', lineHeight: 1.1 }}>
          {t('hello', { name: userName })}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '500' }}>
          {grade.desc}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '1.5rem', border: '2px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <Star size={16} fill="#64748b" />
              <span style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>{t('score')}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>{score}</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '1.5rem', border: '2px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <Clock size={16} />
              <span style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>{t('time')}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => {
              audio.play('select');
              onRestart();
            }}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '1.5rem',
              border: 'none',
              backgroundColor: '#1f2937',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'transform 0.2s',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <RotateCcw size={24} />
            {t('retryModule')}
          </button>

          <button
            onClick={() => {
              audio.play('switch');
              onHome();
            }}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '1.5rem',
              border: '2px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#4b5563',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'transform 0.2s',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Home size={24} />
            {t('backToHome')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

function clampSize(min: number, max: number) {
  if (typeof window === 'undefined') return max;
  return window.innerWidth < 360 ? min : max;
}
