import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserAvatarContext = createContext();

export const useUserAvatar = () => {
  const context = useContext(UserAvatarContext);
  if (!context) {
    throw new Error('useUserAvatar must be used within a UserAvatarProvider');
  }
  return context;
};

export const UserAvatarProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userAvatar, setUserAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default avatar fallback
  const defaultAvatar = {
    id: 'default-avatar',
    name: 'Default Avatar',
    creator: 'Nawicon',
    iconPath: '/images/noun-avatar-2309777.svg',
    gender: 'neutral',
    skinTone: 'default'
  };

  // Load user's saved avatar from localStorage or API
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const savedAvatar = localStorage.getItem(`userAvatar_${user.id}`);
      if (savedAvatar) {
        try {
          const parsedAvatar = JSON.parse(savedAvatar);
          setUserAvatar(parsedAvatar);
        } catch (error) {
          console.error('Error parsing saved avatar:', error);
          setUserAvatar(defaultAvatar);
        }
      } else {
        setUserAvatar(defaultAvatar);
      }
    } else {
      // For guest users, use a default avatar
      setUserAvatar(defaultAvatar);
    }
  }, [user?.id, isAuthenticated]);

  // Save avatar selection
  const updateUserAvatar = async (newAvatar) => {
    setIsLoading(true);

    try {
      // Save to localStorage
      if (isAuthenticated && user?.id) {
        localStorage.setItem(`userAvatar_${user.id}`, JSON.stringify(newAvatar));
      }

      // In the future, you can also save to your API here
      // await api.updateUserAvatar(user.id, newAvatar);

      setUserAvatar(newAvatar);

      // Optional: Show success notification
      console.log('Avatar updated successfully:', newAvatar.name);

    } catch (error) {
      console.error('Error updating avatar:', error);
      // Optionally show error notification to user
    } finally {
      setIsLoading(false);
    }
  };

  // Reset avatar to default
  const resetAvatar = () => {
    updateUserAvatar(defaultAvatar);
  };

  // Get avatar for display (with fallback)
  const getDisplayAvatar = () => {
    return userAvatar || defaultAvatar;
  };

  const contextValue = {
    userAvatar: getDisplayAvatar(),
    updateUserAvatar,
    resetAvatar,
    isLoading,
    hasCustomAvatar: userAvatar && userAvatar.id !== defaultAvatar.id
  };

  return (
    <UserAvatarContext.Provider value={contextValue}>
      {children}
    </UserAvatarContext.Provider>
  );
};

export default UserAvatarContext;