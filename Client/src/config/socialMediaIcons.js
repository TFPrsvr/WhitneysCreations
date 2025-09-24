// Social Media Icons Configuration for The Noun Project icons
// Add new professional icons here as you download them from The Noun Project

export const socialMediaIcons = {
  // Social Platforms
  facebook: {
    emoji: '📘',
    professional: null, // Add: noun-facebook-[number].svg when available
    name: 'Facebook',
    color: '#1877f2'
  },

  twitter: {
    emoji: '🐦',
    professional: null, // Add: noun-twitter-[number].svg when available
    name: 'Twitter/X',
    color: '#1da1f2'
  },

  linkedin: {
    emoji: '💼',
    professional: null, // Add: noun-linkedin-[number].svg when available
    name: 'LinkedIn',
    color: '#0077b5'
  },

  whatsapp: {
    emoji: '💬',
    professional: null, // Add: noun-whatsapp-[number].svg when available
    name: 'WhatsApp',
    color: '#25d366'
  },

  pinterest: {
    emoji: '📌',
    professional: null, // Add: noun-pinterest-[number].svg when available
    name: 'Pinterest',
    color: '#bd081c'
  },

  reddit: {
    emoji: '🔗',
    professional: null, // Add: noun-reddit-[number].svg when available
    name: 'Reddit',
    color: '#ff4500'
  },

  telegram: {
    emoji: '✈️',
    professional: null, // Add: noun-telegram-[number].svg when available
    name: 'Telegram',
    color: '#0088cc'
  },

  // Communication
  email: {
    emoji: '📧',
    professional: null, // Add: noun-email-[number].svg when available
    name: 'Email',
    color: '#ea4335'
  },

  sms: {
    emoji: '💬',
    professional: null, // Add: noun-sms-[number].svg when available
    name: 'SMS/Text',
    color: '#34a853'
  },

  // Actions
  share: {
    emoji: '📤',
    professional: null, // Add: noun-share-[number].svg when available
    name: 'Share',
    color: '#6366f1'
  },

  link: {
    emoji: '🔗',
    professional: null, // Add: noun-link-[number].svg when available
    name: 'Copy Link',
    color: '#6b7280'
  },

  bookmark: {
    emoji: '⭐',
    professional: null, // Add: noun-bookmark-[number].svg when available
    name: 'Bookmark',
    color: '#fbbc05'
  },

  download: {
    emoji: '📄',
    professional: null, // Add: noun-download-[number].svg when available
    name: 'Download',
    color: '#ea4335'
  },

  print: {
    emoji: '🖨️',
    professional: null, // Add: noun-print-[number].svg when available
    name: 'Print',
    color: '#4b5563'
  }
};

// Helper function to get the appropriate social media icon
export const getSocialIcon = (iconKey, preferProfessional = true) => {
  const iconConfig = socialMediaIcons[iconKey];

  if (!iconConfig) {
    return { type: 'emoji', icon: '❓', name: 'Unknown', color: '#6b7280' };
  }

  if (preferProfessional && iconConfig.professional) {
    return {
      type: 'professional',
      ...iconConfig.professional,
      name: iconConfig.name,
      color: iconConfig.color
    };
  }

  return {
    type: 'emoji',
    icon: iconConfig.emoji,
    name: iconConfig.name,
    color: iconConfig.color
  };
};

// Get all professional social media icons for attribution
export const getAllProfessionalSocialIcons = () => {
  const professionalIcons = [];

  Object.entries(socialMediaIcons).forEach(([key, config]) => {
    if (config.professional) {
      professionalIcons.push({
        key,
        ...config.professional,
        name: config.name
      });
    }
  });

  return professionalIcons;
};

// Example of how to add professional icons:
/*
When you download icons from The Noun Project, update them like this:

facebook: {
  emoji: '📘',
  professional: {
    iconPath: '/images/noun-facebook-123456.svg',
    iconName: 'Facebook',
    creator: 'Creator Name',
    isNounProject: true
  },
  name: 'Facebook',
  color: '#1877f2'
},

Then the system will automatically:
- Use the professional icon everywhere
- Add proper attribution to the footer
- Apply correct styling and colors
*/