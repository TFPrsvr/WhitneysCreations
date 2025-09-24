// Navigation Icons Configuration
// Update this file as you add more professional icons from The Noun Project

export const navigationIcons = {
  // Main Navigation Icons
  home: {
    emoji: '🏠',
    professional: null, // Add professional home icon here when available
  },

  products: {
    emoji: '🛍️',
    professional: {
      iconPath: '/images/noun-tshirt-7743963.svg',
      iconName: 'Tshirt',
      creator: 'Anggara Putra',
      isNounProject: true
    }
  },

  studio: {
    emoji: '🎭',
    professional: {
      iconPath: '/images/noun-scissors-24853.svg',
      iconName: 'Scissors',
      creator: 'André Luiz',
      isNounProject: true
    }
  },

  mockup: {
    emoji: '📸',
    professional: null, // Add professional camera/mockup icon here when available
  },

  suggestions: {
    emoji: '💡',
    professional: null, // Add professional lightbulb/idea icon here when available
  },

  projects: {
    emoji: '📁',
    professional: null, // Add professional folder/projects icon here when available
  },

  admin: {
    emoji: '⚙️',
    professional: null, // Add professional settings/admin icon here when available
  },

  about: {
    emoji: 'ℹ️',
    professional: null, // Add professional info/about icon here when available
  },

  contact: {
    emoji: '📞',
    professional: null, // Add professional phone/contact icon here when available
  },

  // Quick Action Icons
  cart: {
    emoji: '🛒',
    professional: null, // Add professional shopping cart icon here when available
  },

  avatar: {
    emoji: '👨‍💼',
    professional: {
      iconPath: '/images/noun-avatar-2309777.svg',
      iconName: 'Avatar',
      creator: 'Nawicon',
      isNounProject: true
    }
  },

  orders: {
    emoji: '📋',
    professional: null, // Add professional clipboard/orders icon here when available
  },

  // Logo/Brand Icons
  logo: {
    emoji: '🎨',
    professional: null, // Add professional brand logo icon here when available
  }
};

// Helper function to get the appropriate icon
export const getIcon = (iconKey, preferProfessional = true) => {
  const iconConfig = navigationIcons[iconKey];

  if (!iconConfig) {
    return { type: 'emoji', icon: '❓' }; // Default fallback
  }

  if (preferProfessional && iconConfig.professional) {
    return {
      type: 'professional',
      ...iconConfig.professional
    };
  }

  return {
    type: 'emoji',
    icon: iconConfig.emoji
  };
};

// Get all professional icons for attribution
export const getAllProfessionalIcons = () => {
  const professionalIcons = [];

  Object.entries(navigationIcons).forEach(([key, config]) => {
    if (config.professional) {
      professionalIcons.push({
        key,
        ...config.professional
      });
    }
  });

  return professionalIcons;
};

// Example of how to add more icons:
// When you upload a new professional icon, add it like this:
/*
  products: {
    emoji: '🛍️',
    professional: {
      iconPath: '/images/noun-shopping-bag-[number].svg',
      iconName: 'Shopping Bag',
      creator: '[Creator Name]',
      isNounProject: true
    }
  },
*/