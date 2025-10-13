import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../../lib/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { productImageConfig, getProductImage, getProductVariant, getAllProductTypes, getAvailableColors } from '../../data/productImages';

const EnhancedMockupViewer = ({ design, onExport }) => {
  const { isAuthenticated, user } = useAuth();
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedProduct, setSelectedProduct] = useState('tshirts');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const lastMouseX = useRef(0);
  const containerRef = useRef(null);
  const autoRotateRef = useRef(null);
  const canvasRef = useRef(null);

  // Use product configuration from data file
  const productVariants = productImageConfig;

  const products = [
    { id: 'tshirts', name: 'T-Shirt', icon: '👕' },
    { id: 'hoodies', name: 'Hoodie', icon: '🧥' },
    { id: 'mugs', name: 'Coffee Mug', icon: '☕' },
    { id: 'hats', name: 'Baseball Cap', icon: '🧢' },
    { id: 'mousepads', name: 'Mouse Pad', icon: '🖱️' },
    { id: 'totebags', name: 'Tote Bag', icon: '👜' },
    { id: 'phonecases', name: 'Phone Case', icon: '📱' },
    { id: 'stickers', name: 'Sticker', icon: '🏷️' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = Object.keys(productVariants[selectedProduct] || {});
  const currentVariant = productVariants[selectedProduct]?.[selectedColor];
  const productImages = currentVariant?.images || [];

  // Get current image based on rotation
  const getCurrentImage = () => {
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const angleStep = 45;
    const closestAngleIndex = Math.round(normalizedRotation / angleStep) % productImages.length;
    return productImages[closestAngleIndex];
  };

  // Smooth rotation with easing
  const smoothRotationRef = useRef(0);
  const targetRotationRef = useRef(0);

  useEffect(() => {
    let animationFrame;
    
    const animateRotation = () => {
      const current = smoothRotationRef.current;
      const target = targetRotationRef.current;
      const diff = target - current;
      
      if (Math.abs(diff) > 0.1) {
        smoothRotationRef.current = current + diff * 0.15;
        setCurrentRotation(smoothRotationRef.current);
        animationFrame = requestAnimationFrame(animateRotation);
      }
    };
    
    if (!isDragging && !isAutoRotating) {
      animationFrame = requestAnimationFrame(animateRotation);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isDragging, isAutoRotating]);

  // Generate mockup on canvas when design changes
  useEffect(() => {
    generateMockup();
  }, [selectedProduct, selectedColor, design, currentRotation]);

  const generateMockup = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentVariant) return;

    // Get device pixel ratio for high-DPI displays (capped at 3 for performance)
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 3);
    const scaleFactor = devicePixelRatio * 2;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: false,
      willReadFrequently: false
    });

    // Set high resolution canvas
    canvas.width = 400 * scaleFactor;
    canvas.height = 500 * scaleFactor;

    // Set display size
    canvas.style.width = '400px';
    canvas.style.height = '500px';

    // Scale drawing context
    ctx.scale(scaleFactor, scaleFactor);

    // Enable maximum quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 500);

    try {
      // Get current image source
      const currentImage = getCurrentImage();
      const imageSrc = currentImage?.src;

      if (imageSrc) {
        // Load and draw product image
        await drawProductImage(ctx, imageSrc);
      } else {
        // Fallback to drawing basic shape
        drawProductMockup(ctx, currentImage);
      }

      // Draw design if provided
      if (design) {
        drawDesignOnProduct(ctx);
      }
    } catch (error) {
      console.error('Error generating mockup:', error);
      // Fallback to drawing basic shape
      drawProductMockup(ctx, getCurrentImage());
      if (design) {
        drawDesignOnProduct(ctx);
      }
    }
  };

  const drawProductImage = (ctx, imageSrc) => {
    return new Promise((resolve, reject) => {
      // Check if image is already loaded
      if (loadedImages[imageSrc]) {
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(loadedImages[imageSrc], 0, 0, 400, 500);
        ctx.restore();
        resolve();
        return;
      }

      // Load new image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Cache the loaded image
        setLoadedImages(prev => ({
          ...prev,
          [imageSrc]: img
        }));

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, 400, 500);
        ctx.restore();
        resolve();
      };

      img.onerror = () => {
        console.error('Failed to load product image:', imageSrc);
        reject(new Error('Failed to load product image'));
      };

      img.src = imageSrc;
    });
  };

  const drawProductMockup = (ctx, currentImage) => {
    // This would normally load and draw the actual product image
    // For now, we'll draw a placeholder based on the product type
    ctx.fillStyle = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    switch (selectedProduct) {
      case 'tshirt':
        drawTShirtMockup(ctx);
        break;
      case 'hoodie':
        drawHoodieMockup(ctx);
        break;
      case 'totebag':
        drawToteBagMockup(ctx);
        break;
      case 'sweatshirt':
        drawSweatshirtMockup(ctx);
        break;
      case 'dress':
        drawDressMockup(ctx);
        break;
      case 'hat':
        drawHatMockup(ctx);
        break;
      case 'bra':
        drawBraMockup(ctx);
        break;
      default:
        drawTShirtMockup(ctx);
    }
  };

  const drawTShirtMockup = (ctx) => {
    // T-shirt shape
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(80, 130);
    ctx.lineTo(60, 150);
    ctx.lineTo(60, 170);
    ctx.lineTo(80, 190);
    ctx.lineTo(80, 420);
    ctx.lineTo(320, 420);
    ctx.lineTo(320, 190);
    ctx.lineTo(340, 170);
    ctx.lineTo(340, 150);
    ctx.lineTo(320, 130);
    ctx.lineTo(300, 150);
    ctx.closePath();
    ctx.fill();
    
    // Add shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(80, 380, 240, 20);
  };

  const drawHoodieMockup = (ctx) => {
    // Hoodie with hood
    ctx.beginPath();
    ctx.moveTo(80, 170);
    ctx.lineTo(60, 150);
    ctx.lineTo(60, 190);
    ctx.lineTo(80, 210);
    ctx.lineTo(80, 450);
    ctx.lineTo(320, 450);
    ctx.lineTo(320, 210);
    ctx.lineTo(340, 190);
    ctx.lineTo(340, 150);
    ctx.lineTo(320, 170);
    ctx.closePath();
    ctx.fill();
    
    // Hood
    ctx.beginPath();
    ctx.arc(200, 125, 60, 0, Math.PI);
    ctx.fill();
    
    // Kangaroo pocket
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(140, 275, 120, 60);
  };

  const drawToteBagMockup = (ctx) => {
    // Bag body
    ctx.fillRect(60, 125, 280, 300);
    
    // Handles
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(120, 125);
    ctx.lineTo(140, 75);
    ctx.lineTo(180, 75);
    ctx.lineTo(200, 125);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(200, 125);
    ctx.lineTo(220, 75);
    ctx.lineTo(260, 75);
    ctx.lineTo(280, 125);
    ctx.stroke();
  };

  const drawSweatshirtMockup = (ctx) => {
    // Similar to hoodie but without hood
    ctx.beginPath();
    ctx.moveTo(80, 170);
    ctx.lineTo(60, 150);
    ctx.lineTo(60, 190);
    ctx.lineTo(80, 210);
    ctx.lineTo(80, 440);
    ctx.lineTo(320, 440);
    ctx.lineTo(320, 210);
    ctx.lineTo(340, 190);
    ctx.lineTo(340, 150);
    ctx.lineTo(320, 170);
    ctx.closePath();
    ctx.fill();
    
    // Ribbed cuffs
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(80, 430, 240, 10);
  };

  const drawDressMockup = (ctx) => {
    // Dress silhouette
    ctx.beginPath();
    ctx.moveTo(120, 150);
    ctx.lineTo(100, 130);
    ctx.lineTo(80, 150);
    ctx.lineTo(80, 170);
    ctx.lineTo(100, 190);
    ctx.lineTo(110, 300);
    ctx.lineTo(60, 450);
    ctx.lineTo(340, 450);
    ctx.lineTo(290, 300);
    ctx.lineTo(300, 190);
    ctx.lineTo(320, 170);
    ctx.lineTo(320, 150);
    ctx.lineTo(300, 130);
    ctx.lineTo(280, 150);
    ctx.closePath();
    ctx.fill();
  };

  const drawHatMockup = (ctx) => {
    // Cap crown
    ctx.beginPath();
    ctx.arc(200, 200, 100, 0, Math.PI);
    ctx.fill();
    
    // Bill
    ctx.beginPath();
    ctx.ellipse(200, 280, 80, 32, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawBraMockup = (ctx) => {
    // Sports bra shape
    ctx.beginPath();
    ctx.moveTo(120, 200);
    ctx.quadraticCurveTo(160, 150, 200, 180);
    ctx.quadraticCurveTo(240, 150, 280, 200);
    ctx.lineTo(300, 250);
    ctx.lineTo(280, 300);
    ctx.lineTo(120, 300);
    ctx.lineTo(100, 250);
    ctx.closePath();
    ctx.fill();
  };

  const drawDesignOnProduct = (ctx) => {
    if (!design || !currentVariant) return;

    const designArea = currentVariant.designArea;
    const canvasWidth = 400;
    const canvasHeight = 500;

    // Calculate design position based on design area and current angle
    let designX = canvasWidth * designArea.x;
    let designY = canvasHeight * designArea.y;
    const designWidth = canvasWidth * designArea.width;
    const designHeight = canvasHeight * designArea.height;

    const currentImage = getCurrentImage();

    // Adjust position based on viewing angle
    if (currentImage?.angle === 180) {
      designY = designY + designHeight * 0.1; // Back view, design slightly lower
    } else if (currentImage?.angle === 90 || currentImage?.angle === 270) {
      designX = currentImage.angle === 90 ? canvasWidth - 50 : 50; // Side views
    }

    ctx.save();
    ctx.translate(designX + designWidth/2, designY + designHeight/2);

    // Draw design (text example)
    ctx.fillStyle = design.color || '#000000';
    ctx.font = `${design.fontSize || 24}px ${design.fontFamily || 'Arial'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(design.text || 'Your Design', 0, 0);

    ctx.restore();
  };

  // Zoom functionality
  const handleZoom = (newZoom) => {
    setZoomLevel(newZoom[0]);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  // Mouse interaction for rotation
  const handleMouseDown = (e) => {
    if (e.detail === 2) {
      resetZoom();
      return;
    }
    setIsDragging(true);
    lastMouseX.current = e.clientX;
    stopAutoRotate();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouseX.current;
    const rotationDelta = deltaX * 0.8;
    
    const newRotation = currentRotation + rotationDelta;
    setCurrentRotation(newRotation);
    smoothRotationRef.current = newRotation;
    targetRotationRef.current = newRotation;
    lastMouseX.current = e.clientX;
  }, [isDragging, currentRotation]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Auto rotation functionality
  const startAutoRotate = () => {
    setIsAutoRotating(true);
    autoRotateRef.current = setInterval(() => {
      setCurrentRotation(prev => {
        const newRotation = prev + 0.5;
        smoothRotationRef.current = newRotation;
        targetRotationRef.current = newRotation;
        return newRotation;
      });
    }, 16);
  };

  const stopAutoRotate = () => {
    setIsAutoRotating(false);
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
  };

  // Navigate to specific views
  const navigateToView = (targetAngle) => {
    targetRotationRef.current = targetAngle;
    stopAutoRotate();
  };

  const rotateLeft = () => {
    const newTarget = currentRotation - 45;
    targetRotationRef.current = newTarget;
    stopAutoRotate();
  };

  const rotateRight = () => {
    const newTarget = currentRotation + 45;
    targetRotationRef.current = newTarget;
    stopAutoRotate();
  };

  // Product and color handlers
  const handleProductChange = (product) => {
    setSelectedProduct(product);
    setSelectedColor(Object.keys(productVariants[product] || {})[0] || 'white');
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // Export functionality
  const exportMockup = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to export mockups');
      return;
    }

    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `${selectedProduct}-${selectedColor}-mockup-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      if (onExport) {
        onExport({
          product: selectedProduct,
          color: selectedColor,
          size: selectedSize,
          rotation: Math.round(((currentRotation % 360) + 360) % 360),
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

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Cleanup auto rotate on unmount
  useEffect(() => {
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, []);

  const currentImage = getCurrentImage();

  return (
    <div className="max-w-7xl mx-auto p-6 page-container">
      {/* Product Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Mockup Viewer</h1>
        <p className="text-gray-600">360° Interactive Product Preview with Advanced Design Placement</p>
        {currentVariant && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">{currentVariant.name}</span>
            <span className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm font-medium">Size {selectedSize}</span>
            <span className="font-semibold">{currentVariant.price}</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Selection Sidebar */}
        <div className="lg:order-first order-last space-y-6">
          {/* Product Type Selection */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span>🛍️</span>
              Product Type
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductChange(product.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedProduct === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{product.icon}</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Palette className="w-4 h-4" />
                Color
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {availableColors.map((color) => {
                  const variant = productVariants[selectedProduct][color];
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full mx-auto mb-2 border ${
                        color === 'black' ? 'bg-black border-gray-300' :
                        color === 'white' ? 'bg-white border-gray-400' :
                        color === 'red' ? 'bg-red-600 border-red-700' :
                        'bg-gray-600'
                      }`}></div>
                      <p className="text-xs font-medium">{variant.name}</p>
                      <p className="text-xs text-gray-500">{variant.price}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Ruler className="w-4 h-4" />
              Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`py-2 px-3 rounded-lg border transition-all ${
                    selectedSize === size
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              🔍 Zoom
            </h3>
            <div className="space-y-3">
              <input
                type="range"
                value={zoomLevel}
                onChange={(e) => handleZoom([parseInt(e.target.value)])}
                min={50}
                max={200}
                step={5}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>50%</span>
                <span>{zoomLevel}%</span>
                <span>200%</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={zoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={resetZoom} className="flex-1">
                  Reset
                </Button>
                <Button size="sm" variant="outline" onClick={zoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Button
              onClick={exportMockup}
              disabled={isGenerating || !isAuthenticated}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Mockup
                </>
              )}
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Sign in to export high-res mockups
              </p>
            )}
          </div>
        </div>

        {/* Main Product Viewer */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6 overflow-hidden">
            <div
              ref={containerRef}
              className="relative w-full h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
            >
              <canvas
                ref={canvasRef}
                className="max-w-none object-contain transition-all duration-300 ease-out shadow-lg rounded-lg"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  backfaceVisibility: 'hidden',
                  transform: `translateZ(0) scale(${zoomLevel / 100})`,
                  maxWidth: `${100 * (zoomLevel / 100)}%`,
                  maxHeight: `${100 * (zoomLevel / 100)}%`
                }}
                draggable={false}
              />
              
              {/* Rotation indicator */}
              {currentImage && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                  <p className="text-sm text-gray-600 font-medium">{currentImage.label}</p>
                  <p className="text-xs text-gray-500">{Math.round(((currentRotation % 360) + 360) % 360)}°</p>
                </div>
              )}

              {/* Zoom level indicator */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                <p className="text-sm text-gray-600 font-medium">Zoom: {zoomLevel}%</p>
              </div>

              {/* Instructions overlay */}
              {!isDragging && zoomLevel === 100 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                  Drag to rotate • Double-click to reset zoom
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="flex flex-col gap-4 items-center justify-center">
            {/* Main Controls */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={rotateLeft}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                -45°
              </Button>
              
              <Button
                variant={isAutoRotating ? "default" : "outline"}
                size="sm"
                onClick={isAutoRotating ? stopAutoRotate : startAutoRotate}
                className="flex items-center gap-2"
              >
                <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
                {isAutoRotating ? 'Stop' : 'Auto Rotate'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={rotateRight}
                className="flex items-center gap-2"
              >
                +45°
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick View Selector - 8 angles */}
            <div className="flex justify-center">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
                {productImages.map((view) => (
                  <button
                    key={view.angle}
                    onClick={() => navigateToView(view.angle)}
                    className={`px-3 py-2 rounded-md text-xs whitespace-nowrap transition-colors ${
                      currentImage && Math.abs(currentImage.angle - view.angle) < 22.5
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                    title={view.label}
                  >
                    {view.angle}°
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMockupViewer;