// Utility Icons Configuration - Icons that don't require attribution
// These are typically simple geometric shapes, symbols, or public domain icons

export const utilityIcons = {
  // Navigation & UI Controls
  'angle-left': {
    iconPath: '/images/angle-left.svg',
    name: 'Previous',
    category: 'navigation',
    description: 'Left arrow for previous/back actions'
  },

  'angle-right': {
    iconPath: '/images/angle-right.svg',
    name: 'Next',
    category: 'navigation',
    description: 'Right arrow for next/forward actions'
  },

  'search': {
    iconPath: '/images/search.svg',
    name: 'Search',
    category: 'actions',
    description: 'Magnifying glass for search functionality'
  },

  'plus': {
    iconPath: '/images/plus.svg',
    name: 'Add',
    category: 'actions',
    description: 'Plus symbol for add/create actions'
  },

  // Actions & Functions
  'download': {
    iconPath: '/images/download.svg',
    name: 'Download',
    category: 'actions',
    description: 'Download arrow for file downloads'
  },

  'trash': {
    iconPath: '/images/trash.svg',
    name: 'Delete',
    category: 'actions',
    description: 'Trash can for delete/remove actions'
  },

  'paper-plane': {
    iconPath: '/images/paper-plane.svg',
    name: 'Send',
    category: 'actions',
    description: 'Paper plane for send/submit actions'
  },

  // Notifications & Alerts
  'bell': {
    iconPath: '/images/bell.svg',
    name: 'Notification',
    category: 'notifications',
    description: 'Bell for notification alerts'
  },

  'bell-ring': {
    iconPath: '/images/bell-ring.svg',
    name: 'Active Notification',
    category: 'notifications',
    description: 'Ringing bell for active notifications'
  },

  // Business & Commerce
  'dollar': {
    iconPath: '/images/dollar.svg',
    name: 'Price',
    category: 'commerce',
    description: 'Dollar symbol for pricing/money'
  },

  // Ideas & Innovation
  'bulb': {
    iconPath: '/images/bulb.svg',
    name: 'Idea',
    category: 'concepts',
    description: 'Light bulb for ideas/innovation'
  }
};

// Helper function to get utility icon
export const getUtilityIcon = (iconKey) => {
  const iconConfig = utilityIcons[iconKey];

  if (!iconConfig) {
    return null;
  }

  return {
    type: 'utility',
    iconPath: iconConfig.iconPath,
    name: iconConfig.name,
    category: iconConfig.category,
    description: iconConfig.description,
    requiresAttribution: false
  };
};

// Get icons by category
export const getUtilityIconsByCategory = (category) => {
  return Object.entries(utilityIcons)
    .filter(([key, config]) => config.category === category)
    .reduce((acc, [key, config]) => {
      acc[key] = config;
      return acc;
    }, {});
};

// Get all available categories
export const getUtilityCategories = () => {
  const categories = [...new Set(Object.values(utilityIcons).map(icon => icon.category))];
  return categories.sort();
};

// Usage examples for future implementation:
/*
// For pricing displays
<UtilityIconRenderer iconKey="dollar" size="1rem" />

// For search bars
<UtilityIconRenderer iconKey="search" size="1.2rem" />

// For pagination controls
<UtilityIconRenderer iconKey="angle-left" size="1rem" />
<UtilityIconRenderer iconKey="angle-right" size="1rem" />

// For action buttons
<UtilityIconRenderer iconKey="plus" size="1.5rem" /> Add New
<UtilityIconRenderer iconKey="download" size="1.2rem" /> Download
<UtilityIconRenderer iconKey="trash" size="1rem" /> Delete

// For notifications
<UtilityIconRenderer iconKey="bell" size="1.3rem" />
<UtilityIconRenderer iconKey="bell-ring" size="1.3rem" />

// For forms and messaging
<UtilityIconRenderer iconKey="paper-plane" size="1.2rem" /> Send
*/