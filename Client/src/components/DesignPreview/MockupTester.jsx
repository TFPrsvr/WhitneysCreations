import React, { useState } from 'react';
import MockupGenerator from './MockupGenerator';
import EnhancedMockupViewer from './EnhancedMockupViewer';

const MockupTester = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [testDesign, setTestDesign] = useState({
    text: 'Sample Design',
    color: '#000000',
    fontSize: 24,
    fontFamily: 'Arial'
  });

  const handleExport = (mockupData) => {
    console.log('Mockup exported:', mockupData);
    alert('Mockup exported successfully! Check console for details.');
  };

  const handleDesignChange = (field, value) => {
    setTestDesign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mockup Generator Test Page</h1>
          <p className="text-gray-600">Test the mockup generators with real product images</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'generator'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mockup Generator
            </button>
            <button
              onClick={() => setActiveTab('viewer')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'viewer'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enhanced Viewer
            </button>
          </div>
        </div>

        {/* Design Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Design Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Text
              </label>
              <input
                type="text"
                value={testDesign.text}
                onChange={(e) => handleDesignChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter design text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={testDesign.color}
                onChange={(e) => handleDesignChange('color', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <input
                type="number"
                value={testDesign.fontSize}
                onChange={(e) => handleDesignChange('fontSize', parseInt(e.target.value))}
                min="12"
                max="72"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={testDesign.fontFamily}
                onChange={(e) => handleDesignChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>
        </div>

        {/* Component Display */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeTab === 'generator' && (
            <MockupGenerator
              design={testDesign}
              onExport={handleExport}
            />
          )}
          {activeTab === 'viewer' && (
            <EnhancedMockupViewer
              design={testDesign}
              onExport={handleExport}
            />
          )}
        </div>

        {/* Test Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Test Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Purpose:</strong> Test mockup generators with stock images and fallback placeholders</p>
            <p><strong>Features:</strong> Dynamic product switching, color variants, angle selection, image preloading</p>
            <p><strong>Fallback:</strong> SVG placeholders are generated when real images are not available</p>
            <p><strong>Performance:</strong> Images are preloaded for better user experience</p>
          </div>
        </div>

        {/* Debug Information */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <details>
            <summary className="cursor-pointer font-medium text-gray-700">Debug Information</summary>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><strong>Current Design:</strong> {JSON.stringify(testDesign, null, 2)}</p>
              <p><strong>Active Tab:</strong> {activeTab}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default MockupTester;