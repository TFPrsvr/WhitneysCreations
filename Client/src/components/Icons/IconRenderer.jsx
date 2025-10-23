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
        // Filters for dark backgrounds (inverted with high saturation for strong contrast against blue/pink gradients)
        const darkFilterMap = {
          home: 'invert(1) sepia(1) saturate(10) hue-rotate(90deg) brightness(1.8) contrast(1.3)',      // Bright Green
          products: 'invert(1) sepia(1) saturate(12) hue-rotate(15deg) brightness(2.0) contrast(1.8)',  // Very Bright Orange
          studio: 'invert(1) sepia(1) saturate(10) hue-rotate(240deg) brightness(1.8) contrast(1.3)',   // Bright Purple
          mockup: 'invert(1) sepia(1) saturate(10) hue-rotate(180deg) brightness(1.8) contrast(1.3)',   // Bright Cyan
          suggestions: 'invert(1) sepia(1) saturate(10) hue-rotate(50deg) brightness(2.0) contrast(1.3)', // Bright Yellow
          projects: 'invert(1) sepia(1) saturate(10) hue-rotate(210deg) brightness(1.8) contrast(1.3)',  // Bright Blue
          admin: 'invert(1) sepia(1) saturate(10) hue-rotate(0deg) brightness(1.8) contrast(1.3)',      // Bright Red
          about: 'invert(1) sepia(1) saturate(10) hue-rotate(120deg) brightness(1.8) contrast(1.3)',    // Bright Emerald
          contact: 'invert(1) sepia(1) saturate(10) hue-rotate(20deg) brightness(1.8) contrast(1.3)',   // Bright Orange
          cart: 'invert(1) sepia(1) saturate(10) hue-rotate(300deg) brightness(1.8) contrast(1.3)',     // Bright Pink
          orders: 'invert(1) sepia(1) saturate(10) hue-rotate(250deg) brightness(1.8) contrast(1.3)',   // Bright Indigo
          avatar: 'invert(1) sepia(1) saturate(10) hue-rotate(160deg) brightness(1.8) contrast(1.3)'    // Bright Teal
        };
        return darkFilterMap[iconKey] || 'invert(1) brightness(1.8) contrast(1.3)';
      } else {
        // Filters for light backgrounds (outline-only, no fill)
        const lightFilterMap = {
          home: 'sepia(0.35) saturate(2.5) hue-rotate(120deg) brightness(1.8) contrast(0.5)',     // Maximum filler/boldness with green tone
          products: 'sepia(0.4) saturate(2.5) hue-rotate(15deg) brightness(1.6) contrast(0.6)',   // Strong orange color with extra boldness
          studio: 'sepia(0.08) saturate(0.8) hue-rotate(240deg) brightness(3.2) contrast(0.04)',   // Light purple outline, minimal boldness
          mockup: 'sepia(0.12) saturate(1.0) hue-rotate(320deg) brightness(2.8) contrast(0.08)', // Very light pink/rose tint
          suggestions: 'sepia(0.05) saturate(0.6) hue-rotate(50deg) brightness(3.2) contrast(0.04)', // Light yellow outline, minimal boldness
          projects: 'sepia(1.0) saturate(15.0) hue-rotate(240deg) brightness(0.35) contrast(6.0)', // Maximum indigo/purple fill with extreme boldness
          admin: 'sepia(0.08) saturate(0.8) hue-rotate(0deg) brightness(3.2) contrast(0.04)',      // Light red outline, minimal boldness
          about: 'sepia(0.08) saturate(0.8) hue-rotate(120deg) brightness(3.2) contrast(0.04)',    // Light emerald outline, minimal boldness
          contact: 'sepia(0.08) saturate(0.8) hue-rotate(20deg) brightness(3.2) contrast(0.04)',   // Light orange outline, minimal boldness
          cart: 'sepia(0.15) saturate(1.2) hue-rotate(300deg) brightness(2.8) contrast(0.05)',     // Subtle pink, minimal bold
          orders: 'sepia(0.2) saturate(1.5) hue-rotate(250deg) brightness(2.5) contrast(0.15)',   // Visible indigo but minimal bold
          avatar: 'sepia(0.15) saturate(1.2) hue-rotate(200deg) brightness(2.8) contrast(0.05)'    // Subtle teal, minimal bold
        };
        return lightFilterMap[iconKey] || 'brightness(2.5) contrast(0.2)';
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