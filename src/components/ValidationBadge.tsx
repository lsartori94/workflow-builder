import { useState } from 'react';
import type { ValidationBadgeProps } from '../types/workflow';

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
  validation,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    if (!validation.isValid && validation.issues.length > 0) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const badgeClass = validation.isValid ? 'valid' : 'invalid';
  const icon = validation.isValid ? '✅' : '❌';
  const text = validation.isValid 
    ? 'Valid' 
    : `${validation.issues.length} issue${validation.issues.length === 1 ? '' : 's'}`;

  return (
    <div
      className={`validation-badge ${badgeClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="validation-icon">{icon}</span>
      <span className="validation-text">{text}</span>
      
      {showTooltip && !validation.isValid && (
        <div className="validation-tooltip">
          <ul>
            {validation.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
