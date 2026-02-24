import { motion } from 'framer-motion';
import { SPRING_SNAPPY } from '../constants/animations';

interface SlotProps {
  char: string;
  isFilled: boolean;
  onMount: (index: number, element: HTMLDivElement | null) => void;
  index: number;
}

const Slot: React.FC<SlotProps> = ({ char, isFilled, onMount, index }) => {
  return (
    <div
      ref={(el) => onMount(index, el)}
      className="target-slot"
      style={{
        borderRadius: 12,
        backgroundColor: isFilled ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
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
      {!isFilled && <span className="slot-placeholder">{char}</span>}
      {isFilled && (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={SPRING_SNAPPY}
          className="filled-block"
          style={{
            borderRadius: 10,
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '900',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {char}
        </motion.div>
      )}
    </div>
  );
};

interface TargetZoneProps {
  targetWord: string;
  filledSlots: boolean[];
  onSlotMount: (index: number, element: HTMLDivElement | null) => void;
}

export const TargetZone: React.FC<TargetZoneProps> = ({ targetWord, filledSlots, onSlotMount }) => {
  if (!targetWord) return null;

  return (
    <div
      className="target-zone"
      style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '1.5rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        maxWidth: '95vw',
        flexWrap: 'wrap'
      }}
    >
      {targetWord.split('').map((char, i) => (
        <Slot
          key={`${targetWord}-${i}`}
          index={i}
          char={char}
          isFilled={filledSlots[i]}
          onMount={onSlotMount}
        />
      ))}
    </div>
  );
};
