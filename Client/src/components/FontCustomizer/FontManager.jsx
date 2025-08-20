import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FontCustomizer from './FontCustomizer';
import FontLibrary from './FontLibrary';

const FontManager = ({ onFontApply, initialSettings = null }) => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('customizer');
  const [selectedFont, setSelectedFont] = useState(null);
  const [customFontSettings, setCustomFontSettings] = useState(null);
  const [savedPresets, setSavedPresets] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Load saved presets on component mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const saved = JSON.parse(localStorage.getItem(`printcraft_font_presets_${user.id}`) || '[]');
      setSavedPresets(saved);
    }
  }, [isAuthenticated, user]);

  // Apply initial settings if provided
  useEffect(() => {
    if (initialSettings) {
      setCustomFontSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleFontSelect = (font) => {
    setSelectedFont(font.name);
    // Create basic settings from selected font
    const basicSettings = {
      family: font.name,
      size: 32,
      weight: font.weight.includes(400) ? '400' : font.weight[0].toString(),
      style: 'normal',
      color: '#000000',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      rotation: 0,
      shadow: false,
      shadowColor: '#888888',
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      outline: false,
      outlineColor: '#000000',
      outlineWidth: 1
    };
    setCustomFontSettings(basicSettings);
    setActiveTab('customizer');
  };

  const handleFontChange = (settings, text) => {
    setCustomFontSettings(settings);
    if (onFontApply) {
      onFontApply(settings, text);
    }
  };

  const savePreset = () => {
    if (!isAuthenticated || !customFontSettings || !presetName.trim()) return;

    const newPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      settings: { ...customFontSettings },
      createdAt: new Date().toISOString(),
      thumbnail: generateThumbnailData()
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem(`printcraft_font_presets_${user.id}`, JSON.stringify(updatedPresets));
    
    setShowSaveModal(false);
    setPresetName('');
  };

  const loadPreset = (preset) => {
    setCustomFontSettings(preset.settings);
    setSelectedFont(preset.settings.family);
    setActiveTab('customizer');
  };

  const deletePreset = (presetId) => {
    const updatedPresets = savedPresets.filter(preset => preset.id !== presetId);
    setSavedPresets(updatedPresets);
    localStorage.setItem(`printcraft_font_presets_${user.id}`, JSON.stringify(updatedPresets));
  };

  const generateThumbnailData = () => {
    if (!customFontSettings) return null;
    return {
      family: customFontSettings.family,
      size: Math.min(customFontSettings.size, 24),
      weight: customFontSettings.weight,
      color: customFontSettings.color,
      shadow: customFontSettings.shadow,
      outline: customFontSettings.outline
    };
  };

  const exportSettings = () => {
    if (!customFontSettings) return;

    const exportData = {
      version: '1.0',
      settings: customFontSettings,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.username || 'anonymous'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `font-settings-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        if (importData.settings && importData.version) {
          setCustomFontSettings(importData.settings);
          setSelectedFont(importData.settings.family);
          setActiveTab('customizer');
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid font settings file.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const tabs = [
    { id: 'customizer', label: 'Font Customizer', icon: '🎨' },
    { id: 'library', label: 'Font Library', icon: '📚' },
    { id: 'presets', label: 'My Presets', icon: '💾', authRequired: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-6">
        <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Font Manager</h1>
        <div className="flex items-center space-x-3">
          {isAuthenticated && customFontSettings && (
            <>
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <span>💾</span>
                <span>Save Preset</span>
              </button>
              <button
                onClick={exportSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>📤</span>
                <span>Export</span>
              </button>
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center space-x-2">
                <span>📥</span>
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-gray-100 rounded-lg p-2">
        {tabs.map(tab => {
          if (tab.authRequired && !isAuthenticated) return null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-lg text-sm font-medium transition-colors border ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'presets' && savedPresets.length > 0 && (
                <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] flex items-center justify-center">
                  {savedPresets.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'customizer' && (
          <FontCustomizer
            onFontChange={handleFontChange}
            initialText={customFontSettings?.text || 'Sample Text'}
            key={selectedFont} // Force re-render when font changes
          />
        )}

        {activeTab === 'library' && (
          <FontLibrary
            onFontSelect={handleFontSelect}
            selectedFont={selectedFont}
          />
        )}

        {activeTab === 'presets' && isAuthenticated && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Font Presets</h2>
              <div className="text-sm text-gray-600">
                {savedPresets.length} preset{savedPresets.length !== 1 ? 's' : ''} saved
              </div>
            </div>

            {savedPresets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPresets.map(preset => (
                  <div key={preset.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{preset.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(preset.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Preset Preview */}
                    <div 
                      className="bg-white rounded-lg p-4 mb-4 text-center border"
                      style={{ backgroundColor: preset.settings.backgroundColor }}
                    >
                      <div
                        style={{
                          fontFamily: preset.settings.family,
                          fontSize: `${Math.min(preset.settings.size, 24)}px`,
                          fontWeight: preset.settings.weight,
                          color: preset.settings.color,
                          textShadow: preset.settings.shadow 
                            ? `${preset.settings.shadowOffsetX}px ${preset.settings.shadowOffsetY}px ${preset.settings.shadowBlur}px ${preset.settings.shadowColor}`
                            : 'none',
                          WebkitTextStroke: preset.settings.outline 
                            ? `${preset.settings.outlineWidth}px ${preset.settings.outlineColor}`
                            : 'none'
                        }}
                      >
                        Sample Text
                      </div>
                    </div>

                    {/* Preset Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Font:</span>
                        <span className="font-medium">{preset.settings.family}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{preset.settings.size}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300" 
                            style={{ backgroundColor: preset.settings.color }}
                          ></div>
                          <span className="font-medium">{preset.settings.color}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => loadPreset(preset)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Load Preset
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💾</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No presets saved yet</h3>
                <p className="text-gray-600 mb-6">
                  Create a custom font design and save it as a preset for future use
                </p>
                <button
                  onClick={() => setActiveTab('customizer')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start Customizing
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Preset Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Font Preset</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preset Name
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Bold Headlines, Elegant Script..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && savePreset()}
              />
            </div>

            {customFontSettings && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div 
                  className="bg-gray-50 rounded-lg p-4 text-center border"
                  style={{ backgroundColor: customFontSettings.backgroundColor }}
                >
                  <div
                    style={{
                      fontFamily: customFontSettings.family,
                      fontSize: '20px',
                      fontWeight: customFontSettings.weight,
                      color: customFontSettings.color
                    }}
                  >
                    {presetName || 'Sample Text'}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={savePreset}
                disabled={!presetName.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default FontManager;