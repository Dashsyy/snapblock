import { Trash2 } from 'lucide-react';
import { forwardRef } from 'react';

export const TrashZone = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        border: '3px dashed #ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ef4444',
        zIndex: 10,
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.4)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}
    >
      <Trash2 size={40} />
    </div>
  );
});
