import React, { useState } from 'react';
import NounProjectIcon from '../Icons/NounProjectIcon';

const AvatarSelector = ({ currentAvatar, onAvatarChange, showSkinTones = true }) => {
  const [selectedCategory, setSelectedCategory] = useState('male');
  const [selectedSkinTone, setSelectedSkinTone] = useState('default');

  // Avatar categories with professional icons
  const avatarCategories = {
    male: {
      name: 'Male Avatars',
      avatars: [
        {
          id: 'avatar-male-3',
          name: 'Male Avatar',
          creator: 'farra nugraha',
          iconPath: '/images/noun-male-avatar-3900376.svg',
          gender: 'male'
        },
        {
          id: 'avatar-male-8',
          name: 'Male Avatar',
          creator: 'farra nugraha',
          iconPath: '/images/noun-male-avatar-5356963.svg',
          gender: 'male'
        },
        {
          id: 'avatar-male-4',
          name: 'Avatar',
          creator: 'Vectors Market',
          iconPath: '/images/noun-avatar-1091062.svg',
          gender: 'male'
        },
        {
          id: 'avatar-male-5',
          name: 'Avatar',
          creator: 'Creative Stall',
          iconPath: '/images/noun-avatar-1091165.svg',
          gender: 'male'
        },
        {
          id: 'avatar-male-6',
          name: 'Avatar',
          creator: 'Vectorstall',
          iconPath: '/images/noun-avatar-1092540.svg',
          gender: 'male'
        },
        {
          id: 'avatar-male-7',
          name: 'Avatar',
          creator: 'Creative Stall',
          iconPath: '/images/noun-avatar-1959662.svg',
          gender: 'male'
        }
        // More male avatars will be added as you upload them
      ]
    },
    female: {
      name: 'Female Avatars',
      avatars: [
        {
          id: 'avatar-female-2',
          name: 'Woman',
          creator: 'Lil Squid',
          iconPath: '/images/noun-woman-29281.svg',
          gender: 'female'
        },
        {
          id: 'avatar-female-3',
          name: 'Woman',
          creator: 'Lil Squid',
          iconPath: '/images/noun-woman-29298.svg',
          gender: 'female'
        },
        {
          id: 'avatar-female-4',
          name: 'Woman',
          creator: 'Lil Squid',
          iconPath: '/images/noun-woman-29300.svg',
          gender: 'female'
        },
        {
          id: 'avatar-female-5',
          name: 'Woman',
          creator: 'Lil Squid',
          iconPath: '/images/noun-woman-29302.svg',
          gender: 'female'
        },
        {
          id: 'avatar-female-6',
          name: 'Female Avatar',
          creator: 'Vectors Point',
          iconPath: '/images/noun-male-actor-avatar-2678214.svg',
          gender: 'female'
        }
      ]
    },
    neutral: {
      name: 'Gender Neutral',
      avatars: [
        {
          id: 'avatar-neutral-1',
          name: 'Professional',
          creator: 'Nawicon',
          iconPath: '/images/noun-avatar-2309777.svg',
          gender: 'neutral'
        }
      ]
    },
    professional: {
      name: 'Professional Roles',
      avatars: [
        // Professional role avatars (doctor, teacher, etc.) will be added here
      ]
    },
    creative: {
      name: 'Creative & Artistic',
      avatars: [
        // Creative avatars (artist, designer, etc.) will be added here
      ]
    },
    diverse: {
      name: 'Diverse & Inclusive',
      avatars: [
        // Diverse representation avatars will be added here
      ]
    }
  };

  // Realistic human skin tone options with proper peach/pink/brown undertones
  const skinToneOptions = [
    { id: 'porcelain', name: 'Porcelain', color: '#FFDFC4', emoji: '🏻' },      // Very light with pink undertone
    { id: 'ivory', name: 'Ivory', color: '#F7D7C4', emoji: '🏻' },              // Light peachy-pink
    { id: 'sand', name: 'Sand', color: '#F0C89E', emoji: '🏼' },                // Light beige with warmth
    { id: 'honey', name: 'Honey', color: '#E8B88B', emoji: '🏼' },              // Honey/golden beige
    { id: 'almond', name: 'Almond', color: '#DFAA73', emoji: '🏽' },            // Medium warm brown
    { id: 'caramel', name: 'Caramel', color: '#C68B59', emoji: '🏽' },          // Rich caramel
    { id: 'bronze', name: 'Bronze', color: '#A57048', emoji: '🏾' },            // Bronze brown
    { id: 'chestnut', name: 'Chestnut', color: '#8D5630', emoji: '🏾' },        // Deep chestnut
    { id: 'mahogany', name: 'Mahogany', color: '#6B3E2E', emoji: '🏿' },        // Rich mahogany
    { id: 'espresso', name: 'Espresso', color: '#4A2C1D', emoji: '🏿' }         // Very deep espresso
  ];

  // Function to get CSS filter for skin tone
  const getSkinToneFilter = (skinToneId) => {
    if (!skinToneId || skinToneId === 'default') return 'none';

    const skinToneFilters = {
      porcelain: 'sepia(0.1) saturate(0.8) brightness(1.2) hue-rotate(-10deg)',
      ivory: 'sepia(0.15) saturate(0.9) brightness(1.15) hue-rotate(-5deg)',
      sand: 'sepia(0.25) saturate(1.1) brightness(1.1) hue-rotate(5deg)',
      honey: 'sepia(0.35) saturate(1.3) brightness(1.05) hue-rotate(10deg)',
      almond: 'sepia(0.45) saturate(1.4) brightness(1.0) hue-rotate(15deg)',
      caramel: 'sepia(0.55) saturate(1.5) brightness(0.95) hue-rotate(20deg)',
      bronze: 'sepia(0.65) saturate(1.6) brightness(0.85) hue-rotate(25deg)',
      chestnut: 'sepia(0.75) saturate(1.7) brightness(0.75) hue-rotate(30deg)',
      mahogany: 'sepia(0.85) saturate(1.8) brightness(0.65) hue-rotate(35deg)',
      espresso: 'sepia(0.95) saturate(2.0) brightness(0.55) hue-rotate(40deg)'
    };

    return skinToneFilters[skinToneId] || 'none';
  };

  const handleAvatarSelect = (avatar) => {
    const selectedAvatar = {
      ...avatar,
      skinTone: selectedSkinTone,
      skinToneFilter: getSkinToneFilter(selectedSkinTone)
    };
    onAvatarChange(selectedAvatar);
  };

  return (
    <div className="avatar-selector" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      width: '100%'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#1f2937',
        textAlign: 'center'
      }}>
        Choose Your Avatar
      </h3>

      {/* Current Selection Display */}
      {currentAvatar && (
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          padding: '16px',
          background: '#f3f4f6',
          borderRadius: '8px',
          border: '2px solid #e5e7eb'
        }}>
          <div style={{marginBottom: '12px'}}>
            <NounProjectIcon
              iconPath={currentAvatar.iconPath}
              iconName={currentAvatar.name}
              creator={currentAvatar.creator}
              size="4rem"
              style={{filter: currentAvatar.skinToneFilter || getSkinToneFilter(selectedSkinTone)}}
            />
          </div>
          <p style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0'
          }}>
            Current: {currentAvatar.name}
          </p>
        </div>
      )}

      {/* Skin Tone Selector */}
      {showSkinTones && (
        <div style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1f2937',
            textAlign: 'center'
          }}>
            Choose Skin Tone
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {skinToneOptions.map((tone) => (
              <div key={tone.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}>
                <button
                  onClick={() => setSelectedSkinTone(tone.id)}
                  className="skin-tone-button"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: tone.color,
                    backgroundColor: tone.color,
                    border: selectedSkinTone === tone.id ? '4px solid #3b82f6' : '3px solid #ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: selectedSkinTone === tone.id
                      ? '0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transform: selectedSkinTone === tone.id ? 'scale(1.1)' : 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0
                  }}
                  title={tone.name}
                  aria-label={`Select ${tone.name} skin tone`}
                  onMouseEnter={(e) => {
                    if (selectedSkinTone !== tone.id) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSkinTone !== tone.id) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  {selectedSkinTone === tone.id && (
                    <span style={{
                      color: 'white',
                      fontSize: '1.2rem',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                      fontWeight: 'bold'
                    }}>✓</span>
                  )}
                </button>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: selectedSkinTone === tone.id ? '700' : '500',
                  color: selectedSkinTone === tone.id ? '#3b82f6' : '#6b7280',
                  textAlign: 'center',
                  lineHeight: '1.1',
                  maxWidth: '60px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{tone.name}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#6b7280',
            fontStyle: 'italic'
          }}>
            Selected: <strong style={{color: '#1f2937'}}>{skinToneOptions.find(t => t.id === selectedSkinTone)?.name}</strong>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div style={{marginBottom: '20px'}}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '16px'
        }}>
          {Object.entries(avatarCategories)
            .filter(([key, category]) => category.avatars.length > 0)
            .map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                padding: '12px 10px',
                border: '2px solid #e5e7eb',
                background: selectedCategory === key ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 'white',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: selectedCategory === key ? '#ffffff' : '#6b7280',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'normal',
                textAlign: 'center',
                boxShadow: selectedCategory === key ? '0 2px 8px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                lineHeight: '1.3',
                minHeight: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== key) {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== key) {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#e5e7eb';
                }
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Avatar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {avatarCategories[selectedCategory]?.avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleAvatarSelect(avatar)}
            title=""
            aria-label={`Select ${avatar.name}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: '80px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <NounProjectIcon
              iconPath={avatar.iconPath}
              iconName={avatar.name}
              creator={avatar.creator}
              size="3rem"
              style={{
                filter: getSkinToneFilter(selectedSkinTone)
              }}
            />
          </button>
        ))}
      </div>

      {/* Empty State */}
      {(!avatarCategories[selectedCategory]?.avatars || avatarCategories[selectedCategory].avatars.length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#6b7280'
        }}>
          <p style={{fontSize: '1rem', marginBottom: '8px'}}>
            More {avatarCategories[selectedCategory]?.name} avatars coming soon!
          </p>
          <p style={{fontSize: '0.9rem'}}>
            We're constantly adding new professional avatar options.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;