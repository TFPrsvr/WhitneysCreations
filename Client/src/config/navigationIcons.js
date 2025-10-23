// Navigation Icons Configuration
// Update this file as you add more professional icons from The Noun Project

export const navigationIcons = {
  // Main Navigation Icons
  home: {
    emoji: '🏠',
    professional: {
      iconPath: '/images/noun-home-8126094.svg?v=1',
      iconName: 'Home',
      creator: 'Fitrapratama',
      isNounProject: true
    }
  },

  products: {
    emoji: '🛍️',
    professional: {
      iconPath: '/images/noun-tshirt-7743963.svg?v=9',
      iconName: 'Tshirt',
      creator: 'Anggara Putra',
      isNounProject: true
    }
  },

  studio: {
    emoji: '🎭',
    professional: {
      iconPath: '/images/noun-scissors-24853.svg?v=9',
      iconName: 'Scissors',
      creator: 'André Luiz',
      isNounProject: true
    }
  },

  mockup: {
    emoji: '📸',
    professional: {
      iconPath: '/images/noun-mockup-eklip-studio.svg?v=1',
      iconName: 'Mockup',
      creator: 'Eklip Studio',
      isNounProject: true
    }
  },

  suggestions: {
    emoji: '💡',
    professional: {
      iconPath: '/images/noun-suggestion-6441018.svg',
      iconName: 'Suggestion',
      creator: 'SAM Designs',
      isNounProject: true
    }
  },

  projects: {
    emoji: '📁',
    professional: {
      iconPath: '/images/noun-work-project-folder-3020191.svg?v=1',
      iconName: 'Work Project Folder',
      creator: 'IconforYou',
      isNounProject: true
    }
  },

  admin: {
    emoji: '⚙️',
    professional: {
      iconPath: '/images/noun-setting-2550045.svg',
      iconName: 'Setting',
      creator: 'Flatart',
      isNounProject: true
    }
  },

  about: {
    emoji: 'ℹ️',
    professional: {
      iconPath: '/images/noun-about-7459487.svg',
      iconName: 'About',
      creator: 'Ashok',
      isNounProject: true
    }
  },

  contact: {
    emoji: '📞',
    professional: {
      iconPath: '/images/noun-contact-7380825.svg',
      iconName: 'Contact',
      creator: 'Giorgi',
      isNounProject: true
    }
  },

  // Quick Action Icons
  cart: {
    emoji: '🛒',
    professional: {
      iconPath: '/images/noun-cart-4632422.svg?v=5',
      iconName: 'Cart',
      creator: 'PEBIAN',
      isNounProject: true
    }
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
    emoji: '📦',
    professional: {
      iconPath: '/images/noun-orders-list-6478417.svg?v=2',
      iconName: 'Orders List',
      creator: 'Noun Project',
      isNounProject: true
    }
  },

  settings: {
    emoji: '⚙️',
    professional: {
      iconPath: '/images/noun-setting-2550045.svg',
      iconName: 'Setting',
      creator: 'Flatart',
      isNounProject: true
    }
  },

  // Share Icon
  share: {
    emoji: '📤',
    professional: {
      iconPath: '/images/noun-share-7649014.svg',
      iconName: 'Share',
      creator: 'Feri Saputra',
      isNounProject: true
    }
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