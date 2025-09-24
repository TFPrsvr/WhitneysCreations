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
          id: 'avatar-business-male-1',
          name: 'Business Man',
          creator: 'Nawicon',
          iconPath: '/images/noun-avatar-2309777.svg',
          gender: 'male'
        }
        // More male avatars will be added as you upload them
      ]
    },
    female: {
      name: 'Female Avatars',
      avatars: [
        // Female avatars will be added here as you upload them
        // Examples:
        // {
        //   id: 'avatar-business-female-1',
        //   name: 'Business Woman',
        //   creator: '[Creator Name]',
        //   iconPath: '/images/noun-businesswoman-[number].svg',
        //   gender: 'female'
        // }
      ]
    },
    neutral: {
      name: 'Gender Neutral',
      avatars: [
        // Gender-neutral avatars will be added here
        // Examples:
        // {
        //   id: 'avatar-person-1',
        //   name: 'Person',
        //   creator: '[Creator Name]',
        //   iconPath: '/images/noun-person-[number].svg',
        //   gender: 'neutral'
        // }
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

  // Skin tone options (these would be different versions of the same icon)
  const skinToneOptions = [
    { id: 'default', name: 'Default', color: '#F4D1A6' },
    { id: 'light', name: 'Light', color: '#FDBCB4' },
    { id: 'medium-light', name: 'Medium Light', color: '#F1C27D' },
    { id: 'medium', name: 'Medium', color: '#E0AC69' },
    { id: 'medium-dark', name: 'Medium Dark', color: '#C68642' },
    { id: 'dark', name: 'Dark', color: '#8D5524' }
  ];

  const handleAvatarSelect = (avatar) => {
    const selectedAvatar = {
      ...avatar,
      skinTone: selectedSkinTone,
      iconPath: showSkinTones && selectedSkinTone !== 'default'
        ? `${avatar.iconPath.replace('.svg', '')}-${selectedSkinTone}.svg`
        : avatar.iconPath
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
              style={{filter: 'none'}}
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
        <div style={{marginBottom: '24px'}}>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#374151'
          }}>
            Skin Tone
          </h4>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center'
          }}>
            {skinToneOptions.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedSkinTone(tone.id)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: tone.color,
                  border: selectedSkinTone === tone.id ? '3px solid #3b82f6' : '2px solid #d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedSkinTone === tone.id ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none'
                }}
                title={tone.name}
                aria-label={`Select ${tone.name} skin tone`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div style={{marginBottom: '20px'}}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '16px',
          overflowX: 'auto'
        }}>
          {Object.entries(avatarCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: selectedCategory === key ? '#3b82f6' : '#6b7280',
                borderBottom: selectedCategory === key ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
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
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 12px',
              border: currentAvatar?.id === avatar.id ? '2px solid #3b82f6' : '2px solid #e5e7eb',
              borderRadius: '8px',
              background: currentAvatar?.id === avatar.id ? '#eff6ff' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: '120px'
            }}
            onMouseEnter={(e) => {
              if (currentAvatar?.id !== avatar.id) {
                e.target.style.borderColor = '#9ca3af';
                e.target.style.background = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (currentAvatar?.id !== avatar.id) {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = 'white';
              }
            }}
          >
            <NounProjectIcon
              iconPath={avatar.iconPath}
              iconName={avatar.name}
              creator={avatar.creator}
              size="3rem"
              style={{
                marginBottom: '8px',
                filter: 'none'
              }}
            />
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '500',
              color: '#374151',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {avatar.name}
            </span>
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

      {/* Attribution Notice */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: '#f0f9ff',
        borderRadius: '6px',
        border: '1px solid #bae6fd'
      }}>
        <p style={{
          fontSize: '0.8rem',
          color: '#0c4a6e',
          margin: '0',
          textAlign: 'center'
        }}>
          All avatar icons are from The Noun Project and used under CC BY 3.0 license.
          Full attributions are displayed in the site footer.
        </p>
      </div>
    </div>
  );
};

export default AvatarSelector;