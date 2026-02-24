import { motion, useAnimationControls } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SPRING_SNAPPY, SPRING_HEAVY } from '../constants/animations';
import { useEffect } from 'react';
import { haptic } from '../utils/haptics';

export interface BlockType {
  id: string;
  char: string;
  color: string;
  trayIndex?: number;
  isPlaced?: boolean;
}

interface BlockProps {
  block: BlockType;
  onDrop: (blockId: string, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

export const Block: React.FC<BlockProps> = ({ block, onDrop, containerRef, disabled }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!disabled) {
      controls.set("idle");
    }
  }, [controls, disabled, block.isPlaced]);

  const handleDragEnd = (_event: any, info: any) => {
    if (disabled || block.isPlaced) return;
    onDrop(block.id, info.point.x, info.point.y);
    
    // Always return to "idle" (which is its home in the tray grid)
    controls.start("idle");
  };

  const variants: Variants = {
    idle: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      x: 0,
      y: 0,
      boxShadow: "0px 4px 0px rgba(0,0,0,0.2)",
      transition: SPRING_SNAPPY
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 10px 15px rgba(0,0,0,0.1)",
      transition: SPRING_SNAPPY
    },
    dragging: {
      scale: 1.1,
      rotate: 5,
      zIndex: 999,
      transition: SPRING_HEAVY
    },
    disabled: {
      scale: 1,
      rotate: 0,
      boxShadow: "none",
      opacity: 0.8,
      cursor: 'default'
    }
  };

  return (
    <motion.div
      layout
      animate={disabled ? "disabled" : controls}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "hover"}
      drag={!disabled}
      dragConstraints={containerRef}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => {
        if (!disabled) {
          controls.set("dragging");
          haptic.light();
        }
      }}
      onDragEnd={handleDragEnd}
      variants={variants}
      whileDrag={{ zIndex: 1000 }} /* Ensure block is on top of everything during drag */
      className="letter-block"
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
        position: 'relative',
        willChange: "transform",
        border: '3px solid rgba(255,255,255,0.3)',
      }}
    >
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
