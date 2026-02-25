import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { audio } from '../utils/audio';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language.startsWith('km') ? 'en' : 'km';
    audio.play('switch');
    i18n.changeLanguage(nextLng);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '1.5rem',
        border: '2px solid #e2e8f0',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#4b5563',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        zIndex: 100,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <motion.div
        animate={{ rotate: i18n.language.startsWith('km') ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <Globe size={18} color="#3b82f6" />
      </motion.div>
      <span style={{ minWidth: '24px' }}>{i18n.language.startsWith('km') ? 'EN' : 'KM'}</span>
    </motion.button>
  );
};
