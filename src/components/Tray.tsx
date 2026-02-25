import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Block } from './Block';
import type { BlockType } from './Block';

interface TrayProps {
  blocks: BlockType[];
  handleDrop: (id: string, x: number, y: number) => boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  hintBlockId?: string | null;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const Tray: React.FC<TrayProps> = ({ blocks, handleDrop, containerRef, hintBlockId, onDragStart, onDragEnd }) => {
  return (
    <div
      className="tray-container"
      style={{
        position: 'relative',
        minHeight: '180px',
        maxHeight: '40vh',
        backgroundColor: '#ffffff',
        borderTop: '2px solid #d1d5db',
        padding: '1rem',
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
        zIndex: 1000,
      }}
    >
      <div className="tray-grid" style={{
        display: 'grid',
        justifyContent: 'center',
        margin: '0 auto',
        maxWidth: 'fit-content'
      }}>
        {Array.from({ length: 15 }).map((_, i) => {
          const block = blocks.find(b => b.trayIndex === i);
          return (
            <div 
              key={i} 
              className="tray-slot"
              style={{ 
                borderRadius: 12, 
                backgroundColor: '#f9fafb',
                border: '2px dashed #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <AnimatePresence>
                {block && !block.isPlaced && (
                  <motion.div
                    key={block.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }} // Stay large and fade out
                    transition={{ duration: 0.2 }}
                    style={{ position: 'absolute' }}
                  >
                    <Block
                      block={block}
                      onDrop={handleDrop}
                      containerRef={containerRef}
                      isHinted={block.id === hintBlockId}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
