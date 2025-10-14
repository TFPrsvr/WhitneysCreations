/**
 * Mockup API Integration Service
 * Integrates with multiple mockup generation platforms
 */

// API Configuration
const MOCKUP_APIS = {
  printful: {
    baseUrl: 'https://api.printful.com',
    apiKey: process.env.REACT_APP_PRINTFUL_API_KEY || '',
    enabled: false, // Enable when API key is configured
  },
  printify: {
    baseUrl: 'https://api.printify.com/v1',
    apiKey: process.env.REACT_APP_PRINTIFY_API_KEY || '',
    enabled: false,
  },
  mockey: {
    baseUrl: 'https://api.mockey.ai/v1',
    apiKey: process.env.REACT_APP_MOCKEY_API_KEY || '',
    enabled: false,
  },
  placeit: {
    baseUrl: 'https://api.placeit.net/v1',
    apiKey: process.env.REACT_APP_PLACEIT_API_KEY || '',
    enabled: false,
  },
};

/**
 * Printful API Integration
 */
export const printfulAPI = {
  /**
   * Get available products from Printful
   */
  getProducts: async () => {
    if (!MOCKUP_APIS.printful.enabled) {
      return { success: false, error: 'Printful API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.printful.baseUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.printful.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Printful API Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate mockup with Printful
   */
  generateMockup: async (productId, designUrl, options = {}) => {
    if (!MOCKUP_APIS.printful.enabled) {
      return { success: false, error: 'Printful API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.printful.baseUrl}/mockup-generator/create-task/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.printful.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variant_ids: options.variantIds || [],
          format: options.format || 'jpg',
          files: [
            {
              placement: options.placement || 'front',
              image_url: designUrl,
              position: {
                area_width: options.width || 1800,
                area_height: options.height || 2400,
                width: options.designWidth || 1800,
                height: options.designHeight || 2400,
                top: options.top || 0,
                left: options.left || 0,
              },
            },
          ],
        }),
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Printful Mockup Generation Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check mockup generation status
   */
  getMockupStatus: async (taskKey) => {
    if (!MOCKUP_APIS.printful.enabled) {
      return { success: false, error: 'Printful API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.printful.baseUrl}/mockup-generator/task?task_key=${taskKey}`, {
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.printful.apiKey}`,
        },
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Printful Status Check Error:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * Printify API Integration
 */
export const printifyAPI = {
  /**
   * Get shop products from Printify
   */
  getProducts: async (shopId) => {
    if (!MOCKUP_APIS.printify.enabled) {
      return { success: false, error: 'Printify API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.printify.baseUrl}/shops/${shopId}/products.json`, {
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.printify.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Printify API Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload image to Printify
   */
  uploadImage: async (shopId, imageData) => {
    if (!MOCKUP_APIS.printify.enabled) {
      return { success: false, error: 'Printify API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.printify.baseUrl}/shops/${shopId}/uploads/images.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.printify.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_name: imageData.fileName,
          contents: imageData.base64,
        }),
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Printify Upload Error:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * Mockey.ai API Integration
 */
export const mockeyAPI = {
  /**
   * Generate AI-powered mockup
   */
  generateMockup: async (productType, designUrl, options = {}) => {
    if (!MOCKUP_APIS.mockey.enabled) {
      return { success: false, error: 'Mockey API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.mockey.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.mockey.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_type: productType,
          design_url: designUrl,
          background: options.background || 'transparent',
          angle: options.angle || 'front',
          resolution: options.resolution || 'high',
        }),
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Mockey API Error:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * Placeit API Integration
 */
export const placeitAPI = {
  /**
   * Get mockup templates
   */
  getTemplates: async (category) => {
    if (!MOCKUP_APIS.placeit.enabled) {
      return { success: false, error: 'Placeit API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.placeit.baseUrl}/templates?category=${category}`, {
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.placeit.apiKey}`,
        },
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Placeit API Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate mockup from template
   */
  generateFromTemplate: async (templateId, designUrl, options = {}) => {
    if (!MOCKUP_APIS.placeit.enabled) {
      return { success: false, error: 'Placeit API not configured' };
    }

    try {
      const response = await fetch(`${MOCKUP_APIS.placeit.baseUrl}/mockups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MOCKUP_APIS.placeit.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
          design_url: designUrl,
          format: options.format || 'png',
          quality: options.quality || 'high',
        }),
      });

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Placeit Generation Error:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * Unified Mockup Service
 * Provides fallback and selection logic for best available API
 */
export const mockupService = {
  /**
   * Get available mockup services
   */
  getAvailableServices: () => {
    return Object.entries(MOCKUP_APIS)
      .filter(([_, config]) => config.enabled)
      .map(([name]) => name);
  },

  /**
   * Generate mockup using best available service
   */
  generateMockup: async (productType, designUrl, options = {}) => {
    const availableServices = mockupService.getAvailableServices();

    if (availableServices.length === 0) {
      return {
        success: false,
        error: 'No mockup APIs configured. Using local mockup generation.',
        fallback: true,
      };
    }

    // Try services in priority order
    const servicePriority = ['printful', 'mockey', 'printify', 'placeit'];

    for (const serviceName of servicePriority) {
      if (availableServices.includes(serviceName)) {
        try {
          let result;
          switch (serviceName) {
            case 'printful':
              result = await printfulAPI.generateMockup(productType, designUrl, options);
              break;
            case 'printify':
              if (options.shopId) {
                result = await printifyAPI.uploadImage(options.shopId, { fileName: 'design.png', base64: designUrl });
              }
              break;
            case 'mockey':
              result = await mockeyAPI.generateMockup(productType, designUrl, options);
              break;
            case 'placeit':
              if (options.templateId) {
                result = await placeitAPI.generateFromTemplate(options.templateId, designUrl, options);
              }
              break;
            default:
              continue;
          }

          if (result && result.success) {
            return { ...result, service: serviceName };
          }
        } catch (error) {
          console.error(`${serviceName} failed, trying next service...`, error);
          continue;
        }
      }
    }

    return {
      success: false,
      error: 'All mockup services failed. Using local generation.',
      fallback: true,
    };
  },

  /**
   * Check if any mockup service is configured
   */
  isConfigured: () => {
    return mockupService.getAvailableServices().length > 0;
  },
};

export default mockupService;
