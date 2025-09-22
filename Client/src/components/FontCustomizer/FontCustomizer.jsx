import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FontCustomizer = ({ onFontChange, initialText = 'Sample Text' }) => {
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef(null);
  
  const [fontSettings, setFontSettings] = useState({
    family: 'Arial',
    size: 32,
    weight: '400',
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
  });

  const [customText, setCustomText] = useState(initialText);
  const [previewMode, setPreviewMode] = useState('canvas');

  // Popular font families for print design
  const fontFamilies = [
    { name: 'Arial', category: 'Sans-serif', popular: true },
    { name: 'Helvetica', category: 'Sans-serif', popular: true },
    { name: 'Times New Roman', category: 'Serif', popular: true },
    { name: 'Georgia', category: 'Serif', popular: true },
    { name: 'Verdana', category: 'Sans-serif', popular: false },
    { name: 'Impact', category: 'Display', popular: true },
    { name: 'Comic Sans MS', category: 'Display', popular: false },
    { name: 'Trebuchet MS', category: 'Sans-serif', popular: false },
    { name: 'Courier New', category: 'Monospace', popular: false },
    { name: 'Brush Script MT', category: 'Script', popular: true },
    { name: 'Palatino', category: 'Serif', popular: false },
    { name: 'Franklin Gothic Medium', category: 'Sans-serif', popular: true }
  ];

  const fontWeights = [
    { value: '100', label: 'Thin' },
    { value: '300', label: 'Light' },
    { value: '400', label: 'Regular' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '900', label: 'Black' }
  ];

  const textAlignOptions = [
    { value: 'left', icon: '⬅️', label: 'Left' },
    { value: 'center', icon: '⬆️', label: 'Center' },
    { value: 'right', icon: '➡️', label: 'Right' }
  ];

  // Update canvas when settings change
  useEffect(() => {
    drawTextOnCanvas();
    if (onFontChange) {
      onFontChange(fontSettings, customText);
    }
  }, [fontSettings, customText]);

  const drawTextOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.fillStyle = fontSettings.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Setup text properties
    ctx.font = `${fontSettings.style} ${fontSettings.weight} ${fontSettings.size}px ${fontSettings.family}`;
    ctx.textAlign = fontSettings.textAlign;
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = `${fontSettings.letterSpacing}px`;

    // Calculate position
    let x = width / 2;
    if (fontSettings.textAlign === 'left') x = 50;
    if (fontSettings.textAlign === 'right') x = width - 50;
    const y = height / 2;

    // Save context for rotation
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((fontSettings.rotation * Math.PI) / 180);

    // Draw shadow if enabled
    if (fontSettings.shadow) {
      ctx.shadowColor = fontSettings.shadowColor;
      ctx.shadowBlur = fontSettings.shadowBlur;
      ctx.shadowOffsetX = fontSettings.shadowOffsetX;
      ctx.shadowOffsetY = fontSettings.shadowOffsetY;
    }

    // Draw outline if enabled
    if (fontSettings.outline) {
      ctx.strokeStyle = fontSettings.outlineColor;
      ctx.lineWidth = fontSettings.outlineWidth;
      ctx.strokeText(customText, 0, 0);
    }

    // Draw main text
    ctx.fillStyle = fontSettings.color;
    ctx.fillText(customText, 0, 0);

    ctx.restore();
  };

  const handleSettingChange = (setting, value) => {
    setFontSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const resetToDefaults = () => {
    setFontSettings({
      family: 'Arial',
      size: 32,
      weight: '400',
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
    });
    setCustomText(initialText);
  };

  const downloadPreview = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'font-preview.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const popularFonts = fontFamilies.filter(font => font.popular);
  const allFonts = fontFamilies.filter(font => !font.popular);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Font Customizer</h2>
        <div className="flex space-x-2">
          <button
            onClick={resetToDefaults}
            className="btn-secondary btn-small"
          >
            Reset
          </button>
          {isAuthenticated && (
            <button
              onClick={downloadPreview}
              className="btn-gradient-primary btn-small"
            >
              Download Preview
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="space-y-6 max-w-lg">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview Text
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your text..."
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <div className="space-y-3">
              {/* Popular Fonts */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">POPULAR</p>
                <div className="grid grid-cols-2 gap-2">
                  {popularFonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => handleSettingChange('family', font.name)}
                      className={`text-left border rounded-lg transition-colors ${
                        fontSettings.family === font.name
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{padding: '0.5rem', fontFamily: font.name}}
                    >
                      <div className="font-medium text-sm">{font.name}</div>
                      <div className="text-xs text-gray-500">{font.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* All Fonts Dropdown */}
              <div>
                <select
                  value={fontSettings.family}
                  onChange={(e) => handleSettingChange('family', e.target.value)}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <optgroup label="Popular Fonts">
                    {popularFonts.map((font) => (
                      <option key={font.name} value={font.name}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All Fonts">
                    {allFonts.map((font) => (
                      <option key={font.name} value={font.name}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size ({fontSettings.size}px)
              </label>
              <input
                type="range"
                min="12"
                max="120"
                value={fontSettings.size}
                onChange={(e) => handleSettingChange('size', parseInt(e.target.value))}
                className="w-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight
              </label>
              <select
                value={fontSettings.weight}
                onChange={(e) => handleSettingChange('weight', e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {fontWeights.map((weight) => (
                  <option key={weight.value} value={weight.value}>
                    {weight.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Color & Background */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={fontSettings.color}
                  onChange={(e) => handleSettingChange('color', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={fontSettings.color}
                  onChange={(e) => handleSettingChange('color', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={fontSettings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={fontSettings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Alignment
            </label>
            <div className="flex space-x-2">
              {textAlignOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSettingChange('textAlign', option.value)}
                  className={`flex-1 p-3 border rounded-lg transition-colors ${
                    fontSettings.textAlign === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-lg">{option.icon}</div>
                  <div className="text-sm">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
            
            {/* Letter Spacing & Rotation */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Letter Spacing ({fontSettings.letterSpacing}px)
                </label>
                <input
                  type="range"
                  min="-5"
                  max="20"
                  value={fontSettings.letterSpacing}
                  onChange={(e) => handleSettingChange('letterSpacing', parseInt(e.target.value))}
                  className="w-full max-w-xs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation ({fontSettings.rotation}°)
                </label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={fontSettings.rotation}
                  onChange={(e) => handleSettingChange('rotation', parseInt(e.target.value))}
                  className="w-full max-w-xs"
                />
              </div>
            </div>

            {/* Shadow Settings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Text Shadow</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={fontSettings.shadow}
                    onChange={(e) => handleSettingChange('shadow', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Enable</span>
                </label>
              </div>
              {fontSettings.shadow && (
                <div className="grid grid-cols-2 gap-3 pl-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Shadow Color</label>
                    <input
                      type="color"
                      value={fontSettings.shadowColor}
                      onChange={(e) => handleSettingChange('shadowColor', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Blur ({fontSettings.shadowBlur}px)</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={fontSettings.shadowBlur}
                      onChange={(e) => handleSettingChange('shadowBlur', parseInt(e.target.value))}
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Outline Settings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Text Outline</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={fontSettings.outline}
                    onChange={(e) => handleSettingChange('outline', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Enable</span>
                </label>
              </div>
              {fontSettings.outline && (
                <div className="grid grid-cols-2 gap-3 pl-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Outline Color</label>
                    <input
                      type="color"
                      value={fontSettings.outlineColor}
                      onChange={(e) => handleSettingChange('outlineColor', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Width ({fontSettings.outlineWidth}px)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={fontSettings.outlineWidth}
                      onChange={(e) => handleSettingChange('outlineWidth', parseInt(e.target.value))}
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            <div className="flex space-x-1 bg-gray-100 rounded-lg" style={{padding: '0.5rem'}}>
              <button
                onClick={() => setPreviewMode('canvas')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  previewMode === 'canvas'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Canvas
              </button>
              <button
                onClick={() => setPreviewMode('live')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  previewMode === 'live'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Live Text
              </button>
            </div>
          </div>

          {previewMode === 'canvas' ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="max-w-md h-auto bg-white"
              />
            </div>
          ) : (
            <div 
              className="border border-gray-300 rounded-lg p-8 min-h-[300px] flex items-center justify-center"
              style={{ 
                backgroundColor: fontSettings.backgroundColor,
                textAlign: fontSettings.textAlign 
              }}
            >
              <div
                style={{
                  fontFamily: fontSettings.family,
                  fontSize: `${fontSettings.size}px`,
                  fontWeight: fontSettings.weight,
                  fontStyle: fontSettings.style,
                  color: fontSettings.color,
                  letterSpacing: `${fontSettings.letterSpacing}px`,
                  lineHeight: fontSettings.lineHeight,
                  transform: `rotate(${fontSettings.rotation}deg)`,
                  textShadow: fontSettings.shadow 
                    ? `${fontSettings.shadowOffsetX}px ${fontSettings.shadowOffsetY}px ${fontSettings.shadowBlur}px ${fontSettings.shadowColor}`
                    : 'none',
                  WebkitTextStroke: fontSettings.outline 
                    ? `${fontSettings.outlineWidth}px ${fontSettings.outlineColor}`
                    : 'none'
                }}
              >
                {customText}
              </div>
            </div>
          )}

          {/* Font Info Card */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Current Font Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Family:</span>
                <span className="font-medium">{fontSettings.family}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{fontSettings.size}px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{fontWeights.find(w => w.value === fontSettings.weight)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300" 
                    style={{ backgroundColor: fontSettings.color }}
                  ></div>
                  <span className="font-medium">{fontSettings.color}</span>
                </div>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-yellow-800">
                <p className="font-medium mb-1">🔒 Sign in to unlock full features</p>
                <p className="text-sm">Save custom fonts, download previews, and access premium fonts</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FontCustomizer;