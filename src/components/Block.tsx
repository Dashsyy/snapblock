import { motion, useAnimationControls, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SPRING_SNAPPY } from '../constants/animations';
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
  onDrop: (blockId: string, x: number, y: number) => boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const Block: React.FC<BlockProps> = ({ block, onDrop, containerRef, disabled, onDragStart, onDragEnd }) => {
  const controls = useAnimationControls();
  
  // Motion values for dynamic tilt
  const x = useMotionValue(0);
  const rotateValue = useTransform(x, [-100, 100], [-15, 15]);
  const smoothRotate = useSpring(rotateValue, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (!disabled) {
      controls.set("idle");
    }
  }, [controls, disabled, block.isPlaced]);

  const handleDragStart = () => {
    if (disabled) return;
    controls.set("dragging");
    haptic.light();
    onDragStart?.();
  };

  const handleDragEnd = (_event: any, info: any) => {
    if (disabled || block.isPlaced) return;
    const isPlaced = onDrop(block.id, info.point.x, info.point.y);
    onDragEnd?.();
    
    // Reset motion value
    x.set(0);
    
    // ONLY return to "idle" if it was NOT placed.
    // If it was placed, we want it to stay exactly where the user dropped it
    // while the AnimatePresence exit animation handles its disappearance.
    if (!isPlaced) {
      controls.start("idle");
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
      transition: SPRING_SNAPPY
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
        position: 'relative',
        willChange: "transform",
        border: '3px solid rgba(255,255,255,0.3)',
        rotate: disabled ? 0 : smoothRotate, // Dynamic tilt
        x // Bind to motion value
      }}
      animate={disabled ? "disabled" : controls}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "hover"}
      drag={!disabled}
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={true}
      dragTransition={{
        power: 0.2, // Increased power for better inertia feel
        timeConstant: 200
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      variants={variants}
      whileDrag={{ 
        zIndex: 10000,
        cursor: 'grabbing'
      }} 
      className="letter-block"
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
