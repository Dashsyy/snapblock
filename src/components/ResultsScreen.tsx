import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Clock, Star } from 'lucide-react';
import { SPRING_BOUNCY } from '../constants/animations';

interface ResultsScreenProps {
  userName: string;
  score: number;
  totalTime: number;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ userName, score, totalTime, onRestart }) => {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  // Calculate Performance
  // Max score is 20 (10 lessons * 2 points each)
  const percentage = (score / 20) * 100;
  
  let grade = { label: 'KEEP TRYING!', color: '#94a3b8', desc: 'Practice makes perfect!' };
  if (percentage === 100) {
    grade = { label: 'PERFECT 100%', color: '#3b82f6', desc: 'You are a WordSnap Master!' };
  } else if (percentage >= 80) {
    grade = { label: 'EXCELLENT!', color: '#10b981', desc: 'So close to perfection!' };
  } else if (percentage >= 50) {
    grade = { label: 'GOOD JOB!', color: '#f59e0b', desc: 'Great effort today!' };
  } else {
    grade = { label: 'NEED IMPROVEMENT', color: '#ef4444', desc: 'Let\'s try again to get faster!' };
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
      {/* Decorative Background Blobs */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '20%', left: '15%', width: 'min(300px, 80vw)', height: 'min(350px, 80vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '15%', right: '15%', width: 'min(400px, 90vw)', height: 'min(400px, 90vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={SPRING_BOUNCY}
        style={{
          backgroundColor: 'white',
          padding: '3rem',
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
            <Trophy size={80} color={grade.color} style={{ margin: '0 auto' }} />
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
              fontSize: '1rem',
              display: 'inline-block',
              marginTop: '1rem',
              boxShadow: `0 4px 0 ${grade.color}80`
            }}
          >
            {grade.label}
          </motion.div>
        </div>

        <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.25rem', lineHeight: 1.1 }}>
          Way to go, {userName}!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: '500' }}>
          {grade.desc}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '1.5rem', border: '2px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <Star size={18} fill="#64748b" />
              <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>SCORE</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b' }}>{score}</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '1.5rem', border: '2px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <Clock size={18} />
              <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>TIME</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b' }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          style={{
            width: '100%',
            padding: '1.2rem',
            borderRadius: '1.5rem',
            border: 'none',
            backgroundColor: '#1f2937',
            color: 'white',
            fontSize: '1.2rem',
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
          RETRY MODULE
        </button>
      </motion.div>
    </motion.div>
  );
};
