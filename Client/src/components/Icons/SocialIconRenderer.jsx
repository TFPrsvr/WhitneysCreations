import React from 'react';
import NounProjectIcon from './NounProjectIcon';
import { getSocialIcon } from '../../config/socialMediaIcons';

const SocialIconRenderer = ({
  iconKey,
  size = '1.5rem',
  className = '',
  style = {},
  preferProfessional = true,
  showBackground = false,
  onClick,
  ...props
}) => {
  const iconConfig = getSocialIcon(iconKey, preferProfessional);

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    ...style
  };

  if (showBackground) {
    containerStyle.backgroundColor = `${iconConfig.color}15`;
    containerStyle.borderRadius = '8px';
    containerStyle.padding = '8px';
    containerStyle.border = `1px solid ${iconConfig.color}30`;
  }

  const iconElement = iconConfig.type === 'professional' ? (
    <NounProjectIcon
      iconPath={iconConfig.iconPath}
      iconName={iconConfig.iconName}
      creator={iconConfig.creator}
      size={size}
      className={className}
      style={{
        flexShrink: 0,
        filter: showBackground ? 'none' : 'none', // Professional icons keep their colors
        ...style
      }}
      {...props}
    />
  ) : (
    <span
      className={className}
      style={{
        fontSize: size,
        lineHeight: 1,
        flexShrink: 0,
        ...style
      }}
      aria-hidden="true"
      {...props}
    >
      {iconConfig.icon}
    </span>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={containerStyle}
        className="social-icon-button"
        title={iconConfig.name}
        onMouseEnter={(e) => {
          if (showBackground) {
            e.currentTarget.style.backgroundColor = `${iconConfig.color}25`;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${iconConfig.color}40`;
          }
        }}
        onMouseLeave={(e) => {
          if (showBackground) {
            e.currentTarget.style.backgroundColor = `${iconConfig.color}15`;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {iconElement}
      </button>
    );
  }

  return (
    <div style={containerStyle} title={iconConfig.name}>
      {iconElement}
    </div>
  );
};

export default SocialIconRenderer;