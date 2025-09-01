import { useState } from 'react';
import PropTypes from 'prop-types';

const SimpleLanguageSelector = ({ className = '' }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [showDropdown, setShowDropdown] = useState(false);

  const supportedLanguages = {
    'en': { name: 'English', flag: '🇺🇸', available: true },
    'es': { name: 'Español', flag: '🇪🇸', available: false },
    'fr': { name: 'Français', flag: '🇫🇷', available: false },
    'de': { name: 'Deutsch', flag: '🇩🇪', available: false },
    'pt': { name: 'Português', flag: '🇧🇷', available: false },
    'zh': { name: '中文', flag: '🇨🇳', available: false },
    'ja': { name: '日本語', flag: '🇯🇵', available: false },
    'ar': { name: 'العربية', flag: '🇸🇦', available: false }
  };

  const handleLanguageSelect = (langCode) => {
    if (supportedLanguages[langCode].available) {
      setCurrentLang(langCode);
      localStorage.setItem('printcraft_language', langCode);
      setShowDropdown(false);
      // In a full implementation, this would trigger app re-render with new language
    } else {
      // Show coming soon alert for unavailable languages
      alert(`${supportedLanguages[langCode].name} is coming soon! We'll notify you when it's available.`);
      setShowDropdown(false);
    }
  };

  const currentLangInfo = supportedLanguages[currentLang];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-700 transition-colors rounded-lg"
      >
        <span className="text-lg">{currentLangInfo?.flag}</span>
        <span className="hidden sm:inline">{currentLangInfo?.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-48 shadow-lg border border-gray-600 py-1 z-50"
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px'
          }}
        >
          {Object.entries(supportedLanguages).map(([langCode, langInfo]) => (
            <button
              key={langCode}
              onClick={() => handleLanguageSelect(langCode)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-700 ${
                currentLang === langCode ? 'bg-blue-900 text-cyan-400' : 'text-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{langInfo.flag}</span>
                <span>{langInfo.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {!langInfo.available && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Soon
                  </span>
                )}
                {currentLang === langCode && (
                  <span className="text-primary-500">✓</span>
                )}
              </div>
            </button>
          ))}
          
          <div className="border-t border-gray-100 mt-1 pt-1">
            <div className="px-4 py-2 text-xs text-gray-500">
              Missing your language?{' '}
              <a 
                href="mailto:support@printcraft.com?subject=Language Request"
                className="text-primary-600 hover:text-primary-700"
              >
                Let us know
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SimpleLanguageSelector.propTypes = {
  className: PropTypes.string
};

export default SimpleLanguageSelector;