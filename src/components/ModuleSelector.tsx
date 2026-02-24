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
      desc: 'Master new words!',
      icon: <Type size={32} />,
      color: '#3b82f6',
      bg: '#eff6ff'
    },
    {
      id: 'MATH' as ModuleType,
      title: 'Math Fun',
      desc: 'Numbers & Sums!',
      icon: <Calculator size={32} />,
      color: '#10b981',
      bg: '#f0fdf4'
    },
    {
      id: 'VISUAL' as ModuleType,
      title: 'Visual Hint',
      desc: 'See & Spell!',
      icon: <ImageIcon size={32} />,
      color: '#f59e0b',
      bg: '#fffbeb'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative'
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem' }}>
          Hello, {userName}!
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>Which academy would you like to join today?</p>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        width: '100%', 
        maxWidth: '1000px' 
      }}>
        {modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, ...SPRING_BOUNCY }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => {
              haptic.success();
              onSelect(mod.id);
            }}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '2.5rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: `4px solid ${mod.bg}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: mod.bg, 
              color: mod.color, 
              borderRadius: '2rem', 
              marginBottom: '1.5rem' 
            }}>
              {mod.icon}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem' }}>{mod.title}</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{mod.desc}</p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: mod.color, 
              fontWeight: 'bold' 
            }}>
              Let's Go <ArrowRight size={18} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
