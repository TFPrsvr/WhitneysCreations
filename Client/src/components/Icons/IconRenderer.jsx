import React from 'react';
import NounProjectIcon from './NounProjectIcon';
import { getIcon } from '../../config/navigationIcons';

const IconRenderer = ({
  iconKey,
  size = '2rem',
  className = '',
  style = {},
  preferProfessional = true,
  forDarkBackground = false,
  ...props
}) => {
  const iconConfig = getIcon(iconKey, preferProfessional);

  if (iconConfig.type === 'professional') {
    // Define color filters for different icon types
    const getIconFilter = (iconKey, forDark) => {
      if (forDark) {
        // Filters for dark backgrounds (invert and colorize)
        const darkFilterMap = {
          home: 'invert(1) sepia(1) saturate(5) hue-rotate(90deg) brightness(1.2)',      // Green
          products: 'invert(1) sepia(1) saturate(8) hue-rotate(15deg) brightness(1.6) contrast(1.5)',  // Bright Orange
          studio: 'invert(1) sepia(1) saturate(5) hue-rotate(240deg) brightness(1.2)',   // Purple
          mockup: 'invert(1) sepia(1) saturate(5) hue-rotate(180deg) brightness(1.2)',   // Cyan
          suggestions: 'invert(1) sepia(1) saturate(5) hue-rotate(50deg) brightness(1.5)', // Yellow
          projects: 'invert(1) sepia(1) saturate(5) hue-rotate(210deg) brightness(1.2)',  // Blue
          admin: 'invert(1) sepia(1) saturate(5) hue-rotate(0deg) brightness(1.2)',      // Red
          about: 'invert(1) sepia(1) saturate(5) hue-rotate(120deg) brightness(1.2)',    // Emerald
          contact: 'invert(1) sepia(1) saturate(5) hue-rotate(20deg) brightness(1.2)',   // Orange
          cart: 'invert(1) sepia(1) saturate(5) hue-rotate(300deg) brightness(1.2)',     // Pink
          orders: 'invert(1) sepia(1) saturate(5) hue-rotate(250deg) brightness(1.2)',   // Indigo
          avatar: 'invert(1) sepia(1) saturate(5) hue-rotate(160deg) brightness(1.2)'    // Teal
        };
        return darkFilterMap[iconKey] || 'invert(1) brightness(1.2)';
      } else {
        // Filters for light backgrounds (outline-only, no fill)
        const lightFilterMap = {
          home: 'sepia(0.1) saturate(1) hue-rotate(90deg) brightness(2.5) contrast(0.3)',      // Very light outline
          products: 'sepia(0.4) saturate(2) hue-rotate(15deg) brightness(2.2) contrast(0.4)',  // Light orange outline
          studio: 'sepia(0.2) saturate(1.5) hue-rotate(240deg) brightness(2.3) contrast(0.35)',   // Light purple outline
          mockup: 'sepia(0.2) saturate(1.5) hue-rotate(180deg) brightness(2.3) contrast(0.35)',   // Light cyan outline
          suggestions: 'sepia(0.1) saturate(1) hue-rotate(50deg) brightness(2.5) contrast(0.3)', // Light yellow outline
          projects: 'sepia(0.1) saturate(1) hue-rotate(210deg) brightness(2.5) contrast(0.3)',  // Light blue outline
          admin: 'sepia(0.2) saturate(1.5) hue-rotate(0deg) brightness(2.3) contrast(0.35)',      // Light red outline
          about: 'sepia(0.2) saturate(1.5) hue-rotate(120deg) brightness(2.3) contrast(0.35)',    // Light emerald outline
          contact: 'sepia(0.2) saturate(1.5) hue-rotate(20deg) brightness(2.3) contrast(0.35)',   // Light orange outline
          cart: 'sepia(0.1) saturate(1) hue-rotate(300deg) brightness(2.5) contrast(0.3)',     // Light pink outline
          orders: 'sepia(0.1) saturate(1) hue-rotate(250deg) brightness(2.5) contrast(0.3)',   // Light indigo outline
          avatar: 'sepia(0.3) saturate(2) hue-rotate(200deg) brightness(2.1) contrast(0.4)'    // Light blue/teal outline
        };
        return lightFilterMap[iconKey] || 'brightness(0.8) contrast(1.2)';
      }
    };

    return (
      <NounProjectIcon
        iconPath={iconConfig.iconPath}
        iconName={iconConfig.iconName}
        creator={iconConfig.creator}
        size={size}
        className={className}
        style={{
          filter: getIconFilter(iconKey, forDarkBackground),
          flexShrink: 0,
          ...style
        }}
        {...props}
      />
    );
  }

  // Fallback to emoji
  return (
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
};

export default IconRenderer;