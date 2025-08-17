import React, { useState, useEffect } from 'react';
import { 
  detectUserLanguage, 
  getSupportedLanguages, 
  isLanguageAvailable,
  saveLanguagePreference,
  getUnavailableLanguageMessage,
  trackLanguageInterest
} from '../../utils/i18n';

const LanguageSelector = ({ className = '' }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [selectedUnavailableLang, setSelectedUnavailableLang] = useState(null);

  useEffect(() => {
    const detectedLang = detectUserLanguage();
    setCurrentLang(detectedLang);
  }, []);

  const handleLanguageSelect = (langCode) => {
    if (isLanguageAvailable(langCode)) {
      setCurrentLang(langCode);
      saveLanguagePreference(langCode);
      setShowDropdown(false);
      // In a full implementation, this would trigger app re-render with new language
      window.location.reload();
    } else {
      // Show coming soon modal for unavailable languages
      setSelectedUnavailableLang(langCode);
      setShowComingSoonModal(true);
      setShowDropdown(false);
      trackLanguageInterest(langCode);
    }
  };

  const handleWaitlistSignup = () => {
    // In a real implementation, this would collect email and add to waitlist
    alert(`Thank you for your interest! We'll notify you when ${getSupportedLanguages()[selectedUnavailableLang]?.name} is available.`);
    setShowComingSoonModal(false);
  };

  const supportedLanguages = getSupportedLanguages();
  const currentLangInfo = supportedLanguages[currentLang];

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-lg">{currentLangInfo?.flag}</span>
          <span className="hidden sm:inline">{currentLangInfo?.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {Object.entries(supportedLanguages).map(([langCode, langInfo]) => (
              <button
                key={langCode}
                onClick={() => handleLanguageSelect(langCode)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                  currentLang === langCode ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
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

      {/* Coming Soon Modal */}
      {showComingSoonModal && selectedUnavailableLang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {supportedLanguages[selectedUnavailableLang]?.flag}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {getUnavailableLanguageMessage(selectedUnavailableLang).title}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {getUnavailableLanguageMessage(selectedUnavailableLang).message}
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowComingSoonModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWaitlistSignup}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {getUnavailableLanguageMessage(selectedUnavailableLang).button}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                We'll email you when {supportedLanguages[selectedUnavailableLang]?.name} is ready!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector;