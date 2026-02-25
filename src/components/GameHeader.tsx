import React from 'react';
import { ArrowLeft, User, Star, Timer, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GameHeaderProps {
  userName: string;
  moduleTitle: string;
  currentLessonIdx: number;
  totalLessons: number;
  elapsedTime: number;
  score: number;
  onBack: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  userName, 
  moduleTitle,
  currentLessonIdx, 
  totalLessons,
  elapsedTime, 
  score, 
  onBack 
}) => {
  const { t } = useTranslation();

  return (
    <header style={{ 
      padding: '0.5rem 0.75rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: '#ffffff', 
      borderBottom: '2px solid #d1d5db',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      gap: '0.75rem',
      position: 'relative',
      zIndex: 10,
      minHeight: '50px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', padding: '4px' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1f2937', whiteSpace: 'nowrap' }}>{moduleTitle}</h1>
        </div>
        <div style={{ height: '20px', width: '1px', backgroundColor: '#e5e7eb' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4b5563', fontWeight: 'bold' }}>
          <User size={16} />
          <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{currentLessonIdx + 1}/{totalLessons}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#4b5563' }}>
          <Timer size={16} color="#3b82f6" />
          <span>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
        </div>
        <div style={{ height: '20px', width: '1px', backgroundColor: '#e5e7eb' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1f2937' }}>
          <Trophy size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase' }}>{t('score')}:</span>
          <span>{score}</span>
        </div>
      </div>
    </header>
  );
};
