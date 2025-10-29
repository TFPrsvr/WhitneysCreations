import React, { useState } from 'react';

const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showEmail: false,
    showProjects: true,
    allowMessages: true,
    dataCollection: true,
    thirdPartySharing: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleToggle = (key) => {
    setPrivacy({
      ...privacy,
      [key]: !privacy[key]
    });
  };

  const handleSave = () => {
    // Add your save logic here
    setMessage({ type: 'success', text: 'Privacy settings saved successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 page-container">
      <div className="w-full px-8">
        <h1 className="text-base font-bold text-white mb-3 drop-shadow-md">Privacy Settings</h1>

        {message.text && (
          <div className={`rounded-lg p-1.5 mb-2 text-[10px] ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Profile Privacy</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">Public Profile</p>
                  <p className="text-[9px] text-gray-600">Allow others to view your profile</p>
                </div>
                <button
                  onClick={() => handleToggle('profilePublic')}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    privacy.profilePublic ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  style={{border: 'none', boxShadow: 'none', outline: 'none'}}
                  aria-checked={privacy.profilePublic}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      privacy.profilePublic ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">Show Email Address</p>
                  <p className="text-[9px] text-gray-600">Display email on your public profile</p>
                </div>
                <button
                  onClick={() => handleToggle('showEmail')}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    privacy.showEmail ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  style={{border: 'none', boxShadow: 'none', outline: 'none'}}
                  aria-checked={privacy.showEmail}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      privacy.showEmail ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">Show Projects</p>
                  <p className="text-[9px] text-gray-600">Let others see your design projects</p>
                </div>
                <button
                  onClick={() => handleToggle('showProjects')}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    privacy.showProjects ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  style={{border: 'none', boxShadow: 'none', outline: 'none'}}
                  aria-checked={privacy.showProjects}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      privacy.showProjects ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Communication</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">Allow Messages</p>
                  <p className="text-[9px] text-gray-600">Receive messages from other users</p>
                </div>
                <button
                  onClick={() => handleToggle('allowMessages')}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    privacy.allowMessages ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  style={{border: 'none', boxShadow: 'none', outline: 'none'}}
                  aria-checked={privacy.allowMessages}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      privacy.allowMessages ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Data & Analytics</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">Usage Data Collection</p>
                  <p className="text-[9px] text-gray-600">Help improve our service with usage analytics</p>
                </div>
                <button
                  onClick={() => handleToggle('dataCollection')}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    privacy.dataCollection ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  style={{border: 'none', boxShadow: 'none', outline: 'none'}}
                  aria-checked={privacy.dataCollection}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      privacy.dataCollection ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">Third-Party Sharing</p>
                  <p className="text-[9px] text-gray-600">Share data with partner services</p>
                </div>
                <button
                  onClick={() => handleToggle('thirdPartySharing')}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    privacy.thirdPartySharing ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  style={{border: 'none', boxShadow: 'none', outline: 'none'}}
                  aria-checked={privacy.thirdPartySharing}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      privacy.thirdPartySharing ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold text-[10px] hover:shadow-lg transition-all duration-200"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Privacy Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 mt-2">
          <h3 className="text-[10px] font-semibold text-blue-900 mb-1.5">About Your Privacy</h3>
          <p className="text-[9px] text-blue-800 mb-1.5">
            We take your privacy seriously. Your data is encrypted and stored securely. We never sell your personal information to third parties.
          </p>
          <a href="/privacy-policy" className="text-[9px] font-semibold text-blue-600 hover:text-blue-800 underline">
            Read our Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
