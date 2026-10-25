import React from 'react';
import { Icon } from './Icon';
import { playClickSound, playCelebrationSound } from '../lib/audio';

interface SectionCheckButtonProps {
  completed: boolean;
  onToggle: () => void;
  soundEnabled?: boolean;
}

export const SectionCheckButton: React.FC<SectionCheckButtonProps> = ({
  completed,
  onToggle,
  soundEnabled = true,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!completed) {
      playCelebrationSound(soundEnabled);
    } else {
      playClickSound(soundEnabled);
    }
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={completed ? 'إلغاء إكمال القسم' : 'تحديد القسم كمكتمل'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.85rem',
        borderRadius: '9999px',
        fontSize: '0.85rem',
        fontWeight: 600,
        backgroundColor: completed ? '#dcfce7' : '#f1f5f9',
        color: completed ? '#15803d' : '#64748b',
        border: `1px solid ${completed ? '#86efac' : '#cbd5e1'}`,
        transition: 'all 0.15s ease',
      }}
    >
      <Icon name="check" size={16} />
      <span>{completed ? 'مكتمل' : 'حدد كمكتمل'}</span>
    </button>
  );
};
