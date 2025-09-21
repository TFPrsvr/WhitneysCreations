export class ImagePreloader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.preloadQueue = [];
    this.isPreloading = false;
    this.maxConcurrentLoads = 3;
    this.activeLoads = 0;
  }

  preloadImage(src) {
    return new Promise((resolve, reject) => {
      // Check if already cached
      if (this.cache.has(src)) {
        resolve(this.cache.get(src));
        return;
      }

      // Check if already loading
      if (this.loadingPromises.has(src)) {
        this.loadingPromises.get(src).then(resolve).catch(reject);
        return;
      }

      // Create loading promise
      const loadingPromise = new Promise((imgResolve, imgReject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          this.cache.set(src, img);
          this.loadingPromises.delete(src);
          this.activeLoads--;
          imgResolve(img);
          this.processQueue();
        };

        img.onerror = (error) => {
          this.loadingPromises.delete(src);
          this.activeLoads--;
          console.error('Failed to preload image:', src, error);
          imgReject(new Error(`Failed to load image: ${src}`));
          this.processQueue();
        };

        img.src = src;
        this.activeLoads++;
      });

      this.loadingPromises.set(src, loadingPromise);
      loadingPromise.then(resolve).catch(reject);
    });
  }

  preloadImages(imageUrls, priority = false) {
    const preloadPromises = imageUrls.map(url => {
      if (priority) {
        return this.preloadImage(url);
      } else {
        // Add to queue for batch loading
        return new Promise((resolve, reject) => {
          this.preloadQueue.push({ url, resolve, reject });
          this.processQueue();
        });
      }
    });

    return Promise.allSettled(preloadPromises);
  }

  processQueue() {
    if (this.activeLoads >= this.maxConcurrentLoads || this.preloadQueue.length === 0) {
      return;
    }

    const { url, resolve, reject } = this.preloadQueue.shift();
    this.preloadImage(url).then(resolve).catch(reject);
  }

  preloadProductImages(productType, color) {
    const productConfig = window.productImageConfig || {};
    const variant = productConfig[productType]?.[color];

    if (!variant?.images) {
      return Promise.resolve([]);
    }

    const imageUrls = variant.images.map(img => img.src);
    return this.preloadImages(imageUrls, true); // High priority for current product
  }

  preloadAllProductVariants(productType) {
    const productConfig = window.productImageConfig || {};
    const product = productConfig[productType];

    if (!product) {
      return Promise.resolve([]);
    }

    const allImageUrls = [];
    Object.values(product).forEach(variant => {
      if (variant.images) {
        variant.images.forEach(img => {
          allImageUrls.push(img.src);
        });
      }
    });

    return this.preloadImages(allImageUrls, false); // Normal priority for background loading
  }

  getImage(src) {
    return this.cache.get(src);
  }

  hasImage(src) {
    return this.cache.has(src);
  }

  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
    this.preloadQueue = [];
  }

  getCacheSize() {
    return this.cache.size;
  }

  getCacheInfo() {
    return {
      cachedImages: this.cache.size,
      loadingImages: this.loadingPromises.size,
      queuedImages: this.preloadQueue.length,
      activeLoads: this.activeLoads
    };
  }
}

// Global instance
export const imagePreloader = new ImagePreloader();

// React hook for using the image preloader
export const useImagePreloader = () => {
  return imagePreloader;
};

// Utility function to preload critical images on app startup
export const preloadCriticalImages = async () => {
  const criticalImages = [
    // Add paths to critical images that should be loaded immediately
    '/images/products/fallback/tshirt-placeholder.jpg',
    '/images/products/fallback/hoodie-placeholder.jpg',
    '/images/products/fallback/mug-placeholder.jpg',
    '/images/products/fallback/hat-placeholder.jpg'
  ];

  try {
    await imagePreloader.preloadImages(criticalImages, true);
    console.log('Critical images preloaded successfully');
  } catch (error) {
    console.error('Error preloading critical images:', error);
  }
};