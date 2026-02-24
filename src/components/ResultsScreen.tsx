import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Clock, Star } from 'lucide-react';
import { SPRING_BOUNCY } from '../constants/animations';

interface ResultsScreenProps {
  score: number;
  totalTime: number;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalTime, onRestart }) => {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={SPRING_BOUNCY}
        style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          maxWidth: '500px',
          width: '100%',
          border: '8px solid #fef3c7'
        }}
      >
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Trophy size={100} color="#f59e0b" style={{ margin: '0 auto' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              position: 'absolute',
              top: -10,
              right: '25%',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            COMPLETE!
          </motion.div>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem' }}>
          WordSnap Hero!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          You've mastered the first module!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid #dbeafe' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
              <Star size={20} fill="#3b82f6" />
              <span style={{ fontWeight: 'bold' }}>SCORE</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e40af' }}>{score}</div>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid #dcfce7' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#16a34a', marginBottom: '0.5rem' }}>
              <Clock size={20} />
              <span style={{ fontWeight: 'bold' }}>TIME</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#166534' }}>
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
