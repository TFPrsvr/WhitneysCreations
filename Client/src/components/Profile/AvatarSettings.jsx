import React, { useState } from 'react';
import { useUserAvatar } from '../../contexts/UserAvatarContext';
import AvatarSelector from '../Avatar/AvatarSelector';
import NounProjectIcon from '../Icons/NounProjectIcon';

const AvatarSettings = () => {
  const { userAvatar, updateUserAvatar, resetAvatar, isLoading, hasCustomAvatar } = useUserAvatar();
  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarChange = (newAvatar) => {
    updateUserAvatar(newAvatar);
    setIsEditing(false);
  };

  const handleReset = () => {
    resetAvatar();
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1f2937'
          }}>
            Avatar Settings
          </h2>

          {/* Current Avatar Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '24px',
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              border: '3px solid #e5e7eb'
            }}>
              <NounProjectIcon
                iconPath={userAvatar.iconPath}
                iconName={userAvatar.name}
                creator={userAvatar.creator}
                size="3.5rem"
                style={{filter: 'none'}}
              />
            </div>

            <div style={{flex: 1}}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                Current Avatar: {userAvatar.name}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: '0 0 8px 0'
              }}>
                {userAvatar.gender && (
                  <span style={{
                    display: 'inline-block',
                    background: '#e0e7ff',
                    color: '#3730a3',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    marginRight: '8px'
                  }}>
                    {userAvatar.gender}
                  </span>
                )}
                {userAvatar.skinTone && userAvatar.skinTone !== 'default' && (
                  <span style={{
                    display: 'inline-block',
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {userAvatar.skinTone.replace('-', ' ')}
                  </span>
                )}
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: '#9ca3af',
                margin: '0'
              }}>
                Icon by {userAvatar.creator} from The Noun Project
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: isEditing ? '24px' : '0'
          }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
              style={{
                background: isEditing ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = isEditing ? '#dc2626' : '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = isEditing ? '#ef4444' : '#3b82f6';
                }
              }}
            >
              {isLoading ? 'Saving...' : (isEditing ? 'Cancel' : 'Change Avatar')}
            </button>

            {hasCustomAvatar && (
              <button
                onClick={handleReset}
                disabled={isLoading}
                style={{
                  background: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#d1d5db';
                  }
                }}
              >
                Reset to Default
              </button>
            )}
          </div>

          {/* Avatar Selector */}
          {isEditing && (
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '24px'
            }}>
              <AvatarSelector
                currentAvatar={userAvatar}
                onAvatarChange={handleAvatarChange}
                showSkinTones={true}
              />
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#0c4a6e',
            margin: '0 0 8px 0'
          }}>
            💡 Avatar Tips
          </h4>
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            color: '#0369a1',
            fontSize: '0.9rem'
          }}>
            <li>Your avatar represents you across PrintCraft</li>
            <li>Choose from male, female, or gender-neutral options</li>
            <li>Customize skin tone to better represent yourself</li>
            <li>More avatar options are added regularly</li>
            <li>All avatars are professional, high-quality icons</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvatarSettings;