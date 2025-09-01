import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

const FontLibrary = ({ onFontSelect, selectedFont }) => {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [savedFonts, setSavedFonts] = useState([]);

  // Extended font library with more options
  const fontLibrary = [
    // Sans-serif fonts
    { 
      name: 'Arial', 
      category: 'sans-serif', 
      weight: [400, 700], 
      isPremium: false,
      description: 'Clean, modern sans-serif font perfect for professional designs',
      tags: ['clean', 'modern', 'professional']
    },
    { 
      name: 'Helvetica', 
      category: 'sans-serif', 
      weight: [300, 400, 600, 700], 
      isPremium: true,
      description: 'Swiss design classic, widely used in corporate branding',
      tags: ['swiss', 'corporate', 'classic']
    },
    { 
      name: 'Roboto', 
      category: 'sans-serif', 
      weight: [300, 400, 500, 700], 
      isPremium: false,
      description: 'Google\'s modern font designed for digital interfaces',
      tags: ['google', 'digital', 'modern']
    },
    { 
      name: 'Open Sans', 
      category: 'sans-serif', 
      weight: [300, 400, 600, 700], 
      isPremium: false,
      description: 'Friendly and readable font optimized for print and web',
      tags: ['friendly', 'readable', 'versatile']
    },
    { 
      name: 'Lato', 
      category: 'sans-serif', 
      weight: [300, 400, 700], 
      isPremium: false,
      description: 'Semi-rounded details give warmth while maintaining stability',
      tags: ['warm', 'stable', 'modern']
    },
    { 
      name: 'Montserrat', 
      category: 'sans-serif', 
      weight: [300, 400, 600, 700, 800], 
      isPremium: true,
      description: 'Inspired by urban typography from early 20th century Buenos Aires',
      tags: ['urban', 'geometric', 'vintage']
    },

    // Serif fonts
    { 
      name: 'Times New Roman', 
      category: 'serif', 
      weight: [400, 700], 
      isPremium: false,
      description: 'Traditional serif font, excellent for formal documents',
      tags: ['traditional', 'formal', 'classic']
    },
    { 
      name: 'Georgia', 
      category: 'serif', 
      weight: [400, 700], 
      isPremium: false,
      description: 'Designed for screen readability with elegant serifs',
      tags: ['elegant', 'readable', 'screen-friendly']
    },
    { 
      name: 'Playfair Display', 
      category: 'serif', 
      weight: [400, 700, 900], 
      isPremium: true,
      description: 'High contrast serif perfect for headlines and luxury brands',
      tags: ['luxury', 'headline', 'high-contrast']
    },
    { 
      name: 'Merriweather', 
      category: 'serif', 
      weight: [300, 400, 700], 
      isPremium: false,
      description: 'Designed for pleasant reading on screens and print',
      tags: ['readable', 'pleasant', 'body-text']
    },
    { 
      name: 'Libre Baskerville', 
      category: 'serif', 
      weight: [400, 700], 
      isPremium: true,
      description: 'Classic Baskerville styling optimized for web typography',
      tags: ['classic', 'web-optimized', 'traditional']
    },

    // Display fonts
    { 
      name: 'Impact', 
      category: 'display', 
      weight: [400], 
      isPremium: false,
      description: 'Bold, condensed font perfect for attention-grabbing headlines',
      tags: ['bold', 'condensed', 'headline']
    },
    { 
      name: 'Bebas Neue', 
      category: 'display', 
      weight: [400], 
      isPremium: true,
      description: 'All caps display font with strong geometric appearance',
      tags: ['all-caps', 'geometric', 'strong']
    },
    { 
      name: 'Oswald', 
      category: 'display', 
      weight: [300, 400, 600], 
      isPremium: false,
      description: 'Condensed sans-serif inspired by classic gothic typefaces',
      tags: ['condensed', 'gothic', 'modern']
    },
    { 
      name: 'Anton', 
      category: 'display', 
      weight: [400], 
      isPremium: true,
      description: 'Single weight display font with strong personality',
      tags: ['personality', 'display', 'bold']
    },

    // Script fonts
    { 
      name: 'Dancing Script', 
      category: 'script', 
      weight: [400, 700], 
      isPremium: false,
      description: 'Casual script font perfect for invitations and personal projects',
      tags: ['casual', 'invitations', 'personal']
    },
    { 
      name: 'Great Vibes', 
      category: 'script', 
      weight: [400], 
      isPremium: true,
      description: 'Elegant script font ideal for wedding and luxury designs',
      tags: ['elegant', 'wedding', 'luxury']
    },
    { 
      name: 'Pacifico', 
      category: 'script', 
      weight: [400], 
      isPremium: false,
      description: 'Fun, friendly script inspired by 1950s American surf culture',
      tags: ['fun', 'friendly', 'vintage']
    },
    { 
      name: 'Allura', 
      category: 'script', 
      weight: [400], 
      isPremium: true,
      description: 'Flowing script with beautiful ligatures and swashes',
      tags: ['flowing', 'ligatures', 'beautiful']
    },

    // Monospace fonts
    { 
      name: 'Courier New', 
      category: 'monospace', 
      weight: [400, 700], 
      isPremium: false,
      description: 'Classic typewriter font, perfect for code and retro designs',
      tags: ['typewriter', 'code', 'retro']
    },
    { 
      name: 'Source Code Pro', 
      category: 'monospace', 
      weight: [300, 400, 600], 
      isPremium: true,
      description: 'Modern monospace font designed for coding environments',
      tags: ['modern', 'coding', 'clean']
    },
    { 
      name: 'Space Mono', 
      category: 'monospace', 
      weight: [400, 700], 
      isPremium: false,
      description: 'Geometric monospace with quirky details',
      tags: ['geometric', 'quirky', 'space-age']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Fonts', icon: '🔤' },
    { value: 'sans-serif', label: 'Sans Serif', icon: '📝' },
    { value: 'serif', label: 'Serif', icon: '📰' },
    { value: 'display', label: 'Display', icon: '🎭' },
    { value: 'script', label: 'Script', icon: '✍️' },
    { value: 'monospace', label: 'Monospace', icon: '💻' }
  ];

  // Filter fonts based on search and category
  const filteredFonts = fontLibrary.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         font.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    const hasAccess = !font.isPremium || (isAuthenticated && user?.role === 'premium');
    
    return matchesSearch && matchesCategory && hasAccess;
  });

  // Load saved fonts from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const saved = JSON.parse(localStorage.getItem(`printcraft_saved_fonts_${user?.id}`) || '[]');
      setSavedFonts(saved);
    }
  }, [isAuthenticated, user]);

  const toggleSaveFont = (fontName) => {
    if (!isAuthenticated) return;

    const newSaved = savedFonts.includes(fontName)
      ? savedFonts.filter(name => name !== fontName)
      : [...savedFonts, fontName];
    
    setSavedFonts(newSaved);
    localStorage.setItem(`printcraft_saved_fonts_${user?.id}`, JSON.stringify(newSaved));
  };

  const FontCard = ({ font }) => (
    <div 
      className={`bg-white border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${
        selectedFont === font.name ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
      }`}
      onClick={() => onFontSelect(font)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{font.name}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{font.category}</p>
        </div>
        <div className="flex space-x-1">
          {font.isPremium && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⭐ Premium
            </span>
          )}
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveFont(font.name);
              }}
              className={`rounded-full transition-colors ${
                savedFonts.includes(font.name)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              style={{padding: '0.5rem'}}
            >
              {savedFonts.includes(font.name) ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      </div>

      {/* Font Preview */}
      <div 
        className="text-2xl mb-3 text-gray-900"
        style={{ fontFamily: font.name }}
      >
        Aa Bb Cc
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {font.description}
      </p>

      {/* Font Weights */}
      <div className="flex flex-wrap gap-2 mb-3">
        {font.weight.map(weight => (
          <span 
            key={weight}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
          >
            {weight === 300 ? 'Light' : 
             weight === 400 ? 'Regular' :
             weight === 500 ? 'Medium' :
             weight === 600 ? 'Semi Bold' :
             weight === 700 ? 'Bold' :
             weight === 800 ? 'Extra Bold' :
             weight === 900 ? 'Black' : weight}
          </span>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {font.tags.slice(0, 3).map(tag => (
          <span 
            key={tag}
            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const FontListItem = ({ font }) => (
    <div 
      className={`bg-white border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer flex items-center space-x-4 ${
        selectedFont === font.name ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
      }`}
      onClick={() => onFontSelect(font)}
    >
      <div 
        className="text-3xl text-gray-900 min-w-[80px]"
        style={{ fontFamily: font.name }}
      >
        Aa
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900">{font.name}</h3>
          <div className="flex items-center space-x-2">
            {font.isPremium && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ⭐ Premium
              </span>
            )}
            {isAuthenticated && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveFont(font.name);
                }}
                className={`transition-colors ${
                  savedFonts.includes(font.name)
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {savedFonts.includes(font.name) ? '❤️' : '🤍'}
              </button>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{font.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {font.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            {font.weight.map(weight => (
              <span 
                key={weight}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
              >
                {weight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Font Library</h2>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg" style={{padding: '0.5rem'}}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search fonts by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          {filteredFonts.length} font{filteredFonts.length !== 1 ? 's' : ''} available
        </p>
        {!isAuthenticated && (
          <div className="text-sm text-primary-600">
            <span>🔒 Sign in to access premium fonts</span>
          </div>
        )}
      </div>

      {/* Font Grid/List */}
      {filteredFonts.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredFonts.map(font => 
            viewMode === 'grid' 
              ? <FontCard key={font.name} font={font} />
              : <FontListItem key={font.name} font={font} />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No fonts found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or category filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Saved Fonts Section */}
      {isAuthenticated && savedFonts.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ❤️ Your Saved Fonts ({savedFonts.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {savedFonts.map(fontName => {
              const font = fontLibrary.find(f => f.name === fontName);
              return font ? (
                <button
                  key={fontName}
                  onClick={() => onFontSelect(font)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedFont === fontName
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className="text-lg mb-1"
                    style={{ fontFamily: fontName }}
                  >
                    Aa
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {fontName}
                  </div>
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

FontLibrary.propTypes = {
  onFontSelect: PropTypes.func,
  selectedFont: PropTypes.string
};

export default FontLibrary;