import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { productAPI } from '../../utils/api';
import { productImageConfig, getProductImage, getProductVariant, getAllProductTypes, getAvailableColors } from '../../data/productImages';
import { useImagePreloader } from '../../utils/imagePreloader';

const MockupGenerator = ({ design, onExport }) => {
  const { isAuthenticated, user } = useAuth();
  const imagePreloader = useImagePreloader();
  const canvasRef = useRef(null);
  const [selectedMockup, setSelectedMockup] = useState('tshirts');
  const [selectedColor, setSelectedColor] = useState('white');
  const [currentAngle, setCurrentAngle] = useState(0);
  const [mockupSettings, setMockupSettings] = useState({
    backgroundColor: '#f0f0f0',
    shadowIntensity: 0.3,
    designScale: 0.8,
    designX: 0,
    designY: 0,
    rotation: 0,
    mockupColor: '#ffffff'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [imageLoadingStatus, setImageLoadingStatus] = useState('idle');
  const [performanceMode, setPerformanceMode] = useState('balanced');
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState(false);
  const [designLayers, setDesignLayers] = useState([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [nextLayerId, setNextLayerId] = useState(1);
  const [isHoveringDesign, setIsHoveringDesign] = useState(false);
  const [dragPreview, setDragPreview] = useState(null);

  // Available mockup templates - now dynamic from configuration
  const mockupTemplates = [
    {
      id: 'tshirts',
      name: 'T-Shirt',
      category: 'Apparel',
      icon: '👕',
      isPremium: false,
      dimensions: { width: 400, height: 500 },
      description: 'Classic crew neck t-shirt mockup'
    },
    {
      id: 'hoodies',
      name: 'Hoodie',
      category: 'Apparel',
      icon: '🧥',
      isPremium: true,
      dimensions: { width: 400, height: 500 },
      description: 'Comfortable pullover hoodie'
    },
    {
      id: 'mugs',
      name: 'Coffee Mug',
      category: 'Drinkware',
      icon: '☕',
      isPremium: false,
      dimensions: { width: 400, height: 400 },
      description: '11oz white ceramic mug'
    },
    {
      id: 'hats',
      name: 'Baseball Cap',
      category: 'Apparel',
      icon: '🧢',
      isPremium: true,
      dimensions: { width: 400, height: 300 },
      description: 'Adjustable baseball cap'
    },
    {
      id: 'mousepads',
      name: 'Mouse Pad',
      category: 'Office',
      icon: '🖱️',
      isPremium: false,
      dimensions: { width: 400, height: 300 },
      description: 'Gaming mouse pad'
    },
    {
      id: 'totebags',
      name: 'Tote Bag',
      category: 'Bags',
      icon: '👜',
      isPremium: true,
      dimensions: { width: 400, height: 450 },
      description: 'Canvas tote bag'
    },
    {
      id: 'phonecases',
      name: 'Phone Case',
      category: 'Accessories',
      icon: '📱',
      isPremium: true,
      dimensions: { width: 200, height: 400 },
      description: 'iPhone compatible case'
    },
    {
      id: 'stickers',
      name: 'Sticker',
      category: 'Stickers',
      icon: '🏷️',
      isPremium: false,
      dimensions: { width: 200, height: 200 },
      description: 'Vinyl sticker 3x3 inch'
    }
  ];

  const categories = [...new Set(mockupTemplates.map(m => m.category))];

  const currentMockup = mockupTemplates.find(m => m.id === selectedMockup);
  const currentVariant = getProductVariant(selectedMockup, selectedColor);
  const availableColors = getAvailableColors(selectedMockup);
  const currentImageSrc = getProductImage(selectedMockup, selectedColor, currentAngle);

  // Load products for mockups and preload initial images
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await productAPI.getProducts({ category: 'apparel', limit: 20 });
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    // Intelligent image preloading based on performance mode
    const preloadInitialImages = async () => {
      try {
        setPreloadProgress(0);

        // Always preload current selection immediately
        await imagePreloader.preloadProductImages(selectedMockup, selectedColor);
        setPreloadProgress(25);

        // Performance-based preloading strategy
        if (performanceMode === 'high') {
          // Preload all available angles for current product
          const currentProduct = currentVariant;
          if (currentProduct?.images) {
            const allAngles = currentProduct.images.map(img => img.src);
            await imagePreloader.preloadImages(allAngles, false);
          }
          setPreloadProgress(50);

          // Preload next/previous products in template list
          const currentIndex = mockupTemplates.findIndex(t => t.id === selectedMockup);
          const nextProducts = [];

          if (currentIndex > 0) nextProducts.push(mockupTemplates[currentIndex - 1].id);
          if (currentIndex < mockupTemplates.length - 1) nextProducts.push(mockupTemplates[currentIndex + 1].id);

          for (const productId of nextProducts) {
            await imagePreloader.preloadProductImages(productId, selectedColor);
          }
          setPreloadProgress(75);

        } else if (performanceMode === 'balanced') {
          // Preload critical variants in background with delay
          setTimeout(async () => {
            const priorityProducts = ['tshirts', 'hoodies', 'mugs'];
            let loaded = 0;

            for (const product of priorityProducts) {
              if (product !== selectedMockup) {
                await imagePreloader.preloadProductImages(product, 'white');
                loaded++;
                setPreloadProgress(25 + (loaded / priorityProducts.length) * 50);
              }
            }
          }, 200);

        } else if (performanceMode === 'low') {
          // Only preload on user interaction
          setPreloadProgress(100);
        }

        // Preload next angles for smooth navigation
        const variant = currentVariant;
        if (variant?.images) {
          imagePreloader.preloadNextImages(currentAngle, variant.images, 2);
        }

        setPreloadProgress(100);
      } catch (error) {
        console.error('Error preloading images:', error);
        setPreloadProgress(100);
      }
    };

    fetchProducts();
    preloadInitialImages();
  }, []);

  // Generate mockup on canvas
  useEffect(() => {
    generateMockup();
  }, [selectedMockup, selectedColor, currentAngle, mockupSettings, designLayers, activeLayerIndex]);

  // Smart preloading when user changes selections
  useEffect(() => {
    const preloadRelatedImages = async () => {
      // Preload other colors for current product
      const availableColors = getAvailableColors(selectedMockup);
      const otherColors = availableColors.filter(color => color !== selectedColor);

      if (otherColors.length > 0 && performanceMode !== 'low') {
        // Preload the first alternative color
        setTimeout(() => {
          imagePreloader.preloadProductImages(selectedMockup, otherColors[0]);
        }, 100);
      }

      // Preload neighboring angles for current selection
      const variant = currentVariant;
      if (variant?.images && performanceMode === 'high') {
        await imagePreloader.preloadNextImages(currentAngle, variant.images, 3);
      }
    };

    preloadRelatedImages();
  }, [selectedMockup, selectedColor, performanceMode]);

  // Drag and drop handlers for canvas
  const handleMouseDown = (e) => {
    if (!dragMode || designLayers.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Check if click is within any layer (starting from top layer)
    const activeLayer = designLayers[activeLayerIndex];
    if (!activeLayer || !currentVariant?.designArea) return;

    const designArea = currentVariant.designArea;
    const { width, height } = currentMockup.dimensions;

    const layerX = width * (designArea.x + mockupSettings.designX + activeLayer.position.x);
    const layerY = height * (designArea.y + mockupSettings.designY + activeLayer.position.y);
    const layerWidth = width * designArea.width * mockupSettings.designScale * activeLayer.scale;
    const layerHeight = height * designArea.height * mockupSettings.designScale * activeLayer.scale;

    if (mouseX >= layerX && mouseX <= layerX + layerWidth &&
        mouseY >= layerY && mouseY <= layerY + layerHeight) {
      setIsDragging(true);
      setDragStart({
        x: mouseX - layerX,
        y: mouseY - layerY
      });

      // Create drag preview effect
      setDragPreview({
        x: layerX,
        y: layerY,
        width: layerWidth,
        height: layerHeight
      });

      canvas.style.cursor = 'grabbing';
      canvas.classList.add('dragging');
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Handle dragging
    if (isDragging && dragMode && designLayers.length > 0) {
      const activeLayer = designLayers[activeLayerIndex];
      const designArea = currentVariant?.designArea;
      if (!designArea || !activeLayer) return;

      const { width, height } = currentMockup.dimensions;

      // Calculate new relative position for the active layer
      const newX = (mouseX - dragStart.x - width * designArea.x) / width;
      const newY = (mouseY - dragStart.y - height * designArea.y) / height;

      // Constrain to reasonable bounds
      const maxOffset = 0.3;
      const constrainedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
      const constrainedY = Math.max(-maxOffset, Math.min(maxOffset, newY));

      // Update the layer position
      updateLayer(activeLayerIndex, {
        position: { x: constrainedX, y: constrainedY }
      });

      // Update drag preview
      const layerX = width * (designArea.x + mockupSettings.designX + constrainedX);
      const layerY = height * (designArea.y + mockupSettings.designY + constrainedY);
      const layerWidth = width * designArea.width * mockupSettings.designScale * activeLayer.scale;
      const layerHeight = height * designArea.height * mockupSettings.designScale * activeLayer.scale;

      setDragPreview({
        x: layerX,
        y: layerY,
        width: layerWidth,
        height: layerHeight
      });
    } else if (dragMode && designLayers.length > 0) {
      // Handle hover detection for visual feedback
      const activeLayer = designLayers[activeLayerIndex];
      const designArea = currentVariant?.designArea;
      if (!designArea || !activeLayer) return;

      const { width, height } = currentMockup.dimensions;
      const layerX = width * (designArea.x + mockupSettings.designX + activeLayer.position.x);
      const layerY = height * (designArea.y + mockupSettings.designY + activeLayer.position.y);
      const layerWidth = width * designArea.width * mockupSettings.designScale * activeLayer.scale;
      const layerHeight = height * designArea.height * mockupSettings.designScale * activeLayer.scale;

      const isHovering = mouseX >= layerX && mouseX <= layerX + layerWidth &&
                        mouseY >= layerY && mouseY <= layerY + layerHeight;

      setIsHoveringDesign(isHovering);
      canvas.style.cursor = isHovering ? 'grab' : 'default';
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragPreview(null);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = dragMode && isHoveringDesign ? 'grab' : 'default';
        canvas.classList.remove('dragging');
      }
    }
  };

  const handleMouseEnter = (e) => {
    // Initial cursor setup when entering canvas
    if (dragMode && designLayers.length > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = 'default';
      }
    }
  };

  const handleMouseLeave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
      canvas.classList.remove('dragging');
    }
    setIsHoveringDesign(false);
    setDragPreview(null);
  };

  // Keyboard support for drag mode
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setDragMode(!dragMode);
      }
      if (e.key === 'Escape' && isDragging) {
        setIsDragging(false);
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.style.cursor = dragMode ? 'grab' : 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dragMode, isDragging]);

  // Initialize first layer when design is provided
  useEffect(() => {
    if (design && designLayers.length === 0) {
      const initialLayer = {
        id: nextLayerId,
        name: 'Design Layer 1',
        design: design,
        visible: true,
        opacity: 1,
        position: { x: 0, y: 0 },
        scale: 1,
        rotation: 0,
        blendMode: 'normal',
        zIndex: 1
      };
      setDesignLayers([initialLayer]);
      setNextLayerId(prev => prev + 1);
      setActiveLayerIndex(0);
    }
  }, [design, designLayers.length, nextLayerId]);

  // Layer management functions
  const addLayer = (newDesign = null) => {
    const newLayer = {
      id: nextLayerId,
      name: `Layer ${nextLayerId}`,
      design: newDesign || design,
      visible: true,
      opacity: 1,
      position: { x: 0, y: 0 },
      scale: 1,
      rotation: 0,
      blendMode: 'normal',
      zIndex: designLayers.length + 1
    };
    setDesignLayers(prev => [...prev, newLayer]);
    setActiveLayerIndex(designLayers.length);
    setNextLayerId(prev => prev + 1);
  };

  const removeLayer = (layerIndex) => {
    if (designLayers.length <= 1) return; // Keep at least one layer

    const newLayers = designLayers.filter((_, index) => index !== layerIndex);
    setDesignLayers(newLayers);

    // Adjust active layer index
    if (activeLayerIndex >= newLayers.length) {
      setActiveLayerIndex(newLayers.length - 1);
    } else if (activeLayerIndex > layerIndex) {
      setActiveLayerIndex(activeLayerIndex - 1);
    }
  };

  const updateLayer = (layerIndex, updates) => {
    setDesignLayers(prev => prev.map((layer, index) =>
      index === layerIndex ? { ...layer, ...updates } : layer
    ));
  };

  const moveLayer = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const newLayers = [...designLayers];
    const [movedLayer] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, movedLayer);

    // Update z-indices
    newLayers.forEach((layer, index) => {
      layer.zIndex = index + 1;
    });

    setDesignLayers(newLayers);
    setActiveLayerIndex(toIndex);
  };

  const duplicateLayer = (layerIndex) => {
    const originalLayer = designLayers[layerIndex];
    if (!originalLayer) return;

    const duplicatedLayer = {
      ...originalLayer,
      id: nextLayerId,
      name: `${originalLayer.name} Copy`,
      position: {
        x: originalLayer.position.x + 0.05,
        y: originalLayer.position.y + 0.05
      },
      zIndex: designLayers.length + 1
    };

    setDesignLayers(prev => [...prev, duplicatedLayer]);
    setActiveLayerIndex(designLayers.length);
    setNextLayerId(prev => prev + 1);
  };

  const generateMockup = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentMockup || !currentImageSrc) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = currentMockup.dimensions;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = mockupSettings.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    try {
      // Load and draw product image
      await drawProductImage(ctx, width, height);

      // Draw design layers if any exist
      if (designLayers.length > 0 && currentVariant) {
        drawDesignOnMockup(ctx, width, height);
      }

      // Add shadow/lighting effects
      addMockupEffects(ctx, width, height);
    } catch (error) {
      console.error('Error generating mockup:', error);
      // Fallback to drawing basic shape
      drawMockupBase(ctx, width, height);
      if (designLayers.length > 0 && currentVariant) {
        drawDesignOnMockup(ctx, width, height);
      }
    }
  };

  const drawProductImage = async (ctx, width, height) => {
    if (!currentImageSrc) return;

    try {
      setImageLoadingStatus('loading');

      // Check if image is already cached in preloader
      if (imagePreloader.hasImage(currentImageSrc)) {
        const img = imagePreloader.getImage(currentImageSrc);
        ctx.drawImage(img, 0, 0, width, height);
        setImageLoadingStatus('loaded');
        return;
      }

      // Preload the image
      const img = await imagePreloader.preloadImage(currentImageSrc);
      ctx.drawImage(img, 0, 0, width, height);
      setImageLoadingStatus('loaded');
    } catch (error) {
      console.error('Failed to load product image:', currentImageSrc, error);
      setImageLoadingStatus('error');
      throw error;
    }
  };

  const drawMockupBase = (ctx, width, height) => {
    ctx.save();
    
    switch (selectedMockup) {
      case 'tshirt':
        drawTShirt(ctx, width, height);
        break;
      case 'hoodie':
        drawHoodie(ctx, width, height);
        break;
      case 'mug':
        drawMug(ctx, width, height);
        break;
      case 'poster':
        drawPoster(ctx, width, height);
        break;
      case 'phonecase':
        drawPhoneCase(ctx, width, height);
        break;
      case 'totebag':
        drawToteBag(ctx, width, height);
        break;
      case 'sticker':
        drawSticker(ctx, width, height);
        break;
      case 'cap':
        drawCap(ctx, width, height);
        break;
      default:
        // Default rectangle
        ctx.fillStyle = mockupSettings.mockupColor;
        ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    }
    
    ctx.restore();
  };

  // Individual mockup drawing functions
  const drawTShirt = (ctx, width, height) => {
    ctx.fillStyle = mockupSettings.mockupColor;
    
    // T-shirt body
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.3);
    ctx.lineTo(width * 0.2, height * 0.25);
    ctx.lineTo(width * 0.15, height * 0.3);
    ctx.lineTo(width * 0.15, height * 0.35);
    ctx.lineTo(width * 0.2, height * 0.4);
    ctx.lineTo(width * 0.2, height * 0.85);
    ctx.lineTo(width * 0.8, height * 0.85);
    ctx.lineTo(width * 0.8, height * 0.4);
    ctx.lineTo(width * 0.85, height * 0.35);
    ctx.lineTo(width * 0.85, height * 0.3);
    ctx.lineTo(width * 0.8, height * 0.25);
    ctx.lineTo(width * 0.75, height * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Add some shading
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(width * 0.2, height * 0.7, width * 0.6, height * 0.05);
  };

  const drawHoodie = (ctx, width, height) => {
    ctx.fillStyle = mockupSettings.mockupColor;
    
    // Hoodie body (similar to t-shirt but with hood)
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.35);
    ctx.lineTo(width * 0.15, height * 0.3);
    ctx.lineTo(width * 0.15, height * 0.4);
    ctx.lineTo(width * 0.2, height * 0.45);
    ctx.lineTo(width * 0.2, height * 0.9);
    ctx.lineTo(width * 0.8, height * 0.9);
    ctx.lineTo(width * 0.8, height * 0.45);
    ctx.lineTo(width * 0.85, height * 0.4);
    ctx.lineTo(width * 0.85, height * 0.3);
    ctx.lineTo(width * 0.8, height * 0.35);
    ctx.closePath();
    ctx.fill();
    
    // Hood
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.25, width * 0.15, 0, Math.PI);
    ctx.fill();
    
    // Kangaroo pocket
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(width * 0.35, height * 0.55, width * 0.3, height * 0.15);
  };

  const drawMug = (ctx, width, height) => {
    // Mug body
    ctx.fillStyle = mockupSettings.mockupColor;
    ctx.fillRect(width * 0.2, height * 0.3, width * 0.5, height * 0.5);
    
    // Handle
    ctx.strokeStyle = mockupSettings.mockupColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(width * 0.75, height * 0.55, width * 0.08, -Math.PI/2, Math.PI/2);
    ctx.stroke();
    
    // Top rim
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(width * 0.2, height * 0.3, width * 0.5, height * 0.02);
  };

  const drawPoster = (ctx, width, height) => {
    // Frame
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, width, height);
    
    // Poster area
    ctx.fillStyle = mockupSettings.mockupColor;
    ctx.fillRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(width * 0.92, height * 0.08, width * 0.03, height * 0.87);
    ctx.fillRect(width * 0.08, height * 0.92, width * 0.87, height * 0.03);
  };

  const drawPhoneCase = (ctx, width, height) => {
    // Phone case with rounded corners
    ctx.fillStyle = mockupSettings.mockupColor;
    const caseX = width * 0.1;
    const caseY = height * 0.1;
    const caseW = width * 0.8;
    const caseH = height * 0.8;
    const radius = 20;
    
    ctx.beginPath();
    ctx.moveTo(caseX + radius, caseY);
    ctx.lineTo(caseX + caseW - radius, caseY);
    ctx.quadraticCurveTo(caseX + caseW, caseY, caseX + caseW, caseY + radius);
    ctx.lineTo(caseX + caseW, caseY + caseH - radius);
    ctx.quadraticCurveTo(caseX + caseW, caseY + caseH, caseX + caseW - radius, caseY + caseH);
    ctx.lineTo(caseX + radius, caseY + caseH);
    ctx.quadraticCurveTo(caseX, caseY + caseH, caseX, caseY + caseH - radius);
    ctx.lineTo(caseX, caseY + radius);
    ctx.quadraticCurveTo(caseX, caseY, caseX + radius, caseY);
    ctx.closePath();
    ctx.fill();
    
    // Screen area
    ctx.fillStyle = '#000000';
    const screenX = width * 0.15;
    const screenY = height * 0.15;
    const screenW = width * 0.7;
    const screenH = height * 0.7;
    const screenRadius = 15;
    
    ctx.beginPath();
    ctx.moveTo(screenX + screenRadius, screenY);
    ctx.lineTo(screenX + screenW - screenRadius, screenY);
    ctx.quadraticCurveTo(screenX + screenW, screenY, screenX + screenW, screenY + screenRadius);
    ctx.lineTo(screenX + screenW, screenY + screenH - screenRadius);
    ctx.quadraticCurveTo(screenX + screenW, screenY + screenH, screenX + screenW - screenRadius, screenY + screenH);
    ctx.lineTo(screenX + screenRadius, screenY + screenH);
    ctx.quadraticCurveTo(screenX, screenY + screenH, screenX, screenY + screenH - screenRadius);
    ctx.lineTo(screenX, screenY + screenRadius);
    ctx.quadraticCurveTo(screenX, screenY, screenX + screenRadius, screenY);
    ctx.closePath();
    ctx.fill();
    
    // Camera cutout
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawToteBag = (ctx, width, height) => {
    // Bag body
    ctx.fillStyle = mockupSettings.mockupColor;
    ctx.fillRect(width * 0.15, height * 0.25, width * 0.7, height * 0.6);
    
    // Handles
    ctx.strokeStyle = mockupSettings.mockupColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.25);
    ctx.lineTo(width * 0.35, height * 0.15);
    ctx.lineTo(width * 0.45, height * 0.15);
    ctx.lineTo(width * 0.5, height * 0.25);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.25);
    ctx.lineTo(width * 0.55, height * 0.15);
    ctx.lineTo(width * 0.65, height * 0.15);
    ctx.lineTo(width * 0.7, height * 0.25);
    ctx.stroke();
  };

  const drawSticker = (ctx, width, height) => {
    // Sticker with rounded corners
    ctx.fillStyle = mockupSettings.mockupColor;
    const x = width * 0.1;
    const y = height * 0.1;
    const w = width * 0.8;
    const h = height * 0.8;
    const radius = 20;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    
    // Slight shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    const shadowX = width * 0.12;
    const shadowY = height * 0.12;
    
    ctx.beginPath();
    ctx.moveTo(shadowX + radius, shadowY);
    ctx.lineTo(shadowX + w - radius, shadowY);
    ctx.quadraticCurveTo(shadowX + w, shadowY, shadowX + w, shadowY + radius);
    ctx.lineTo(shadowX + w, shadowY + h - radius);
    ctx.quadraticCurveTo(shadowX + w, shadowY + h, shadowX + w - radius, shadowY + h);
    ctx.lineTo(shadowX + radius, shadowY + h);
    ctx.quadraticCurveTo(shadowX, shadowY + h, shadowX, shadowY + h - radius);
    ctx.lineTo(shadowX, shadowY + radius);
    ctx.quadraticCurveTo(shadowX, shadowY, shadowX + radius, shadowY);
    ctx.closePath();
    ctx.fill();
  };

  const drawCap = (ctx, width, height) => {
    // Cap crown
    ctx.fillStyle = mockupSettings.mockupColor;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.4, width * 0.25, 0, Math.PI);
    ctx.fill();
    
    // Bill
    ctx.fillStyle = mockupSettings.mockupColor;
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.6, width * 0.2, width * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Seam lines
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.15);
    ctx.lineTo(width * 0.5, height * 0.4);
    ctx.stroke();
  };

  const drawDesignOnMockup = (ctx, width, height) => {
    if (!currentVariant) return;

    const designArea = currentVariant.designArea;

    // Sort layers by z-index for proper rendering order
    const sortedLayers = [...designLayers].sort((a, b) => a.zIndex - b.zIndex);

    // Draw each layer
    sortedLayers.forEach((layer, index) => {
      if (!layer.visible || !layer.design || layer.opacity === 0) return;

      ctx.save();

      // Apply layer opacity
      ctx.globalAlpha = layer.opacity;

      // Calculate layer position
      const layerX = width * (designArea.x + mockupSettings.designX + layer.position.x);
      const layerY = height * (designArea.y + mockupSettings.designY + layer.position.y);
      const layerWidth = width * designArea.width * mockupSettings.designScale * layer.scale;
      const layerHeight = height * designArea.height * mockupSettings.designScale * layer.scale;

      // Apply layer transformations
      ctx.translate(layerX + layerWidth/2, layerY + layerHeight/2);
      ctx.rotate(((mockupSettings.rotation + layer.rotation) * Math.PI) / 180);

      // Apply blend mode
      ctx.globalCompositeOperation = layer.blendMode || 'source-over';

      // Draw layer design
      if (layer.design.type === 'text') {
        ctx.fillStyle = layer.design.color || '#000000';
        ctx.font = `${layer.design.fontSize || 24}px ${layer.design.fontFamily || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.design.text || 'Layer Text', 0, 0);
      } else if (layer.design.type === 'image' && layer.design.imageData) {
        // Draw image layer
        const img = new Image();
        img.src = layer.design.imageData;
        ctx.drawImage(img, -layerWidth/2, -layerHeight/2, layerWidth, layerHeight);
      } else {
        // Fallback for legacy design format
        ctx.fillStyle = layer.design.color || '#000000';
        ctx.font = `${layer.design.fontSize || 24}px ${layer.design.fontFamily || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.design.text || 'Your Design', 0, 0);
      }

      // Draw visual feedback for active layer
      if (index === activeLayerIndex && dragMode) {
        // Selection border
        ctx.strokeStyle = isDragging ? '#ef4444' : '#3b82f6';
        ctx.lineWidth = isDragging ? 3 : 2;
        ctx.setLineDash(isDragging ? [3, 3] : [5, 5]);
        ctx.strokeRect(-layerWidth/2, -layerHeight/2, layerWidth, layerHeight);
        ctx.setLineDash([]);

        // Hover highlight
        if (isHoveringDesign && !isDragging) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
          ctx.fillRect(-layerWidth/2, -layerHeight/2, layerWidth, layerHeight);
        }

        // Drag feedback
        if (isDragging) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.fillRect(-layerWidth/2, -layerHeight/2, layerWidth, layerHeight);

          // Corner handles when dragging
          const handleSize = 8;
          ctx.fillStyle = '#ef4444';
          // Top-left
          ctx.fillRect(-layerWidth/2 - handleSize/2, -layerHeight/2 - handleSize/2, handleSize, handleSize);
          // Top-right
          ctx.fillRect(layerWidth/2 - handleSize/2, -layerHeight/2 - handleSize/2, handleSize, handleSize);
          // Bottom-left
          ctx.fillRect(-layerWidth/2 - handleSize/2, layerHeight/2 - handleSize/2, handleSize, handleSize);
          // Bottom-right
          ctx.fillRect(layerWidth/2 - handleSize/2, layerHeight/2 - handleSize/2, handleSize, handleSize);
        }

        // Layer info tooltip when hovering
        if (isHoveringDesign && !isDragging) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(-layerWidth/2, -layerHeight/2 - 30, layerWidth, 20);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(layer.name, 0, -layerHeight/2 - 15);
        }
      }

      ctx.restore();
    });
  };

  const addMockupEffects = (ctx, width, height) => {
    // Add subtle shadow/lighting based on shadowIntensity
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgba(255,255,255,${mockupSettings.shadowIntensity * 0.1})`);
    gradient.addColorStop(1, `rgba(0,0,0,${mockupSettings.shadowIntensity * 0.2})`);
    
    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };

  const handleSettingChange = (setting, value) => {
    setMockupSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleProductChange = (productId) => {
    setSelectedMockup(productId);
    // Reset to first available color for new product
    const colors = getAvailableColors(productId);
    if (colors.length > 0) {
      setSelectedColor(colors[0]);
      // Preload images for the selected product and color
      imagePreloader.preloadProductImages(productId, colors[0]);
    }
    setCurrentAngle(0);

    // Preload all variants for this product in background
    setTimeout(() => {
      imagePreloader.preloadAllProductVariants(productId);
    }, 100);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    // Preload images for the new color
    imagePreloader.preloadProductImages(selectedMockup, color);
  };

  const handleAngleChange = (angle) => {
    setCurrentAngle(angle);
  };

  const exportMockup = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to export mockups');
      return;
    }

    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `${selectedMockup}-mockup-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      if (onExport) {
        onExport({
          mockupType: selectedMockup,
          settings: mockupSettings,
          exportedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export mockup. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredMockups = mockupTemplates.filter(mockup => 
    !mockup.isPremium || (isAuthenticated && user?.role === 'premium')
  );

  return (
    <div className="bg-white rounded-xl shadow-lg page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mockup Generator</h2>
        <button
          onClick={exportMockup}
          disabled={isGenerating || !isAuthenticated}
          className="btn-gradient-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span>Export Mockup</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Mockup Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Mockup</h3>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <span
                  key={category}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredMockups.map(mockup => (
                <button
                  key={mockup.id}
                  onClick={() => handleProductChange(mockup.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedMockup === mockup.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ maxWidth: '100%' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{mockup.icon}</span>
                    {mockup.isPremium && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="font-medium text-gray-900">{mockup.name}</div>
                  <div className="text-xs text-gray-500">{mockup.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Color</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableColors.map(color => {
                  const variant = getProductVariant(selectedMockup, color);
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedColor === color
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ maxWidth: '100%' }}
                    >
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 border ${
                        color === 'black' ? 'bg-black border-gray-300' :
                        color === 'white' ? 'bg-white border-gray-400' :
                        color === 'red' ? 'bg-red-600 border-red-700' :
                        color === 'blue' ? 'bg-blue-600 border-blue-700' :
                        color === 'navy' ? 'bg-blue-900 border-blue-800' :
                        color === 'clear' ? 'bg-transparent border-gray-400' :
                        'bg-gray-600'
                      }`}></div>
                      <div className="text-sm font-medium text-gray-900">{variant?.name}</div>
                      <div className="text-xs text-gray-500">{variant?.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Angle Selection */}
          {currentVariant?.images && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">View Angle</h3>
              <div className="grid grid-cols-4 gap-2">
                {currentVariant.images.map(image => (
                  <button
                    key={image.angle}
                    onClick={() => handleAngleChange(image.angle)}
                    className={`p-2 border rounded-lg text-center transition-colors ${
                      currentAngle === image.angle
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ maxWidth: '100%' }}
                  >
                    <div className="text-xs font-medium">{image.angle}°</div>
                    <div className="text-xs text-gray-500">{image.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mockup Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Mockup</h3>
            
            <div className="space-y-4">
              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={mockupSettings.backgroundColor}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mockupSettings.backgroundColor}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Mockup Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={mockupSettings.mockupColor}
                    onChange={(e) => handleSettingChange('mockupColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mockupSettings.mockupColor}
                    onChange={(e) => handleSettingChange('mockupColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Design Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Scale ({Math.round(mockupSettings.designScale * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.5"
                  step="0.1"
                  value={mockupSettings.designScale}
                  onChange={(e) => handleSettingChange('designScale', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Drag Mode Toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Drag & Drop Mode
                  </label>
                  <button
                    onClick={() => setDragMode(!dragMode)}
                    className={`btn-compact ${
                      dragMode
                        ? 'btn-gradient-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {dragMode ? '🖱️ ON' : '🖱️ OFF'}
                  </button>
                </div>
                {dragMode && design && (
                  <p className="text-xs text-blue-600">
                    ✨ Click and drag the design on the canvas to reposition it
                  </p>
                )}
                {dragMode && !design && (
                  <p className="text-xs text-gray-500">
                    ⚠️ Add a design to enable drag positioning
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Shortcut: Ctrl+D (Cmd+D on Mac)
                </p>
              </div>

              {/* Design Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    X Position
                  </label>
                  <input
                    type="range"
                    min="-0.2"
                    max="0.2"
                    step="0.01"
                    value={mockupSettings.designX}
                    onChange={(e) => handleSettingChange('designX', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Y Position
                  </label>
                  <input
                    type="range"
                    min="-0.2"
                    max="0.2"
                    step="0.01"
                    value={mockupSettings.designY}
                    onChange={(e) => handleSettingChange('designY', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rotation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Rotation ({mockupSettings.rotation}°)
                </label>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  value={mockupSettings.rotation}
                  onChange={(e) => handleSettingChange('rotation', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Shadow Intensity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shadow Intensity ({Math.round(mockupSettings.shadowIntensity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={mockupSettings.shadowIntensity}
                  onChange={(e) => handleSettingChange('shadowIntensity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-yellow-900">
                <p className="font-bold mb-1" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>🔒 Sign in to unlock full features</p>
                <p className="text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Export high-res mockups, access premium templates, and save presets</p>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-4">
              <canvas
                ref={canvasRef}
                className={`w-full h-auto max-w-full max-h-96 mx-auto block transition-all duration-200 ${
                  dragMode && designLayers.length > 0 ? 'cursor-grab' : ''
                } ${isDragging ? 'cursor-grabbing' : ''} ${
                  isDragging ? 'scale-105 shadow-2xl' : ''
                } ${
                  isHoveringDesign && dragMode ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
                }`}
                style={{
                  imageRendering: 'crisp-edges',
                  border: dragMode && designLayers.length > 0 ? '2px dashed #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: isDragging
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    : isHoveringDesign && dragMode
                    ? '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>

            {/* Drag Status Indicator */}
            {dragMode && designLayers.length > 0 && (
              <div className="mt-3 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isDragging
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : isHoveringDesign
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {isDragging && (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      Dragging {designLayers[activeLayerIndex]?.name}
                    </>
                  )}
                  {!isDragging && isHoveringDesign && (
                    <>
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Click to drag {designLayers[activeLayerIndex]?.name}
                    </>
                  )}
                  {!isDragging && !isHoveringDesign && (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Hover over design to drag
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mockup Info */}
          {currentMockup && currentVariant && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Product Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{currentVariant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{currentMockup.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-primary-600">{currentVariant.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">
                    {currentMockup.dimensions.width} x {currentMockup.dimensions.height}px
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">View Angle:</span>
                  <span className="font-medium">{currentAngle}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className={`font-medium ${currentMockup.isPremium ? 'text-yellow-600' : 'text-green-600'}`}>
                    {currentMockup.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">{currentMockup.description}</p>
              </div>
            </div>
          )}

          {/* Performance Settings */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Performance Settings</h4>

            {/* Performance Mode */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loading Strategy
              </label>
              <select
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="low">Low (Load on demand)</option>
                <option value="balanced">Balanced (Recommended)</option>
                <option value="high">High (Aggressive preload)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {performanceMode === 'low' && 'Minimal memory usage, slower transitions'}
                {performanceMode === 'balanced' && 'Good balance of speed and memory usage'}
                {performanceMode === 'high' && 'Fastest experience, uses more memory'}
              </p>
            </div>

            {/* Preload Progress */}
            {preloadProgress < 100 && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Preloading images...</span>
                  <span>{preloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${preloadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Cache Info */}
            <div className="text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Cached Images:</span>
                <span>{imagePreloader.getCacheSize()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`${imageLoadingStatus === 'loaded' ? 'text-green-600' :
                  imageLoadingStatus === 'loading' ? 'text-blue-600' :
                  imageLoadingStatus === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                  {imageLoadingStatus === 'loaded' && '✓ Ready'}
                  {imageLoadingStatus === 'loading' && '⏳ Loading...'}
                  {imageLoadingStatus === 'error' && '⚠ Error'}
                  {imageLoadingStatus === 'idle' && '⚪ Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* Design Layers */}
          {designLayers.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Design Layers ({designLayers.length})</h4>
                <button
                  onClick={() => addLayer()}
                  className="btn-gradient-purple btn-compact"
                  disabled={!design}
                >
                  + Add Layer
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {designLayers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      index === activeLayerIndex
                        ? 'border-purple-400 bg-purple-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setActiveLayerIndex(index)}
                          className="text-left flex-1"
                        >
                          <div className="font-medium text-sm">{layer.name}</div>
                          <div className="text-xs text-gray-500">
                            Z-Index: {layer.zIndex} | Opacity: {Math.round(layer.opacity * 100)}%
                          </div>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        {/* Visibility Toggle */}
                        <button
                          onClick={() => updateLayer(index, { visible: !layer.visible })}
                          className={`p-1 rounded text-xs ${
                            layer.visible ? 'text-green-600' : 'text-gray-400'
                          }`}
                          title={layer.visible ? 'Hide layer' : 'Show layer'}
                        >
                          {layer.visible ? '👁️' : '👁️‍🗨️'}
                        </button>

                        {/* Duplicate Layer */}
                        <button
                          onClick={() => duplicateLayer(index)}
                          className="p-1 rounded text-xs text-blue-600 hover:bg-blue-100"
                          title="Duplicate layer"
                        >
                          📄
                        </button>

                        {/* Delete Layer */}
                        <button
                          onClick={() => removeLayer(index)}
                          className="p-1 rounded text-xs text-red-600 hover:bg-red-100"
                          title="Delete layer"
                          disabled={designLayers.length <= 1}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Layer Controls for Active Layer */}
                    {index === activeLayerIndex && (
                      <div className="mt-3 pt-3 border-t border-purple-200 space-y-2">
                        {/* Opacity */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Opacity ({Math.round(layer.opacity * 100)}%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={layer.opacity}
                            onChange={(e) => updateLayer(index, { opacity: parseFloat(e.target.value) })}
                            className="w-full h-2"
                          />
                        </div>

                        {/* Scale */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Scale ({Math.round(layer.scale * 100)}%)
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={layer.scale}
                            onChange={(e) => updateLayer(index, { scale: parseFloat(e.target.value) })}
                            className="w-full h-2"
                          />
                        </div>

                        {/* Rotation */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Rotation ({layer.rotation}°)
                          </label>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={layer.rotation}
                            onChange={(e) => updateLayer(index, { rotation: parseInt(e.target.value) })}
                            className="w-full h-2"
                          />
                        </div>

                        {/* Blend Mode */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Blend Mode
                          </label>
                          <select
                            value={layer.blendMode}
                            onChange={(e) => updateLayer(index, { blendMode: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                          >
                            <option value="source-over">Normal</option>
                            <option value="multiply">Multiply</option>
                            <option value="screen">Screen</option>
                            <option value="overlay">Overlay</option>
                            <option value="soft-light">Soft Light</option>
                            <option value="hard-light">Hard Light</option>
                            <option value="difference">Difference</option>
                            <option value="exclusion">Exclusion</option>
                          </select>
                        </div>

                        {/* Layer Order */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => moveLayer(index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 disabled:opacity-50"
                          >
                            ⬆️ Up
                          </button>
                          <button
                            onClick={() => moveLayer(index, Math.min(designLayers.length - 1, index + 1))}
                            disabled={index === designLayers.length - 1}
                            className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 disabled:opacity-50"
                          >
                            ⬇️ Down
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSettingChange('designScale', 1.0)}
              className="btn-secondary btn-small"
            >
              Reset Scale
            </button>
            <button
              onClick={() => {
                handleSettingChange('designX', 0);
                handleSettingChange('designY', 0);
                handleSettingChange('rotation', 0);
              }}
              className="btn-secondary btn-small"
            >
              Center Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupGenerator;