import { motion, useAnimationControls, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SPRING_SNAPPY } from '../constants/animations';
import { useEffect } from 'react';
import { haptic } from '../utils/haptics';
import { audio } from '../utils/audio';
import { useTranslation } from 'react-i18next';

export interface BlockType {
  id: string;
  char: string;
  color: string;
  trayIndex?: number;
  isPlaced?: boolean;
}

interface BlockProps {
  block: BlockType;
  onDrop: (blockId: string, x: number, y: number) => boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  isHinted?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const Block: React.FC<BlockProps> = ({ 
  block, 
  onDrop, 
  containerRef, 
  disabled, 
  isHinted,
  onDragStart, 
  onDragEnd 
}) => {
  const controls = useAnimationControls();
  const { i18n } = useTranslation();
  
  // Motion values for dynamic tilt
  const x = useMotionValue(0);
  const rotateValue = useTransform(x, [-100, 100], [-15, 15]);
  const smoothRotate = useSpring(rotateValue, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (!disabled) {
      controls.set("idle");
    }
  }, [controls, disabled, block.isPlaced]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'km' ? 'km-KH' : 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleDragStart = () => {
    if (disabled) return;
    controls.set("dragging");
    haptic.light();
    audio.play('pickup', 0.3);
    speak(block.char);
    onDragStart?.();
  };

  const handleDragEnd = (_event: any, info: any) => {
    if (disabled || block.isPlaced) return;
    const isPlaced = onDrop(block.id, info.point.x, info.point.y);
    onDragEnd?.();
    
    // Reset motion value
    x.set(0);
    
    if (!isPlaced) {
      haptic.error();
      audio.play('wobble_error', 0.4);
      // Force return to center of slot
      controls.start("idle");
      controls.start("wobble");
    }
  };

  const variants: Variants = {
    idle: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      x: 0,
      y: 0,
      boxShadow: "0px 4px 0px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    wobble: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 10px 15px rgba(0,0,0,0.1)",
      transition: SPRING_SNAPPY
    },
    dragging: {
      scale: 1.15,
      zIndex: 9999,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 2
      }
    },
    disabled: {
      scale: 1,
      rotate: 0,
      boxShadow: "none",
      opacity: 0.8,
      cursor: 'default',
      zIndex: 1
    }
  };

  return (
    <motion.div
      layout
      style={{
        backgroundColor: block.color,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '900',
        cursor: disabled ? 'default' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        position: 'relative',
        willChange: "transform",
        border: isHinted ? '4px solid #fbbf24' : '3px solid rgba(255,255,255,0.3)',
        rotate: disabled ? 0 : smoothRotate, // Dynamic tilt
        x, // Bind to motion value
        boxShadow: isHinted ? '0 0 15px #fbbf24' : '0px 4px 0px rgba(0,0,0,0.2)'
      }}
      animate={disabled ? "disabled" : controls}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "hover"}
      drag={!disabled}
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      variants={variants}
      whileDrag={{ 
        zIndex: 10000,
        cursor: 'grabbing'
      }} 
      className={`letter-block ${isHinted ? 'hinted' : ''}`}
    >
      {isHinted && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 16,
            border: '4px solid #fbbf24',
            pointerEvents: 'none'
          }}
        />
      )}
      <span style={{ zIndex: 2 }}>{block.char}</span>
      <div
        className="block-stud"
        style={{
          position: 'absolute',
          top: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: 4,
          backgroundColor: block.color,
          filter: 'brightness(1.1)',
          zIndex: 1
        }}
      />
    </motion.div>
  );
};

