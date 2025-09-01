import { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../lib/ui/button';
import { Slider } from '../../lib/ui/slider';
import { Badge } from '../../lib/ui/badge';
import { ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut, Palette, Ruler, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EnhancedMockupViewer = ({ design, onExport }) => {
  const { isAuthenticated, user } = useAuth();
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedProduct, setSelectedProduct] = useState('tshirt');
  const [isGenerating, setIsGenerating] = useState(false);
  const lastMouseX = useRef(0);
  const containerRef = useRef(null);
  const autoRotateRef = useRef(null);
  const canvasRef = useRef(null);

  // Enhanced product variants with multiple angles
  const productVariants = {
    tshirt: {
      white: {
        name: 'White T-Shirt',
        images: [
          { angle: 0, label: "Front View", mockup: 'tshirt_white_front' },
          { angle: 45, label: "Front-Right View", mockup: 'tshirt_white_front_right' },
          { angle: 90, label: "Side View", mockup: 'tshirt_white_side' },
          { angle: 135, label: "Side-Back View", mockup: 'tshirt_white_side_back' },
          { angle: 180, label: "Back View", mockup: 'tshirt_white_back' },
          { angle: 225, label: "Back-Left View", mockup: 'tshirt_white_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'tshirt_white_left' },
          { angle: 315, label: "Front-Left View", mockup: 'tshirt_white_front_left' },
        ],
        price: '$19.99'
      },
      black: {
        name: 'Black T-Shirt',
        images: [
          { angle: 0, label: "Front View", mockup: 'tshirt_black_front' },
          { angle: 45, label: "Front-Right View", mockup: 'tshirt_black_front_right' },
          { angle: 90, label: "Side View", mockup: 'tshirt_black_side' },
          { angle: 135, label: "Side-Back View", mockup: 'tshirt_black_side_back' },
          { angle: 180, label: "Back View", mockup: 'tshirt_black_back' },
          { angle: 225, label: "Back-Left View", mockup: 'tshirt_black_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'tshirt_black_left' },
          { angle: 315, label: "Front-Left View", mockup: 'tshirt_black_front_left' },
        ],
        price: '$19.99'
      },
      red: {
        name: 'Red T-Shirt',
        images: [
          { angle: 0, label: "Front View", mockup: 'tshirt_red_front' },
          { angle: 45, label: "Front-Right View", mockup: 'tshirt_red_front_right' },
          { angle: 90, label: "Side View", mockup: 'tshirt_red_side' },
          { angle: 135, label: "Side-Back View", mockup: 'tshirt_red_side_back' },
          { angle: 180, label: "Back View", mockup: 'tshirt_red_back' },
          { angle: 225, label: "Back-Left View", mockup: 'tshirt_red_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'tshirt_red_left' },
          { angle: 315, label: "Front-Left View", mockup: 'tshirt_red_front_left' },
        ],
        price: '$19.99'
      }
    },
    hoodie: {
      white: {
        name: 'White Hoodie',
        images: [
          { angle: 0, label: "Front View", mockup: 'hoodie_white_front' },
          { angle: 45, label: "Front-Right View", mockup: 'hoodie_white_front_right' },
          { angle: 90, label: "Side View", mockup: 'hoodie_white_side' },
          { angle: 135, label: "Side-Back View", mockup: 'hoodie_white_side_back' },
          { angle: 180, label: "Back View", mockup: 'hoodie_white_back' },
          { angle: 225, label: "Back-Left View", mockup: 'hoodie_white_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'hoodie_white_left' },
          { angle: 315, label: "Front-Left View", mockup: 'hoodie_white_front_left' },
        ],
        price: '$39.99'
      },
      black: {
        name: 'Black Hoodie',
        images: [
          { angle: 0, label: "Front View", mockup: 'hoodie_black_front' },
          { angle: 45, label: "Front-Right View", mockup: 'hoodie_black_front_right' },
          { angle: 90, label: "Side View", mockup: 'hoodie_black_side' },
          { angle: 135, label: "Side-Back View", mockup: 'hoodie_black_side_back' },
          { angle: 180, label: "Back View", mockup: 'hoodie_black_back' },
          { angle: 225, label: "Back-Left View", mockup: 'hoodie_black_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'hoodie_black_left' },
          { angle: 315, label: "Front-Left View", mockup: 'hoodie_black_front_left' },
        ],
        price: '$39.99'
      }
    },
    totebag: {
      white: {
        name: 'White Tote Bag',
        images: [
          { angle: 0, label: "Front View", mockup: 'totebag_white_front' },
          { angle: 45, label: "Front-Right View", mockup: 'totebag_white_front_right' },
          { angle: 90, label: "Side View", mockup: 'totebag_white_side' },
          { angle: 135, label: "Side-Back View", mockup: 'totebag_white_side_back' },
          { angle: 180, label: "Back View", mockup: 'totebag_white_back' },
          { angle: 225, label: "Back-Left View", mockup: 'totebag_white_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'totebag_white_left' },
          { angle: 315, label: "Front-Left View", mockup: 'totebag_white_front_left' },
        ],
        price: '$14.99'
      }
    },
    sweatshirt: {
      white: {
        name: 'White Sweatshirt',
        images: [
          { angle: 0, label: "Front View", mockup: 'sweatshirt_white_front' },
          { angle: 45, label: "Front-Right View", mockup: 'sweatshirt_white_front_right' },
          { angle: 90, label: "Side View", mockup: 'sweatshirt_white_side' },
          { angle: 135, label: "Side-Back View", mockup: 'sweatshirt_white_side_back' },
          { angle: 180, label: "Back View", mockup: 'sweatshirt_white_back' },
          { angle: 225, label: "Back-Left View", mockup: 'sweatshirt_white_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'sweatshirt_white_left' },
          { angle: 315, label: "Front-Left View", mockup: 'sweatshirt_white_front_left' },
        ],
        price: '$34.99'
      }
    },
    dress: {
      white: {
        name: 'White Dress',
        images: [
          { angle: 0, label: "Front View", mockup: 'dress_white_front' },
          { angle: 45, label: "Front-Right View", mockup: 'dress_white_front_right' },
          { angle: 90, label: "Side View", mockup: 'dress_white_side' },
          { angle: 135, label: "Side-Back View", mockup: 'dress_white_side_back' },
          { angle: 180, label: "Back View", mockup: 'dress_white_back' },
          { angle: 225, label: "Back-Left View", mockup: 'dress_white_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'dress_white_left' },
          { angle: 315, label: "Front-Left View", mockup: 'dress_white_front_left' },
        ],
        price: '$29.99'
      }
    },
    hat: {
      white: {
        name: 'White Baseball Cap',
        images: [
          { angle: 0, label: "Front View", mockup: 'hat_white_front' },
          { angle: 45, label: "Front-Right View", mockup: 'hat_white_front_right' },
          { angle: 90, label: "Side View", mockup: 'hat_white_side' },
          { angle: 135, label: "Side-Back View", mockup: 'hat_white_side_back' },
          { angle: 180, label: "Back View", mockup: 'hat_white_back' },
          { angle: 225, label: "Back-Left View", mockup: 'hat_white_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'hat_white_left' },
          { angle: 315, label: "Front-Left View", mockup: 'hat_white_front_left' },
        ],
        price: '$24.99'
      }
    },
    bra: {
      white: {
        name: 'White Sports Bra',
        images: [
          { angle: 0, label: "Front View", mockup: 'bra_white_front' },
          { angle: 45, label: "Front-Right View", mockup: 'bra_white_front_right' },
          { angle: 90, label: "Side View", mockup: 'bra_white_side' },
          { angle: 135, label: "Side-Back View", mockup: 'bra_white_side_back' },
          { angle: 180, label: "Back View", mockup: 'bra_white_back' },
          { angle: 225, label: "Back-Left View", mockup: 'bra_white_back_left' },
          { angle: 270, label: "Left Side View", mockup: 'bra_white_left' },
          { angle: 315, label: "Front-Left View", mockup: 'bra_white_front_left' },
        ],
        price: '$32.99'
      }
    }
  };

  const products = [
    { id: 'tshirt', name: 'T-Shirt', icon: '👕' },
    { id: 'hoodie', name: 'Hoodie', icon: '🧥' },
    { id: 'totebag', name: 'Tote Bag', icon: '👜' },
    { id: 'sweatshirt', name: 'Sweatshirt', icon: '👕' },
    { id: 'dress', name: 'Dress', icon: '👗' },
    { id: 'hat', name: 'Hat', icon: '🧢' },
    { id: 'bra', name: 'Sports Bra', icon: '👙' }
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

  const generateMockup = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentVariant) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 500;

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 500);

    // Draw mockup based on current rotation and product
    drawProductMockup(ctx, getCurrentImage());
    
    // Draw design if provided
    if (design) {
      drawDesignOnProduct(ctx);
    }
  };

  const drawProductMockup = (ctx, currentImage) => {
    // Each mockup function now handles its own colors and gradients
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
    const baseColor = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    // Create gradient for depth
    const gradient = ctx.createLinearGradient(0, 150, 400, 420);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#1a1a1a' : '#b91c1c');
    
    ctx.fillStyle = gradient;
    
    // T-shirt body with curved edges
    ctx.beginPath();
    ctx.moveTo(120, 160); // Start at left shoulder
    
    // Left shoulder curve
    ctx.quadraticCurveTo(100, 140, 85, 155);
    ctx.quadraticCurveTo(70, 165, 75, 180);
    
    // Left sleeve
    ctx.quadraticCurveTo(85, 195, 90, 210);
    ctx.lineTo(90, 410);
    
    // Bottom hem with slight curve
    ctx.quadraticCurveTo(90, 425, 105, 430);
    ctx.lineTo(295, 430);
    ctx.quadraticCurveTo(310, 425, 310, 410);
    
    // Right side seam
    ctx.lineTo(310, 210);
    ctx.quadraticCurveTo(315, 195, 325, 180);
    
    // Right shoulder curve
    ctx.quadraticCurveTo(330, 165, 315, 155);
    ctx.quadraticCurveTo(300, 140, 280, 160);
    
    // Neckline with natural curve
    ctx.quadraticCurveTo(240, 145, 200, 145);
    ctx.quadraticCurveTo(160, 145, 120, 160);
    
    ctx.fill();
    
    // Add realistic neckline
    ctx.strokeStyle = selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 160);
    ctx.quadraticCurveTo(160, 140, 200, 140);
    ctx.quadraticCurveTo(240, 140, 280, 160);
    ctx.stroke();
    
    // Subtle shadow for depth
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(200, 445, 120, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Sleeve shadows for 3D effect
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.moveTo(90, 180);
    ctx.quadraticCurveTo(95, 200, 98, 220);
    ctx.lineTo(102, 410);
    ctx.quadraticCurveTo(98, 415, 90, 410);
    ctx.lineTo(90, 180);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(310, 180);
    ctx.quadraticCurveTo(305, 200, 302, 220);
    ctx.lineTo(298, 410);
    ctx.quadraticCurveTo(302, 415, 310, 410);
    ctx.lineTo(310, 180);
    ctx.fill();
  };

  const drawHoodieMockup = (ctx) => {
    const baseColor = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    // Create gradient for the hoodie body
    const bodyGradient = ctx.createLinearGradient(0, 170, 400, 450);
    bodyGradient.addColorStop(0, baseColor);
    bodyGradient.addColorStop(0.7, selectedColor === 'white' ? '#f8f8f8' : selectedColor === 'black' ? '#2a2a2a' : '#c53030');
    bodyGradient.addColorStop(1, selectedColor === 'white' ? '#eeeeee' : selectedColor === 'black' ? '#1a1a1a' : '#991b1b');
    
    ctx.fillStyle = bodyGradient;
    
    // Hoodie body with realistic shape
    ctx.beginPath();
    ctx.moveTo(110, 180);
    
    // Left shoulder and sleeve
    ctx.quadraticCurveTo(85, 160, 70, 175);
    ctx.quadraticCurveTo(55, 190, 65, 210);
    ctx.quadraticCurveTo(75, 225, 85, 240);
    ctx.lineTo(85, 440);
    
    // Bottom hem with ribbing effect
    ctx.quadraticCurveTo(85, 455, 100, 460);
    ctx.lineTo(300, 460);
    ctx.quadraticCurveTo(315, 455, 315, 440);
    
    // Right side
    ctx.lineTo(315, 240);
    ctx.quadraticCurveTo(325, 225, 335, 210);
    ctx.quadraticCurveTo(345, 190, 330, 175);
    ctx.quadraticCurveTo(315, 160, 290, 180);
    
    // Connect back to start
    ctx.quadraticCurveTo(250, 165, 200, 165);
    ctx.quadraticCurveTo(150, 165, 110, 180);
    
    ctx.fill();
    
    // Hood with realistic draping
    const hoodGradient = ctx.createRadialGradient(200, 100, 20, 200, 120, 80);
    hoodGradient.addColorStop(0, baseColor);
    hoodGradient.addColorStop(0.6, selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#404040' : '#dc2626');
    hoodGradient.addColorStop(1, selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#2a2a2a' : '#b91c1c');
    
    ctx.fillStyle = hoodGradient;
    ctx.beginPath();
    
    // Hood shape with natural draping
    ctx.moveTo(110, 180);
    ctx.quadraticCurveTo(120, 120, 150, 90);
    ctx.quadraticCurveTo(175, 70, 200, 75);
    ctx.quadraticCurveTo(225, 70, 250, 90);
    ctx.quadraticCurveTo(280, 120, 290, 180);
    
    // Hood opening
    ctx.quadraticCurveTo(250, 165, 200, 165);
    ctx.quadraticCurveTo(150, 165, 110, 180);
    
    ctx.fill();
    
    // Hood seam line
    ctx.strokeStyle = selectedColor === 'white' ? '#d0d0d0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(150, 90);
    ctx.quadraticCurveTo(175, 70, 200, 75);
    ctx.quadraticCurveTo(225, 70, 250, 90);
    ctx.stroke();
    
    // Drawstrings
    ctx.strokeStyle = selectedColor === 'white' ? '#cccccc' : '#888888';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // Left drawstring
    ctx.beginPath();
    ctx.moveTo(180, 165);
    ctx.quadraticCurveTo(185, 175, 175, 185);
    ctx.stroke();
    
    // Right drawstring
    ctx.beginPath();
    ctx.moveTo(220, 165);
    ctx.quadraticCurveTo(215, 175, 225, 185);
    ctx.stroke();
    
    // Kangaroo pocket with depth
    const pocketGradient = ctx.createLinearGradient(140, 285, 260, 340);
    pocketGradient.addColorStop(0, 'rgba(0,0,0,0.08)');
    pocketGradient.addColorStop(0.5, 'rgba(0,0,0,0.12)');
    pocketGradient.addColorStop(1, 'rgba(0,0,0,0.06)');
    
    ctx.fillStyle = pocketGradient;
    ctx.beginPath();
    ctx.moveTo(150, 285);
    ctx.quadraticCurveTo(145, 290, 145, 295);
    ctx.lineTo(145, 335);
    ctx.quadraticCurveTo(145, 345, 155, 350);
    ctx.lineTo(245, 350);
    ctx.quadraticCurveTo(255, 345, 255, 335);
    ctx.lineTo(255, 295);
    ctx.quadraticCurveTo(255, 290, 250, 285);
    ctx.closePath();
    ctx.fill();
    
    // Pocket opening highlight
    ctx.strokeStyle = selectedColor === 'white' ? '#e8e8e8' : selectedColor === 'black' ? '#444444' : '#b91c1c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 285);
    ctx.quadraticCurveTo(200, 280, 250, 285);
    ctx.stroke();
    
    // Main shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(200, 475, 125, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ribbing at bottom
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(100, 450, 200, 8);
  };

  const drawToteBagMockup = (ctx) => {
    const baseColor = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    // Create gradient for bag depth
    const bagGradient = ctx.createLinearGradient(60, 125, 340, 425);
    bagGradient.addColorStop(0, baseColor);
    bagGradient.addColorStop(0.3, selectedColor === 'white' ? '#fafafa' : selectedColor === 'black' ? '#404040' : '#e53e3e');
    bagGradient.addColorStop(0.7, selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#2a2a2a' : '#c53030');
    bagGradient.addColorStop(1, selectedColor === 'white' ? '#e8e8e8' : selectedColor === 'black' ? '#1a1a1a' : '#991b1b');
    
    ctx.fillStyle = bagGradient;
    
    // Tote bag body with natural shape
    ctx.beginPath();
    ctx.moveTo(75, 130);
    
    // Left side with slight curve
    ctx.quadraticCurveTo(65, 135, 65, 150);
    ctx.lineTo(65, 400);
    ctx.quadraticCurveTo(65, 420, 80, 425);
    
    // Bottom with curved corners
    ctx.lineTo(320, 425);
    ctx.quadraticCurveTo(335, 420, 335, 400);
    
    // Right side
    ctx.lineTo(335, 150);
    ctx.quadraticCurveTo(335, 135, 325, 130);
    
    // Top edge
    ctx.lineTo(75, 130);
    ctx.fill();
    
    // Top seam/fold
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.moveTo(75, 130);
    ctx.quadraticCurveTo(200, 125, 325, 130);
    ctx.quadraticCurveTo(325, 140, 325, 145);
    ctx.quadraticCurveTo(200, 140, 75, 145);
    ctx.quadraticCurveTo(75, 140, 75, 130);
    ctx.fill();
    
    // Handle straps with realistic curves
    const handleColor = selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#444444' : '#b91c1c';
    ctx.strokeStyle = handleColor;
    ctx.fillStyle = handleColor;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Left handle
    ctx.beginPath();
    ctx.moveTo(130, 130);
    ctx.quadraticCurveTo(125, 85, 140, 65);
    ctx.quadraticCurveTo(155, 55, 170, 65);
    ctx.quadraticCurveTo(175, 85, 170, 130);
    ctx.stroke();
    
    // Right handle
    ctx.beginPath();
    ctx.moveTo(230, 130);
    ctx.quadraticCurveTo(225, 85, 240, 65);
    ctx.quadraticCurveTo(255, 55, 270, 65);
    ctx.quadraticCurveTo(275, 85, 270, 130);
    ctx.stroke();
    
    // Handle attachment shadows for depth
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(130, 130, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(170, 130, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(230, 130, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(270, 130, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Side gusset shading for 3D effect
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.moveTo(65, 150);
    ctx.lineTo(75, 140);
    ctx.lineTo(75, 410);
    ctx.lineTo(65, 400);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(335, 150);
    ctx.lineTo(325, 140);
    ctx.lineTo(325, 410);
    ctx.lineTo(335, 400);
    ctx.closePath();
    ctx.fill();
    
    // Main shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(200, 440, 140, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSweatshirtMockup = (ctx) => {
    const baseColor = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    // Create gradient for sweatshirt depth
    const sweatshirtGradient = ctx.createLinearGradient(0, 170, 400, 440);
    sweatshirtGradient.addColorStop(0, baseColor);
    sweatshirtGradient.addColorStop(0.4, selectedColor === 'white' ? '#fafafa' : selectedColor === 'black' ? '#404040' : '#e53e3e');
    sweatshirtGradient.addColorStop(0.8, selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#2a2a2a' : '#c53030');
    sweatshirtGradient.addColorStop(1, selectedColor === 'white' ? '#e8e8e8' : selectedColor === 'black' ? '#1a1a1a' : '#991b1b');
    
    ctx.fillStyle = sweatshirtGradient;
    
    // Sweatshirt body with natural proportions
    ctx.beginPath();
    ctx.moveTo(115, 175);
    
    // Left shoulder and sleeve
    ctx.quadraticCurveTo(90, 155, 75, 170);
    ctx.quadraticCurveTo(60, 185, 70, 205);
    ctx.quadraticCurveTo(80, 225, 90, 245);
    ctx.lineTo(90, 425);
    
    // Ribbed bottom with curve
    ctx.quadraticCurveTo(90, 445, 105, 450);
    ctx.lineTo(295, 450);
    ctx.quadraticCurveTo(310, 445, 310, 425);
    
    // Right side seam
    ctx.lineTo(310, 245);
    ctx.quadraticCurveTo(320, 225, 330, 205);
    ctx.quadraticCurveTo(340, 185, 325, 170);
    ctx.quadraticCurveTo(310, 155, 285, 175);
    
    // Neckline - crew neck style
    ctx.quadraticCurveTo(245, 160, 200, 155);
    ctx.quadraticCurveTo(155, 160, 115, 175);
    
    ctx.fill();
    
    // Crew neckline with binding
    ctx.strokeStyle = selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(115, 175);
    ctx.quadraticCurveTo(155, 155, 200, 155);
    ctx.quadraticCurveTo(245, 155, 285, 175);
    ctx.stroke();
    
    // Inner neckline
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(125, 170);
    ctx.quadraticCurveTo(160, 160, 200, 160);
    ctx.quadraticCurveTo(240, 160, 275, 170);
    ctx.stroke();
    
    // Ribbed cuffs with realistic texture
    const ribColor = selectedColor === 'white' ? '#e8e8e8' : selectedColor === 'black' ? '#2a2a2a' : '#991b1b';
    ctx.fillStyle = ribColor;
    
    // Bottom ribbing
    ctx.beginPath();
    ctx.moveTo(105, 440);
    ctx.quadraticCurveTo(200, 435, 295, 440);
    ctx.quadraticCurveTo(300, 445, 295, 450);
    ctx.quadraticCurveTo(200, 445, 105, 450);
    ctx.quadraticCurveTo(100, 445, 105, 440);
    ctx.fill();
    
    // Rib texture lines
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const y = 441 + i * 2;
      ctx.beginPath();
      ctx.moveTo(105, y);
      ctx.quadraticCurveTo(200, y - 2, 295, y);
      ctx.stroke();
    }
    
    // Left sleeve cuff
    ctx.fillStyle = ribColor;
    ctx.beginPath();
    ctx.moveTo(85, 235);
    ctx.quadraticCurveTo(90, 240, 95, 245);
    ctx.lineTo(95, 255);
    ctx.quadraticCurveTo(90, 260, 85, 255);
    ctx.lineTo(85, 235);
    ctx.fill();
    
    // Right sleeve cuff
    ctx.beginPath();
    ctx.moveTo(315, 235);
    ctx.quadraticCurveTo(310, 240, 305, 245);
    ctx.lineTo(305, 255);
    ctx.quadraticCurveTo(310, 260, 315, 255);
    ctx.lineTo(315, 235);
    ctx.fill();
    
    // Sleeve shadows for depth
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.moveTo(90, 205);
    ctx.quadraticCurveTo(95, 225, 98, 245);
    ctx.lineTo(102, 425);
    ctx.quadraticCurveTo(98, 430, 90, 425);
    ctx.lineTo(90, 205);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(310, 205);
    ctx.quadraticCurveTo(305, 225, 302, 245);
    ctx.lineTo(298, 425);
    ctx.quadraticCurveTo(302, 430, 310, 425);
    ctx.lineTo(310, 205);
    ctx.fill();
    
    // Main shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(200, 465, 120, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawDressMockup = (ctx) => {
    const baseColor = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    // Create gradient for dress flow
    const dressGradient = ctx.createLinearGradient(0, 150, 400, 450);
    dressGradient.addColorStop(0, baseColor);
    dressGradient.addColorStop(0.3, selectedColor === 'white' ? '#fafafa' : selectedColor === 'black' ? '#404040' : '#e53e3e');
    dressGradient.addColorStop(0.6, selectedColor === 'white' ? '#f5f5f5' : selectedColor === 'black' ? '#333333' : '#dc2626');
    dressGradient.addColorStop(1, selectedColor === 'white' ? '#eeeeee' : selectedColor === 'black' ? '#1a1a1a' : '#b91c1c');
    
    ctx.fillStyle = dressGradient;
    
    // Dress with flowing silhouette
    ctx.beginPath();
    ctx.moveTo(130, 165);
    
    // Left shoulder with gentle curve
    ctx.quadraticCurveTo(110, 145, 95, 160);
    ctx.quadraticCurveTo(80, 175, 90, 195);
    
    // Left side seam with waist definition
    ctx.quadraticCurveTo(100, 220, 110, 250);
    ctx.quadraticCurveTo(115, 280, 125, 320);
    
    // Flowing skirt
    ctx.quadraticCurveTo(135, 360, 145, 400);
    ctx.quadraticCurveTo(150, 430, 160, 450);
    
    // Hem with natural drape
    ctx.bezierCurveTo(180, 455, 220, 460, 260, 455);
    ctx.bezierCurveTo(300, 450, 330, 445, 340, 440);
    
    // Right side flowing back up
    ctx.quadraticCurveTo(335, 420, 330, 400);
    ctx.quadraticCurveTo(320, 360, 310, 320);
    
    // Right waist
    ctx.quadraticCurveTo(305, 280, 300, 250);
    ctx.quadraticCurveTo(290, 220, 305, 195);
    
    // Right shoulder
    ctx.quadraticCurveTo(320, 175, 305, 160);
    ctx.quadraticCurveTo(290, 145, 270, 165);
    
    // Neckline - scoop neck
    ctx.bezierCurveTo(250, 150, 225, 145, 200, 145);
    ctx.bezierCurveTo(175, 145, 150, 150, 130, 165);
    
    ctx.fill();
    
    // Scoop neckline detail
    ctx.strokeStyle = selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(130, 165);
    ctx.bezierCurveTo(150, 145, 175, 140, 200, 140);
    ctx.bezierCurveTo(225, 140, 250, 145, 270, 165);
    ctx.stroke();
    
    // Waist seam for definition
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(110, 250);
    ctx.quadraticCurveTo(200, 245, 290, 250);
    ctx.stroke();
    
    // Side seam shading for form
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.beginPath();
    ctx.moveTo(110, 250);
    ctx.quadraticCurveTo(115, 280, 125, 320);
    ctx.quadraticCurveTo(135, 360, 145, 400);
    ctx.lineTo(155, 400);
    ctx.quadraticCurveTo(145, 360, 135, 320);
    ctx.quadraticCurveTo(125, 280, 120, 250);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(290, 250);
    ctx.quadraticCurveTo(285, 280, 275, 320);
    ctx.quadraticCurveTo(265, 360, 255, 400);
    ctx.lineTo(265, 400);
    ctx.quadraticCurveTo(275, 360, 285, 320);
    ctx.quadraticCurveTo(295, 280, 300, 250);
    ctx.closePath();
    ctx.fill();
    
    // Subtle princess seams for structure
    ctx.strokeStyle = 'rgba(0,0,0,0.03)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(160, 180);
    ctx.quadraticCurveTo(165, 220, 170, 260);
    ctx.quadraticCurveTo(175, 300, 185, 340);
    ctx.quadraticCurveTo(195, 380, 210, 420);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(240, 180);
    ctx.quadraticCurveTo(235, 220, 230, 260);
    ctx.quadraticCurveTo(225, 300, 215, 340);
    ctx.quadraticCurveTo(205, 380, 190, 420);
    ctx.stroke();
    
    // Dress shadow with flowing edge
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(200, 465, 90, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Additional shadow for flowing fabric
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.beginPath();
    ctx.ellipse(220, 460, 60, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawHatMockup = (ctx) => {
    const baseColor = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    // Create gradient for cap crown
    const crownGradient = ctx.createRadialGradient(200, 180, 20, 200, 200, 100);
    crownGradient.addColorStop(0, baseColor);
    crownGradient.addColorStop(0.4, selectedColor === 'white' ? '#f8f8f8' : selectedColor === 'black' ? '#404040' : '#e53e3e');
    crownGradient.addColorStop(0.8, selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#2a2a2a' : '#c53030');
    crownGradient.addColorStop(1, selectedColor === 'white' ? '#e8e8e8' : selectedColor === 'black' ? '#1a1a1a' : '#991b1b');
    
    ctx.fillStyle = crownGradient;
    
    // Baseball cap crown with realistic shape
    ctx.beginPath();
    ctx.moveTo(120, 250);
    
    // Left side of crown
    ctx.quadraticCurveTo(110, 230, 115, 210);
    ctx.quadraticCurveTo(125, 180, 140, 160);
    ctx.quadraticCurveTo(160, 140, 180, 135);
    
    // Top of crown
    ctx.quadraticCurveTo(190, 130, 200, 130);
    ctx.quadraticCurveTo(210, 130, 220, 135);
    
    // Right side of crown
    ctx.quadraticCurveTo(240, 140, 260, 160);
    ctx.quadraticCurveTo(275, 180, 285, 210);
    ctx.quadraticCurveTo(290, 230, 280, 250);
    
    // Back to start (front of hat)
    ctx.quadraticCurveTo(240, 255, 200, 255);
    ctx.quadraticCurveTo(160, 255, 120, 250);
    
    ctx.fill();
    
    // Crown panels with seam lines
    ctx.strokeStyle = selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.lineWidth = 1.5;
    
    // Front panel seam
    ctx.beginPath();
    ctx.moveTo(200, 130);
    ctx.quadraticCurveTo(200, 180, 200, 225);
    ctx.stroke();
    
    // Side panel seams
    ctx.beginPath();
    ctx.moveTo(160, 145);
    ctx.quadraticCurveTo(165, 190, 175, 235);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(240, 145);
    ctx.quadraticCurveTo(235, 190, 225, 235);
    ctx.stroke();
    
    // Eyelets for ventilation
    ctx.fillStyle = selectedColor === 'white' ? '#d0d0d0' : selectedColor === 'black' ? '#666666' : '#991b1b';
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + Math.PI / 6;
      const x = 200 + Math.cos(angle) * 65;
      const y = 200 + Math.sin(angle) * 35;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyelet holes
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = selectedColor === 'white' ? '#d0d0d0' : selectedColor === 'black' ? '#666666' : '#991b1b';
    }
    
    // Bill/Visor with 3D effect
    const billGradient = ctx.createLinearGradient(120, 260, 280, 300);
    billGradient.addColorStop(0, baseColor);
    billGradient.addColorStop(0.3, selectedColor === 'white' ? '#f5f5f5' : selectedColor === 'black' ? '#404040' : '#dc2626');
    billGradient.addColorStop(0.7, selectedColor === 'white' ? '#eeeeee' : selectedColor === 'black' ? '#2a2a2a' : '#b91c1c');
    billGradient.addColorStop(1, selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#1a1a1a' : '#991b1b');
    
    ctx.fillStyle = billGradient;
    ctx.beginPath();
    
    // Bill shape with natural curve
    ctx.moveTo(120, 250);
    ctx.quadraticCurveTo(140, 265, 170, 275);
    ctx.quadraticCurveTo(185, 280, 200, 282);
    ctx.quadraticCurveTo(215, 280, 230, 275);
    ctx.quadraticCurveTo(260, 265, 280, 250);
    
    // Bill edge
    ctx.quadraticCurveTo(270, 255, 250, 262);
    ctx.quadraticCurveTo(225, 268, 200, 270);
    ctx.quadraticCurveTo(175, 268, 150, 262);
    ctx.quadraticCurveTo(130, 255, 120, 250);
    
    ctx.fill();
    
    // Bill stitching line
    ctx.strokeStyle = selectedColor === 'white' ? '#d0d0d0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(130, 252);
    ctx.quadraticCurveTo(165, 267, 200, 270);
    ctx.quadraticCurveTo(235, 267, 270, 252);
    ctx.stroke();
    
    // Button on top
    const buttonGradient = ctx.createRadialGradient(200, 130, 2, 200, 130, 8);
    buttonGradient.addColorStop(0, baseColor);
    buttonGradient.addColorStop(0.7, selectedColor === 'white' ? '#e8e8e8' : selectedColor === 'black' ? '#404040' : '#c53030');
    buttonGradient.addColorStop(1, selectedColor === 'white' ? '#d0d0d0' : selectedColor === 'black' ? '#2a2a2a' : '#991b1b');
    
    ctx.fillStyle = buttonGradient;
    ctx.beginPath();
    ctx.arc(200, 130, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Button detail
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(200, 130, 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Adjustment strap at back
    ctx.fillStyle = selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#444444' : '#b91c1c';
    ctx.fillRect(195, 245, 10, 12);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(200, 295, 85, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawBraMockup = (ctx) => {
    const baseColor = selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#333333' : '#dc2626';
    
    // Create gradient for sports bra
    const braGradient = ctx.createRadialGradient(200, 230, 20, 200, 250, 100);
    braGradient.addColorStop(0, baseColor);
    braGradient.addColorStop(0.4, selectedColor === 'white' ? '#f8f8f8' : selectedColor === 'black' ? '#404040' : '#e53e3e');
    braGradient.addColorStop(0.8, selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#2a2a2a' : '#c53030');
    braGradient.addColorStop(1, selectedColor === 'white' ? '#e8e8e8' : selectedColor === 'black' ? '#1a1a1a' : '#991b1b');
    
    ctx.fillStyle = braGradient;
    
    // Sports bra with realistic contours
    ctx.beginPath();
    
    // Left cup
    ctx.moveTo(130, 210);
    ctx.quadraticCurveTo(120, 190, 135, 175);
    ctx.quadraticCurveTo(155, 160, 180, 165);
    ctx.quadraticCurveTo(195, 170, 200, 185);
    
    // Center connecting piece
    ctx.quadraticCurveTo(200, 175, 200, 165);
    ctx.quadraticCurveTo(200, 175, 200, 185);
    
    // Right cup
    ctx.quadraticCurveTo(205, 170, 220, 165);
    ctx.quadraticCurveTo(245, 160, 265, 175);
    ctx.quadraticCurveTo(280, 190, 270, 210);
    
    // Right side band
    ctx.quadraticCurveTo(285, 230, 290, 250);
    ctx.quadraticCurveTo(285, 270, 275, 285);
    
    // Bottom band
    ctx.quadraticCurveTo(240, 295, 200, 300);
    ctx.quadraticCurveTo(160, 295, 125, 285);
    
    // Left side band
    ctx.quadraticCurveTo(115, 270, 110, 250);
    ctx.quadraticCurveTo(115, 230, 130, 210);
    
    ctx.fill();
    
    // Cup seaming with realistic stitching
    ctx.strokeStyle = selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.lineWidth = 1.5;
    
    // Left cup seam
    ctx.beginPath();
    ctx.moveTo(135, 175);
    ctx.quadraticCurveTo(155, 160, 180, 165);
    ctx.quadraticCurveTo(190, 170, 200, 185);
    ctx.stroke();
    
    // Right cup seam
    ctx.beginPath();
    ctx.moveTo(265, 175);
    ctx.quadraticCurveTo(245, 160, 220, 165);
    ctx.quadraticCurveTo(210, 170, 200, 185);
    ctx.stroke();
    
    // Under-bust band seaming
    ctx.strokeStyle = selectedColor === 'white' ? '#d0d0d0' : selectedColor === 'black' ? '#666666' : '#b91c1c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(125, 285);
    ctx.quadraticCurveTo(160, 290, 200, 295);
    ctx.quadraticCurveTo(240, 290, 275, 285);
    ctx.stroke();
    
    // Straps with realistic curves
    const strapColor = selectedColor === 'white' ? '#f0f0f0' : selectedColor === 'black' ? '#444444' : '#b91c1c';
    ctx.strokeStyle = strapColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // Left strap
    ctx.beginPath();
    ctx.moveTo(145, 180);
    ctx.quadraticCurveTo(140, 150, 135, 120);
    ctx.quadraticCurveTo(130, 100, 125, 85);
    ctx.stroke();
    
    // Right strap
    ctx.beginPath();
    ctx.moveTo(255, 180);
    ctx.quadraticCurveTo(260, 150, 265, 120);
    ctx.quadraticCurveTo(270, 100, 275, 85);
    ctx.stroke();
    
    // Strap adjusters
    ctx.fillStyle = selectedColor === 'white' ? '#e0e0e0' : selectedColor === 'black' ? '#555555' : '#991b1b';
    ctx.fillRect(130, 110, 10, 6);
    ctx.fillRect(260, 110, 10, 6);
    
    // Center logo area or design placement
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    ctx.beginPath();
    ctx.arc(200, 225, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Subtle cup shaping with highlights
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    
    // Left cup highlight
    ctx.beginPath();
    ctx.moveTo(150, 185);
    ctx.quadraticCurveTo(165, 175, 180, 180);
    ctx.quadraticCurveTo(190, 185, 195, 195);
    ctx.quadraticCurveTo(185, 200, 170, 205);
    ctx.quadraticCurveTo(155, 200, 150, 185);
    ctx.fill();
    
    // Right cup highlight
    ctx.beginPath();
    ctx.moveTo(250, 185);
    ctx.quadraticCurveTo(235, 175, 220, 180);
    ctx.quadraticCurveTo(210, 185, 205, 195);
    ctx.quadraticCurveTo(215, 200, 230, 205);
    ctx.quadraticCurveTo(245, 200, 250, 185);
    ctx.fill();
    
    // Band elasticity texture
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 8; i++) {
      const y = 280 + i * 2;
      ctx.beginPath();
      ctx.moveTo(130, y);
      ctx.quadraticCurveTo(200, y + 1, 270, y);
      ctx.stroke();
    }
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(200, 315, 80, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawDesignOnProduct = (ctx) => {
    if (!design) return;

    // Position design based on product type and current angle
    let designX = 200;
    let designY = 280;
    const currentImage = getCurrentImage();
    
    // Adjust position based on viewing angle
    if (currentImage?.angle === 180) {
      designY = 320; // Back view, design lower
    } else if (currentImage?.angle === 90 || currentImage?.angle === 270) {
      designX = currentImage.angle === 90 ? 350 : 50; // Side views
    }

    ctx.save();
    ctx.translate(designX, designY);
    
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
            <Badge variant="secondary">{currentVariant.name}</Badge>
            <Badge variant="outline">Size {selectedSize}</Badge>
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
              <ZoomIn className="w-4 h-4" />
              Zoom
            </h3>
            <div className="space-y-3">
              <Slider
                value={[zoomLevel]}
                onValueChange={handleZoom}
                min={50}
                max={200}
                step={5}
                className="w-full"
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
                  transform: `scale(${zoomLevel / 100})`,
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

EnhancedMockupViewer.propTypes = {
  design: PropTypes.object,
  onExport: PropTypes.func
};

export default EnhancedMockupViewer;