import { useState } from 'react';
import PropTypes from 'prop-types';

const StickerLibrary = ({ onStickerSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Premade stickers and images organized by category
  const stickerLibrary = {
    emoji: [
      { id: 'emoji-1', name: 'Happy Vibes', content: '😊', type: 'emoji', tags: ['happy', 'smile', 'emotion', 'positive'] },
      { id: 'emoji-2', name: 'Love Struck', content: '😍', type: 'emoji', tags: ['love', 'heart', 'emotion', 'crush'] },
      { id: 'emoji-3', name: 'Deep Thoughts', content: '🤔', type: 'emoji', tags: ['thinking', 'question', 'emotion', 'contemplating'] },
      { id: 'emoji-4', name: 'Approval Seal', content: '👍', type: 'emoji', tags: ['approve', 'good', 'positive', 'yes'] },
      { id: 'emoji-5', name: 'Fire Energy', content: '🔥', type: 'emoji', tags: ['hot', 'fire', 'trending', 'lit'] },
      { id: 'emoji-6', name: 'Golden Star', content: '⭐', type: 'emoji', tags: ['star', 'rating', 'special', 'excellence'] },
      { id: 'emoji-7', name: 'Power Bolt', content: '⚡', type: 'emoji', tags: ['electric', 'power', 'energy', 'speed'] },
      { id: 'emoji-8', name: 'Rainbow Magic', content: '🌈', type: 'emoji', tags: ['colorful', 'rainbow', 'nature', 'pride'] },
      { id: 'emoji-9', name: 'Sunshine Bright', content: '☀️', type: 'emoji', tags: ['sun', 'bright', 'weather', 'joy'] },
      { id: 'emoji-10', name: 'Crescent Dreams', content: '🌙', type: 'emoji', tags: ['moon', 'night', 'crescent', 'peaceful'] }
    ],
    shapes: [
      { id: 'shape-1', name: 'Perfect Circle', content: '●', type: 'shape', tags: ['circle', 'round', 'basic', 'dot'] },
      { id: 'shape-2', name: 'Classic Square', content: '■', type: 'shape', tags: ['square', 'box', 'basic', 'solid'] },
      { id: 'shape-3', name: 'Sharp Triangle', content: '▲', type: 'shape', tags: ['triangle', 'arrow', 'basic', 'point'] },
      { id: 'shape-4', name: 'Gem Diamond', content: '◆', type: 'shape', tags: ['diamond', 'gem', 'special', 'luxury'] },
      { id: 'shape-5', name: 'Love Heart', content: '♥', type: 'shape', tags: ['heart', 'love', 'romantic', 'valentine'] },
      { id: 'shape-6', name: 'Next Arrow', content: '→', type: 'shape', tags: ['arrow', 'direction', 'right', 'forward'] },
      { id: 'shape-7', name: 'Rise Up', content: '↑', type: 'shape', tags: ['arrow', 'direction', 'up', 'growth'] },
      { id: 'shape-8', name: 'Star Frame', content: '☆', type: 'shape', tags: ['star', 'outline', 'rating', 'hollow'] }
    ],
    nature: [
      { id: 'nature-1', name: 'Forest Giant', content: '🌳', type: 'emoji', tags: ['tree', 'nature', 'green', 'forest'] },
      { id: 'nature-2', name: 'Cherry Blossom', content: '🌸', type: 'emoji', tags: ['flower', 'pink', 'nature', 'spring'] },
      { id: 'nature-3', name: 'Green Breeze', content: '🍃', type: 'emoji', tags: ['leaf', 'green', 'nature', 'fresh'] },
      { id: 'nature-4', name: 'Peak Adventure', content: '⛰️', type: 'emoji', tags: ['mountain', 'landscape', 'nature', 'hiking'] },
      { id: 'nature-5', name: 'Tidal Flow', content: '🌊', type: 'emoji', tags: ['wave', 'ocean', 'water', 'surf'] },
      { id: 'nature-6', name: 'Sky Drift', content: '☁️', type: 'emoji', tags: ['cloud', 'weather', 'sky', 'fluffy'] },
      { id: 'nature-7', name: 'Winter Flake', content: '❄️', type: 'emoji', tags: ['snow', 'winter', 'cold', 'unique'] },
      { id: 'nature-8', name: 'Flutter Wings', content: '🦋', type: 'emoji', tags: ['butterfly', 'insect', 'nature', 'transformation'] }
    ],
    objects: [
      { id: 'object-1', name: 'Crown', content: '👑', type: 'emoji', tags: ['crown', 'royal', 'king'] },
      { id: 'object-2', name: 'Trophy', content: '🏆', type: 'emoji', tags: ['trophy', 'winner', 'award'] },
      { id: 'object-3', name: 'Gift', content: '🎁', type: 'emoji', tags: ['gift', 'present', 'surprise'] },
      { id: 'object-4', name: 'Music Note', content: '🎵', type: 'emoji', tags: ['music', 'note', 'song'] },
      { id: 'object-5', name: 'Camera', content: '📷', type: 'emoji', tags: ['camera', 'photo', 'picture'] },
      { id: 'object-6', name: 'Lock', content: '🔒', type: 'emoji', tags: ['lock', 'secure', 'private'] },
      { id: 'object-7', name: 'Key', content: '🔑', type: 'emoji', tags: ['key', 'unlock', 'access'] },
      { id: 'object-8', name: 'Lightbulb', content: '💡', type: 'emoji', tags: ['idea', 'bright', 'innovation'] }
    ],
    food: [
      { id: 'food-1', name: 'Pizza', content: '🍕', type: 'emoji', tags: ['pizza', 'food', 'italian'] },
      { id: 'food-2', name: 'Coffee', content: '☕', type: 'emoji', tags: ['coffee', 'drink', 'caffeine'] },
      { id: 'food-3', name: 'Cake', content: '🎂', type: 'emoji', tags: ['cake', 'birthday', 'dessert'] },
      { id: 'food-4', name: 'Apple', content: '🍎', type: 'emoji', tags: ['apple', 'fruit', 'healthy'] },
      { id: 'food-5', name: 'Ice Cream', content: '🍦', type: 'emoji', tags: ['ice cream', 'dessert', 'cold'] },
      { id: 'food-6', name: 'Hamburger', content: '🍔', type: 'emoji', tags: ['burger', 'food', 'fast food'] },
      { id: 'food-7', name: 'Donut', content: '🍩', type: 'emoji', tags: ['donut', 'dessert', 'sweet'] },
      { id: 'food-8', name: 'Avocado', content: '🥑', type: 'emoji', tags: ['avocado', 'healthy', 'green'] }
    ],
    symbols: [
      { id: 'symbol-1', name: 'Check Mark', content: '✓', type: 'symbol', tags: ['check', 'correct', 'done'] },
      { id: 'symbol-2', name: 'Cross', content: '✗', type: 'symbol', tags: ['cross', 'wrong', 'error'] },
      { id: 'symbol-3', name: 'Plus', content: '+', type: 'symbol', tags: ['plus', 'add', 'positive'] },
      { id: 'symbol-4', name: 'Minus', content: '-', type: 'symbol', tags: ['minus', 'subtract', 'negative'] },
      { id: 'symbol-5', name: 'Question', content: '?', type: 'symbol', tags: ['question', 'help', 'unknown'] },
      { id: 'symbol-6', name: 'Exclamation', content: '!', type: 'symbol', tags: ['exclamation', 'important', 'alert'] },
      { id: 'symbol-7', name: 'At Symbol', content: '@', type: 'symbol', tags: ['at', 'email', 'social'] },
      { id: 'symbol-8', name: 'Hash', content: '#', type: 'symbol', tags: ['hash', 'hashtag', 'number'] }
    ],
    badges: [
      { id: 'badge-1', name: 'New', content: 'NEW', type: 'text', tags: ['new', 'fresh', 'label'], style: { background: '#ff4444', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' } },
      { id: 'badge-2', name: 'Hot', content: 'HOT', type: 'text', tags: ['hot', 'trending', 'popular'], style: { background: '#ff6600', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' } },
      { id: 'badge-3', name: 'Sale', content: 'SALE', type: 'text', tags: ['sale', 'discount', 'offer'], style: { background: '#22aa22', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' } },
      { id: 'badge-4', name: 'Premium', content: '⭐ PREMIUM', type: 'text', tags: ['premium', 'special', 'vip'], style: { background: '#ffd700', color: '#333', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' } },
      { id: 'badge-5', name: 'Limited', content: 'LIMITED', type: 'text', tags: ['limited', 'exclusive', 'rare'], style: { background: '#8b00ff', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' } },
      { id: 'badge-6', name: 'Free', content: 'FREE', type: 'text', tags: ['free', 'no cost', 'gift'], style: { background: '#00aa44', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' } }
    ]
  };

  const categories = [
    { id: 'all', name: 'All', icon: '🎨', count: Object.values(stickerLibrary).flat().length },
    { id: 'emoji', name: 'Emojis', icon: '😊', count: stickerLibrary.emoji.length },
    { id: 'shapes', name: 'Shapes', icon: '⚫', count: stickerLibrary.shapes.length },
    { id: 'nature', name: 'Nature', icon: '🌿', count: stickerLibrary.nature.length },
    { id: 'objects', name: 'Objects', icon: '🎯', count: stickerLibrary.objects.length },
    { id: 'food', name: 'Food', icon: '🍕', count: stickerLibrary.food.length },
    { id: 'symbols', name: 'Symbols', icon: '✓', count: stickerLibrary.symbols.length },
    { id: 'badges', name: 'Badges', icon: '🏷️', count: stickerLibrary.badges.length }
  ];

  // Get filtered stickers based on category and search
  const getFilteredStickers = () => {
    let stickers = [];
    
    if (selectedCategory === 'all') {
      stickers = Object.values(stickerLibrary).flat();
    } else {
      stickers = stickerLibrary[selectedCategory] || [];
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      stickers = stickers.filter(sticker => 
        sticker.name.toLowerCase().includes(term) ||
        sticker.tags.some(tag => tag.toLowerCase().includes(term)) ||
        sticker.content.toLowerCase().includes(term)
      );
    }

    return stickers;
  };

  const handleStickerClick = (sticker) => {
    if (onStickerSelect) {
      // Create an element object that can be added to the canvas
      const element = {
        type: 'sticker',
        id: Date.now(),
        x: 50, // Default position
        y: 50,
        content: sticker.content,
        name: sticker.name,
        stickerType: sticker.type,
        width: sticker.type === 'emoji' ? 40 : 60,
        height: sticker.type === 'emoji' ? 40 : 30,
        fontSize: sticker.type === 'emoji' ? 32 : 16,
        style: sticker.style || {}
      };
      
      onStickerSelect(element);
    }
  };

  const filteredStickers = getFilteredStickers();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sticker Library</h2>
        <p className="text-sm text-gray-600">{filteredStickers.length} items available</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stickers, emojis, symbols..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 active:bg-gray-200'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden text-xs">{category.name.slice(0,3)}</span>
              <span className="bg-white px-1.5 py-0.5 rounded-full text-xs">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
        {filteredStickers.map(sticker => (
          <button
            key={sticker.id}
            onClick={() => handleStickerClick(sticker)}
            className="aspect-square p-2 sm:p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 active:bg-primary-100 transition-colors group relative touch-manipulation"
            title={sticker.name}
          >
            <div className="w-full h-full flex items-center justify-center">
              {sticker.type === 'text' && sticker.style ? (
                <span 
                  style={sticker.style}
                  className="text-xs sm:text-xs whitespace-nowrap"
                >
                  {sticker.content}
                </span>
              ) : (
                <span className={`text-lg sm:text-xl ${sticker.type === 'emoji' ? 'sm:text-2xl' : ''}`}>
                  {sticker.content}
                </span>
              )}
            </div>
            
            {/* Tooltip - Hidden on mobile to avoid touch issues */}
            <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {sticker.name}
            </div>
          </button>
        ))}
      </div>

      {filteredStickers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No stickers found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or browse different categories
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Show All Stickers
          </button>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 How to use stickers</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click any sticker to add it to your canvas</li>
          <li>• Use the search bar to find specific items</li>
          <li>• Browse categories to discover new elements</li>
          <li>• After adding, use the select tool to move and resize</li>
        </ul>
      </div>
    </div>
  );
};

StickerLibrary.propTypes = {
  onStickerSelect: PropTypes.func
};

export default StickerLibrary;