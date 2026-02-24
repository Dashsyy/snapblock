import { motion } from 'framer-motion';
import { Type, Calculator, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { SPRING_BOUNCY } from '../constants/animations';
import { haptic } from '../utils/haptics';

export type ModuleType = 'WORD' | 'MATH' | 'VISUAL';

interface ModuleSelectorProps {
  userName: string;
  onSelect: (module: ModuleType) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ userName, onSelect }) => {
  const modules = [
    {
      id: 'WORD' as ModuleType,
      title: 'Spelling Word',
      desc: 'Master new words with fun blocks!',
      icon: <Type size={40} />,
      color: '#3b82f6',
      bg: '#eff6ff',
      accent: '#dbeafe'
    },
    {
      id: 'MATH' as ModuleType,
      title: 'Math Fun',
      desc: 'Count, add, and play with numbers!',
      icon: <Calculator size={40} />,
      color: '#10b981',
      bg: '#f0fdf4',
      accent: '#dcfce7'
    },
    {
      id: 'VISUAL' as ModuleType,
      title: 'Visual Hint',
      desc: 'Look at the picture and spell!',
      icon: <ImageIcon size={40} />,
      color: '#f59e0b',
      bg: '#fffbeb',
      accent: '#fef3c7'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: '100%',
        maxWidth: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 0',
        position: 'relative',
        overflow: 'hidden',
        background: '#f8fafc'
      }}
    >
      {/* Soulful Background Elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '40%', background: 'rgba(59, 130, 246, 0.03)', filter: 'blur(60px)' }}
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '35%', background: 'rgba(16, 185, 129, 0.03)', filter: 'blur(80px)' }}
        />
      </div>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: 'min(3rem, 5vh)', padding: '0 2rem', zIndex: 10 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_BOUNCY, delay: 0.2 }}
          style={{ marginBottom: '1rem', display: 'inline-block' }}
        >
          <span style={{ backgroundColor: '#dbeafe', color: '#3b82f6', padding: '0.5rem 1.2rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Welcome Back
          </span>
        </motion.div>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem', lineHeight: 1.1 }}>
          Hello, {userName}!
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: '#6b7280', fontWeight: 500 }}>Which academy would you like to join today?</p>
      </motion.div>

      <div 
        className="no-scrollbar scroll-snap-x"
        style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          width: '100%', 
          overflowX: 'auto',
          padding: '1rem 2rem 3rem 2rem',
          WebkitOverflowScrolling: 'touch',
          zIndex: 10
        }}
      >
        {modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            className="scroll-snap-align-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1, ...SPRING_BOUNCY }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic.success();
              onSelect(mod.id);
            }}
            style={{
              backgroundColor: 'white',
              minWidth: 'min(300px, 80vw)',
              flex: '0 0 auto',
              padding: '2.5rem 2rem',
              borderRadius: '3rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
              border: `1px solid rgba(0,0,0,0.05)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Inner card accent */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${mod.accent}, transparent 70%)`, opacity: 0.5 }} />
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              style={{ 
                padding: '1.75rem', 
                backgroundColor: mod.bg, 
                color: mod.color, 
                borderRadius: '2.5rem', 
                marginBottom: '2rem',
                boxShadow: `0 10px 20px ${mod.color}20`
              }}
            >
              {mod.icon}
            </motion.div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.75rem' }}>{mod.title}</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: 1.5, fontSize: '1rem' }}>{mod.desc}</p>
            
            <motion.div 
              whileHover={{ x: 5 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                color: 'white', 
                fontWeight: 'bold',
                backgroundColor: mod.color,
                padding: '0.8rem 2rem',
                borderRadius: '1.5rem',
                boxShadow: `0 8px 15px ${mod.color}40`
              }}
            >
              Play <ArrowRight size={20} />
            </motion.div>
          </motion.div>
        ))}
        {/* Spacer for end scroll padding */}
        <div style={{ minWidth: '1px', flex: '0 0 auto' }} />
      </div>

      {/* Pagination indicators */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', zIndex: 10 }}>
        {modules.map((_, i) => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
        ))}
      </div>
    </motion.div>
  );
};
