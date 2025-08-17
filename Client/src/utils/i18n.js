// Simple i18n detection and placeholder system
// This is a quick win implementation to gauge international interest

const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', flag: '🇺🇸', available: true },
  'es': { name: 'Español', flag: '🇪🇸', available: false },
  'fr': { name: 'Français', flag: '🇫🇷', available: false },
  'de': { name: 'Deutsch', flag: '🇩🇪', available: false },
  'pt': { name: 'Português', flag: '🇧🇷', available: false },
  'zh': { name: '中文', flag: '🇨🇳', available: false },
  'ja': { name: '日本語', flag: '🇯🇵', available: false },
  'ar': { name: 'العربية', flag: '🇸🇦', available: false }
};

// Detect user's preferred language
export const detectUserLanguage = () => {
  // Check localStorage first
  const savedLang = localStorage.getItem('printcraft_language');
  if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
    return savedLang;
  }

  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  if (SUPPORTED_LANGUAGES[langCode]) {
    return langCode;
  }

  // Default to English
  return 'en';
};

// Get user's country for localization hints
export const detectUserCountry = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const countryCode = browserLang.split('-')[1];
  return countryCode?.toUpperCase() || 'US';
};

// Check if language is available
export const isLanguageAvailable = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode]?.available || false;
};

// Get all supported languages
export const getSupportedLanguages = () => {
  return SUPPORTED_LANGUAGES;
};

// Save user's language preference
export const saveLanguagePreference = (langCode) => {
  localStorage.setItem('printcraft_language', langCode);
  
  // Track interest in non-English languages for analytics
  if (langCode !== 'en') {
    // This would normally send to analytics
    console.log(`User interested in language: ${langCode}`);
    
    // Store in localStorage for potential future analysis
    const interests = JSON.parse(localStorage.getItem('printcraft_language_interests') || '[]');
    if (!interests.includes(langCode)) {
      interests.push(langCode);
      localStorage.setItem('printcraft_language_interests', JSON.stringify(interests));
    }
  }
};

// Get localized messages for unsupported languages
export const getUnavailableLanguageMessage = (langCode) => {
  const messages = {
    'es': {
      title: '¡Pronto en Español!',
      message: 'PrintCraft estará disponible en español muy pronto. ¡Únete a nuestra lista de espera!',
      button: 'Notificarme'
    },
    'fr': {
      title: 'Bientôt en Français!',
      message: 'PrintCraft sera bientôt disponible en français. Rejoignez notre liste d\'attente!',
      button: 'Me notifier'
    },
    'de': {
      title: 'Bald auf Deutsch!',
      message: 'PrintCraft wird bald auf Deutsch verfügbar sein. Tritt unserer Warteliste bei!',
      button: 'Benachrichtigen'
    },
    'pt': {
      title: 'Em breve em Português!',
      message: 'PrintCraft estará disponível em português em breve. Junte-se à nossa lista de espera!',
      button: 'Me notificar'
    },
    'zh': {
      title: '即将推出中文版！',
      message: 'PrintCraft 中文版即将推出。加入我们的等待列表！',
      button: '通知我'
    },
    'ja': {
      title: '日本語版近日公開！',
      message: 'PrintCraftの日本語版が近日公開予定です。ウェイティングリストにご参加ください！',
      button: '通知を受け取る'
    },
    'ar': {
      title: 'قريباً باللغة العربية!',
      message: 'سيكون PrintCraft متاحاً باللغة العربية قريباً. انضم إلى قائمة الانتظار!',
      button: 'أعلمني'
    }
  };

  return messages[langCode] || {
    title: 'Coming Soon!',
    message: `PrintCraft will be available in ${SUPPORTED_LANGUAGES[langCode]?.name} soon. Join our waitlist!`,
    button: 'Notify Me'
  };
};

// Format currency based on detected country/language
export const formatCurrency = (amount, langCode = 'en', countryCode = 'US') => {
  const currencyMap = {
    'US': 'USD',
    'GB': 'GBP', 
    'EU': 'EUR',
    'DE': 'EUR',
    'FR': 'EUR',
    'ES': 'EUR',
    'BR': 'BRL',
    'CN': 'CNY',
    'JP': 'JPY',
    'SA': 'SAR'
  };

  const currency = currencyMap[countryCode] || 'USD';
  const locale = `${langCode}-${countryCode}`;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    // Fallback to USD if formatting fails
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
};

// Simple analytics tracking for language interest
export const trackLanguageInterest = (langCode) => {
  // This would normally send to your analytics service
  console.log(`Language interest tracked: ${langCode}`);
  
  // Store locally for now
  const timestamp = new Date().toISOString();
  const interest = { language: langCode, timestamp };
  
  const existingInterests = JSON.parse(localStorage.getItem('printcraft_language_analytics') || '[]');
  existingInterests.push(interest);
  
  // Keep only last 100 entries
  if (existingInterests.length > 100) {
    existingInterests.splice(0, existingInterests.length - 100);
  }
  
  localStorage.setItem('printcraft_language_analytics', JSON.stringify(existingInterests));
};