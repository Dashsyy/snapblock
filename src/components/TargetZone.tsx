import { motion } from 'framer-motion';
import { SPRING_SNAPPY } from '../constants/animations';
import { X, Check } from 'lucide-react';

interface SlotProps {
  correctChar: string;
  placedChar: string | null;
  isFilled: boolean;
  onMount: (index: number, element: HTMLDivElement | null) => void;
  index: number;
  isMathMode?: boolean;
}

const Slot: React.FC<SlotProps> = ({ correctChar, placedChar, isFilled, onMount, index, isMathMode }) => {
  const isCorrect = isFilled && placedChar === correctChar;
  const isWrong = isFilled && placedChar !== correctChar;

  return (
    <div
      ref={(el) => onMount(index, el)}
      className="target-slot"
      data-index={index}
      style={{
        borderRadius: 12,
        backgroundColor: isFilled 
          ? 'transparent' 
          : 'rgba(255, 255, 255, 0.5)',
        border: `3px dashed ${isFilled ? 'transparent' : '#9ca3af'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#6b7280',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {!isFilled && !isMathMode && <span className="slot-placeholder">{correctChar}</span>}
      
      {isFilled && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_SNAPPY, duration: 0.2 }}
          className="filled-block"
          style={{
            borderRadius: 10,
            backgroundColor: isCorrect ? '#10b981' : isWrong ? '#ef4444' : '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '900',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            position: 'relative'
          }}
        >
          {placedChar}
          
          {/* Feedback Icons */}
          {isMathMode && isWrong && (
            <div style={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white', borderRadius: '50%', padding: '2px', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              <X size={16} color="#ef4444" strokeWidth={4} />
            </div>
          )}
          {isMathMode && isCorrect && (
            <div style={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white', borderRadius: '50%', padding: '2px', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              <Check size={16} color="#10b981" strokeWidth={4} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

interface TargetZoneProps {
  targetWord: string;
  placedChars: (string | null)[];
  filledSlots: boolean[];
  onSlotMount: (index: number, element: HTMLDivElement | null) => void;
  isMathMode?: boolean;
}

export const TargetZone: React.FC<TargetZoneProps> = ({ targetWord, placedChars, filledSlots, onSlotMount, isMathMode }) => {
  if (!targetWord) return null;

  return (
    <div
      className="target-zone"
      style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // More opaque instead of blur
        borderRadius: '1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        maxWidth: '95vw',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1 // Explicit low zIndex
      }}
    >
      {targetWord.split('').map((char, i) => (
        <Slot
          key={`${targetWord}-${i}`}
          index={i}
          correctChar={char}
          placedChar={placedChars[i]}
          isFilled={filledSlots[i]}
          onMount={onSlotMount}
          isMathMode={isMathMode}
        />
      ))}
    </div>
  );
};
