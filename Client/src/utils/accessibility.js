/**
 * Accessibility utility functions for Whitney's Creations
 * Provides focus management, keyboard navigation, and screen reader support
 */

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Trap focus within a container
   * @param {HTMLElement} container - The container to trap focus within
   * @returns {Function} cleanup function to remove event listeners
   */
  trapFocus: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus the first element
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Move focus to element and announce to screen readers
   * @param {HTMLElement|string} element - Element or selector to focus
   * @param {string} announcement - Optional announcement for screen readers
   */
  moveFocusTo: (element, announcement) => {
    const targetElement = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (targetElement) {
      targetElement.focus();

      if (announcement) {
        announceToScreenReader(announcement);
      }
    }
  },

  /**
   * Create a skip link for keyboard navigation
   * @param {string} targetId - ID of the target element
   * @param {string} text - Text for the skip link
   * @returns {HTMLElement} Skip link element
   */
  createSkipLink: (targetId, text = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });

    return skipLink;
  }
};

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Create live region for dynamic content updates
   * @param {string} id - ID for the live region
   * @param {string} priority - 'polite' or 'assertive'
   * @returns {HTMLElement} Live region element
   */
  createLiveRegion: (id, priority = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';

    document.body.appendChild(liveRegion);
    return liveRegion;
  },

  /**
   * Update live region content
   * @param {string} regionId - ID of the live region
   * @param {string} message - Message to announce
   */
  updateLiveRegion: (regionId, message) => {
    const region = document.getElementById(regionId);
    if (region) {
      region.textContent = message;
    }
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation in a list
   * @param {Event} e - Keyboard event
   * @param {NodeList} items - List of focusable items
   * @param {number} currentIndex - Current focused item index
   * @returns {number} New focused item index
   */
  handleArrowKeys: (e, items, currentIndex) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % items.length;
        e.preventDefault();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = items.length - 1;
        e.preventDefault();
        break;
    }

    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
    }

    return newIndex;
  },

  /**
   * Handle escape key to close modals/dropdowns
   * @param {Event} e - Keyboard event
   * @param {Function} closeCallback - Function to call when escape is pressed
   */
  handleEscape: (e, closeCallback) => {
    if (e.key === 'Escape') {
      closeCallback();
      e.preventDefault();
    }
  },

  /**
   * Handle enter/space key activation
   * @param {Event} e - Keyboard event
   * @param {Function} activateCallback - Function to call when activated
   */
  handleActivation: (e, activateCallback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      activateCallback(e);
      e.preventDefault();
    }
  }
};

/**
 * Form accessibility utilities
 */
export const formAccessibility = {
  /**
   * Associate error message with form field
   * @param {HTMLElement} field - Form field element
   * @param {HTMLElement} errorElement - Error message element
   */
  associateError: (field, errorElement) => {
    if (field && errorElement) {
      field.setAttribute('aria-describedby', errorElement.id);
      field.setAttribute('aria-invalid', 'true');
    }
  },

  /**
   * Clear error association from form field
   * @param {HTMLElement} field - Form field element
   * @param {HTMLElement} errorElement - Error message element
   */
  clearError: (field, errorElement) => {
    if (field) {
      field.removeAttribute('aria-describedby');
      field.setAttribute('aria-invalid', 'false');
    }
  },

  /**
   * Validate form and announce results
   * @param {HTMLFormElement} form - Form element
   * @param {Object} errors - Validation errors object
   */
  announceValidation: (form, errors) => {
    const errorCount = Object.keys(errors).length;

    if (errorCount > 0) {
      const message = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please correct the following fields: ${Object.keys(errors).join(', ')}.`;
      screenReader.announce(message, 'assertive');

      // Focus first error field
      const firstErrorField = form.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      if (firstErrorField) {
        firstErrorField.focus();
      }
    } else {
      screenReader.announce('Form submitted successfully', 'polite');
    }
  }
};

/**
 * Color contrast utilities
 */
export const colorContrast = {
  /**
   * Calculate relative luminance of a color
   * @param {number} r - Red value (0-255)
   * @param {number} g - Green value (0-255)
   * @param {number} b - Blue value (0-255)
   * @returns {number} Relative luminance
   */
  getLuminance: (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color (hex format)
   * @param {string} color2 - Second color (hex format)
   * @returns {number} Contrast ratio
   */
  getContrastRatio: (color1, color2) => {
    const rgb1 = colorContrast.hexToRgb(color1);
    const rgb2 = colorContrast.hexToRgb(color2);

    const lum1 = colorContrast.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = colorContrast.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color string
   * @returns {Object} RGB values
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Check if color combination meets WCAG contrast requirements
   * @param {string} foreground - Foreground color (hex)
   * @param {string} background - Background color (hex)
   * @param {string} level - 'AA' or 'AAA'
   * @param {string} size - 'normal' or 'large'
   * @returns {boolean} Whether contrast is sufficient
   */
  meetsWCAG: (foreground, background, level = 'AA', size = 'normal') => {
    const ratio = colorContrast.getContrastRatio(foreground, background);

    const requirements = {
      AA: { normal: 4.5, large: 3 },
      AAA: { normal: 7, large: 4.5 }
    };

    return ratio >= requirements[level][size];
  }
};

/**
 * Global accessibility helpers
 */
export const accessibility = {
  /**
   * Initialize accessibility features for the application
   */
  init: () => {
    // Create skip links
    const skipToMain = focusManagement.createSkipLink('main-content');
    const skipToNav = focusManagement.createSkipLink('main-navigation', 'Skip to navigation');

    document.body.prepend(skipToMain, skipToNav);

    // Create global live region for announcements
    screenReader.createLiveRegion('global-announcements');

    // Add global keyboard event listeners
    document.addEventListener('keydown', (e) => {
      // Alt + 1: Skip to main content
      if (e.altKey && e.key === '1') {
        focusManagement.moveFocusTo('#main-content');
        e.preventDefault();
      }

      // Alt + 2: Skip to navigation
      if (e.altKey && e.key === '2') {
        focusManagement.moveFocusTo('#main-navigation');
        e.preventDefault();
      }
    });
  },

  /**
   * Announce page changes for single-page applications
   * @param {string} pageTitle - Title of the new page
   * @param {string} routePath - Route path
   */
  announcePageChange: (pageTitle, routePath) => {
    const message = `Navigated to ${pageTitle}`;
    screenReader.announce(message, 'polite');

    // Update document title
    document.title = `${pageTitle} - Whitney's Creations`;
  },

  /**
   * Announce loading states
   * @param {boolean} isLoading - Whether content is loading
   * @param {string} context - Context of what's loading
   */
  announceLoading: (isLoading, context = 'content') => {
    const message = isLoading
      ? `Loading ${context}...`
      : `${context} loaded`;

    screenReader.announce(message, 'polite');
  }
};

// Convenience export for announcing to screen readers
export const announceToScreenReader = screenReader.announce;

export default accessibility;