import React from 'react';
import styles from './HelpButton.module.css';

interface HelpButtonProps {
  onClick: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.helpButton} onClick={onClick}>
      <span className={styles.helpIcon}>?</span>
    </button>
  );
}; 