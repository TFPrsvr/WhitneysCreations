import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DesignCanvas = ({ onDesignChange, initialDesign = null }) => {
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('text');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectionMode, setSelectionMode] = useState('single'); // 'single', 'rectangle', 'circle', 'freeform'
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [freeformPath, setFreeformPath] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [toolPanelCollapsed, setToolPanelCollapsed] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setToolPanelCollapsed(window.innerWidth <= 768); // Auto-collapse on mobile
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [designElements, setDesignElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Save current state to history
  const saveToHistory = () => {
    const currentState = {
      elements: [...designElements],
      settings: { ...canvasSettings },
      timestamp: Date.now()
    };
    
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  };
  
  // Undo last action
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      
      setDesignElements(previousState.elements);
      setCanvasSettings(previousState.settings);
      setHistoryIndex(newIndex);
    }
  };
  
  // Redo last undone action
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      
      setDesignElements(nextState.elements);
      setCanvasSettings(nextState.settings);
      setHistoryIndex(newIndex);
    }
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when canvas is focused or no input is focused
      const isInputFocused = document.activeElement && 
        (document.activeElement.tagName === 'INPUT' || 
         document.activeElement.tagName === 'TEXTAREA' ||
         document.activeElement.contentEditable === 'true');
      
      if (!isInputFocused && (e.ctrlKey || e.metaKey)) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);
  const [canvasSettings, setCanvasSettings] = useState({
    width: 400,
    height: 400,
    backgroundColor: '#ffffff',
    gridEnabled: true,
    snapToGrid: true,
    gridSize: 20
  });

  const [textSettings, setTextSettings] = useState({
    text: 'Your Text Here',
    fontFamily: 'Arial',
    fontSize: 32,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center'
  });

  const [drawSettings, setDrawSettings] = useState({
    strokeColor: '#000000',
    strokeWidth: 3,
    fillColor: 'transparent'
  });

  const tools = [
    { id: 'select', name: 'Select', icon: '🖱️' },
    { id: 'text', name: 'Text', icon: '📝' },
    { id: 'draw', name: 'Draw', icon: '✏️' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬛' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'image', name: 'Image', icon: '🖼️' }
  ];
  
  const selectionModes = [
    { id: 'single', name: 'Single', icon: '👆', description: 'Click to select individual elements' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜', description: 'Drag to select elements in rectangle' },
    { id: 'circle', name: 'Circle', icon: '⭕', description: 'Drag to select elements in circle' },
    { id: 'freeform', name: 'Freeform', icon: '✏️', description: 'Draw to select elements in custom shape' }
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSettings.width;
    canvas.height = canvasSettings.height;
    drawCanvas();
  }, [canvasSettings, designElements]);

  // Load initial design if provided
  useEffect(() => {
    if (initialDesign && initialDesign.elements) {
      setDesignElements(initialDesign.elements);
      if (initialDesign.settings) {
        setCanvasSettings(prev => ({ ...prev, ...initialDesign.settings }));
      }
      
      // Initialize history with the loaded design
      const initialState = {
        elements: initialDesign.elements,
        settings: initialDesign.settings || canvasSettings,
        timestamp: Date.now()
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    } else {
      // Initialize with empty canvas state
      const emptyState = {
        elements: [],
        settings: canvasSettings,
        timestamp: Date.now()
      };
      setHistory([emptyState]);
      setHistoryIndex(0);
    }
  }, [initialDesign]);

  // Notify parent of design changes
  useEffect(() => {
    if (onDesignChange) {
      onDesignChange({
        elements: designElements,
        settings: canvasSettings
      });
    }
  }, [designElements, canvasSettings]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = canvasSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (canvasSettings.gridEnabled) {
      drawGrid(ctx);
    }

    // Draw all design elements
    designElements.forEach((element, index) => {
      const isSelected = index === selectedElement || selectedElements.includes(index);
      drawElement(ctx, element, isSelected);
    });
    
    // Draw selection area
    if (isSelecting && tool === 'select' && selectionStart && selectionEnd) {
      drawSelectionArea(ctx);
    }
  };

  const drawGrid = (ctx) => {
    const { width, height } = canvasSettings;
    const gridSize = canvasSettings.gridSize;
    
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx, element, isSelected) => {
    ctx.save();
    
    // Apply transformations
    if (element.rotation) {
      const centerX = element.x + (element.width || 0) / 2;
      const centerY = element.y + (element.height || 0) / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    switch (element.type) {
      case 'text':
        drawTextElement(ctx, element);
        break;
      case 'rectangle':
        drawRectangleElement(ctx, element);
        break;
      case 'circle':
        drawCircleElement(ctx, element);
        break;
      case 'line':
        drawLineElement(ctx, element);
        break;
      case 'path':
        drawPathElement(ctx, element);
        break;
      case 'image':
        drawImageElement(ctx, element);
        break;
      case 'sticker':
        drawStickerElement(ctx, element);
        break;
    }

    // Draw selection outline
    if (isSelected) {
      ctx.strokeStyle = '#007acc';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(element.x - 2, element.y - 2, (element.width || 100) + 4, (element.height || 30) + 4);
      ctx.setLineDash([]);
      
      // Draw resize handles for single selected element
      if (selectedElements.length <= 1) {
        const handleSize = 6;
        const x = element.x;
        const y = element.y;
        const w = element.width || 100;
        const h = element.height || 30;
        
        ctx.fillStyle = '#007acc';
        // Corner handles
        ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + w - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x - handleSize/2, y + h - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + w - handleSize/2, y + h - handleSize/2, handleSize, handleSize);
        // Side handles
        ctx.fillRect(x + w/2 - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + w/2 - handleSize/2, y + h - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x - handleSize/2, y + h/2 - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + w - handleSize/2, y + h/2 - handleSize/2, handleSize, handleSize);
      }
    }
    
    ctx.restore();
  };

  const drawTextElement = (ctx, element) => {
    ctx.font = `${element.fontWeight || '400'} ${element.fontSize || 32}px ${element.fontFamily || 'Arial'}`;
    ctx.fillStyle = element.color || '#000000';
    ctx.textAlign = element.textAlign || 'left';
    ctx.textBaseline = 'top';
    
    if (element.outline) {
      ctx.strokeStyle = element.outlineColor || '#000000';
      ctx.lineWidth = element.outlineWidth || 2;
      ctx.strokeText(element.text || '', element.x, element.y);
    }
    
    ctx.fillText(element.text || '', element.x, element.y);
  };

  const drawRectangleElement = (ctx, element) => {
    if (element.fillColor && element.fillColor !== 'transparent') {
      ctx.fillStyle = element.fillColor;
      ctx.fillRect(element.x, element.y, element.width, element.height);
    }
    
    if (element.strokeColor && element.strokeWidth > 0) {
      ctx.strokeStyle = element.strokeColor;
      ctx.lineWidth = element.strokeWidth;
      ctx.strokeRect(element.x, element.y, element.width, element.height);
    }
  };

  const drawCircleElement = (ctx, element) => {
    const radius = Math.min(element.width, element.height) / 2;
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    if (element.fillColor && element.fillColor !== 'transparent') {
      ctx.fillStyle = element.fillColor;
      ctx.fill();
    }
    
    if (element.strokeColor && element.strokeWidth > 0) {
      ctx.strokeStyle = element.strokeColor;
      ctx.lineWidth = element.strokeWidth;
      ctx.stroke();
    }
  };

  const drawLineElement = (ctx, element) => {
    ctx.strokeStyle = element.strokeColor || '#000000';
    ctx.lineWidth = element.strokeWidth || 2;
    ctx.beginPath();
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(element.x2, element.y2);
    ctx.stroke();
  };

  const drawPathElement = (ctx, element) => {
    if (!element.path || element.path.length < 2) return;
    
    ctx.strokeStyle = element.strokeColor || '#000000';
    ctx.lineWidth = element.strokeWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(element.path[0].x, element.path[0].y);
    
    for (let i = 1; i < element.path.length; i++) {
      ctx.lineTo(element.path[i].x, element.path[i].y);
    }
    
    ctx.stroke();
  };

  const drawImageElement = (ctx, element) => {
    if (element.image) {
      ctx.drawImage(element.image, element.x, element.y, element.width, element.height);
    } else {
      // Placeholder for image
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(element.x, element.y, element.width, element.height);
      ctx.strokeStyle = '#cccccc';
      ctx.strokeRect(element.x, element.y, element.width, element.height);
      
      // Image icon
      ctx.fillStyle = '#666666';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🖼️', element.x + element.width/2, element.y + element.height/2);
    }
  };
  
  const drawStickerElement = (ctx, element) => {
    ctx.save();
    
    if (element.stickerType === 'text' && element.style) {
      // Handle styled text badges
      const style = element.style;
      
      // Set up text properties
      ctx.font = `${style.fontWeight || 'bold'} ${style.fontSize || '12px'} Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Measure text to get proper dimensions
      const textMetrics = ctx.measureText(element.content);
      const textWidth = textMetrics.width;
      const textHeight = parseInt(style.fontSize || '12px');
      
      const padding = 8;
      const badgeWidth = textWidth + (padding * 2);
      const badgeHeight = textHeight + (padding * 2);
      
      // Draw background
      if (style.background) {
        ctx.fillStyle = style.background;
        if (style.borderRadius) {
          // Draw rounded rectangle manually
          const radius = parseInt(style.borderRadius);
          const x = element.x;
          const y = element.y;
          const width = badgeWidth;
          const height = badgeHeight;
          
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(element.x, element.y, badgeWidth, badgeHeight);
        }
      }
      
      // Draw text
      ctx.fillStyle = style.color || '#000000';
      ctx.fillText(
        element.content, 
        element.x + badgeWidth / 2, 
        element.y + badgeHeight / 2
      );
    } else {
      // Handle emoji and symbol stickers
      ctx.font = `${element.fontSize || 32}px Arial`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = element.color || '#000000';
      ctx.fillText(element.content, element.x, element.y);
    }
    
    ctx.restore();
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Scale for canvas size vs display size
    x = x * (canvas.width / rect.width);
    y = y * (canvas.height / rect.height);
    
    // Snap to grid if enabled
    if (canvasSettings.snapToGrid && canvasSettings.gridEnabled) {
      x = Math.round(x / canvasSettings.gridSize) * canvasSettings.gridSize;
      y = Math.round(y / canvasSettings.gridSize) * canvasSettings.gridSize;
    }
    
    return { x, y };
  };

  const handleCanvasMouseDown = (e) => {
    const pos = getMousePos(e);
    
    if (tool === 'select') {
      if (selectionMode === 'single') {
        // Find clicked element
        const clickedElement = findElementAtPosition(pos.x, pos.y);
        setSelectedElement(clickedElement);
        setSelectedElements(clickedElement !== null ? [clickedElement] : []);
      } else {
        // Start area selection
        setIsSelecting(true);
        setSelectionStart(pos);
        setSelectionEnd(pos);
        setSelectedElement(null);
        setSelectedElements([]);
        
        if (selectionMode === 'freeform') {
          setFreeformPath([pos]);
        }
      }
    } else if (tool === 'text') {
      addTextElement(pos.x, pos.y);
    } else if (tool === 'draw') {
      startDrawing(pos.x, pos.y);
    } else if (tool === 'rectangle') {
      addRectangleElement(pos.x, pos.y);
    } else if (tool === 'circle') {
      addCircleElement(pos.x, pos.y);
    } else if (tool === 'line') {
      startLineDrawing(pos.x, pos.y);
    }
  };

  const handleCanvasMouseMove = (e) => {
    const pos = getMousePos(e);
    
    if (isDrawing && tool === 'draw') {
      continueDrawing(pos.x, pos.y);
    } else if (isSelecting && tool === 'select') {
      setSelectionEnd(pos);
      
      if (selectionMode === 'freeform') {
        setFreeformPath(prev => [...prev, pos]);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    
    if (isSelecting && tool === 'select' && selectionStart && selectionEnd) {
      // Find elements within selection area
      const elementsInSelection = findElementsInSelection();
      setSelectedElements(elementsInSelection);
      
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      setFreeformPath([]);
    }
  };
  
  // Touch event handlers for mobile
  const getTouchPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    
    // Scale for canvas size vs display size
    x = x * (canvas.width / rect.width);
    y = y * (canvas.height / rect.height);
    
    // Snap to grid if enabled
    if (canvasSettings.snapToGrid && canvasSettings.gridEnabled) {
      x = Math.round(x / canvasSettings.gridSize) * canvasSettings.gridSize;
      y = Math.round(y / canvasSettings.gridSize) * canvasSettings.gridSize;
    }
    
    return { x, y };
  };
  
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent scrolling
    
    if (e.touches.length === 1) {
      // Single touch - treat as mouse down
      const pos = getTouchPos(e);
      
      if (tool === 'select') {
        if (selectionMode === 'single') {
          const clickedElement = findElementAtPosition(pos.x, pos.y);
          setSelectedElement(clickedElement);
          setSelectedElements(clickedElement !== null ? [clickedElement] : []);
        } else {
          setIsSelecting(true);
          setSelectionStart(pos);
          setSelectionEnd(pos);
          setSelectedElement(null);
          setSelectedElements([]);
          
          if (selectionMode === 'freeform') {
            setFreeformPath([pos]);
          }
        }
      } else if (tool === 'text') {
        addTextElement(pos.x, pos.y);
      } else if (tool === 'draw') {
        startDrawing(pos.x, pos.y);
      } else if (tool === 'rectangle') {
        addRectangleElement(pos.x, pos.y);
      } else if (tool === 'circle') {
        addCircleElement(pos.x, pos.y);
      } else if (tool === 'line') {
        startLineDrawing(pos.x, pos.y);
      }
    }
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const pos = getTouchPos(e);
      
      if (isDrawing && tool === 'draw') {
        continueDrawing(pos.x, pos.y);
      } else if (isSelecting && tool === 'select') {
        setSelectionEnd(pos);
        
        if (selectionMode === 'freeform') {
          setFreeformPath(prev => [...prev, pos]);
        }
      }
    }
  };
  
  const handleTouchEnd = (e) => {
    e.preventDefault();
    
    setIsDrawing(false);
    
    if (isSelecting && tool === 'select' && selectionStart && selectionEnd) {
      const elementsInSelection = findElementsInSelection();
      setSelectedElements(elementsInSelection);
      
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      setFreeformPath([]);
    }
  };

  const findElementAtPosition = (x, y) => {
    for (let i = designElements.length - 1; i >= 0; i--) {
      const element = designElements[i];
      if (x >= element.x && x <= element.x + (element.width || 100) &&
          y >= element.y && y <= element.y + (element.height || 30)) {
        return i;
      }
    }
    return null;
  };
  
  const findElementsInSelection = () => {
    if (!selectionStart || !selectionEnd) return [];
    
    const selectedIndices = [];
    
    for (let i = 0; i < designElements.length; i++) {
      const element = designElements[i];
      const elementCenterX = element.x + (element.width || 100) / 2;
      const elementCenterY = element.y + (element.height || 30) / 2;
      
      let isInSelection = false;
      
      switch (selectionMode) {
        case 'rectangle': {
          const minX = Math.min(selectionStart.x, selectionEnd.x);
          const maxX = Math.max(selectionStart.x, selectionEnd.x);
          const minY = Math.min(selectionStart.y, selectionEnd.y);
          const maxY = Math.max(selectionStart.y, selectionEnd.y);
          
          isInSelection = elementCenterX >= minX && elementCenterX <= maxX &&
                         elementCenterY >= minY && elementCenterY <= maxY;
          break;
        }
        
        case 'circle': {
          const centerX = (selectionStart.x + selectionEnd.x) / 2;
          const centerY = (selectionStart.y + selectionEnd.y) / 2;
          const radius = Math.sqrt(
            Math.pow(selectionEnd.x - selectionStart.x, 2) +
            Math.pow(selectionEnd.y - selectionStart.y, 2)
          ) / 2;
          
          const distance = Math.sqrt(
            Math.pow(elementCenterX - centerX, 2) +
            Math.pow(elementCenterY - centerY, 2)
          );
          
          isInSelection = distance <= radius;
          break;
        }
        
        case 'freeform': {
          // Use point-in-polygon algorithm
          isInSelection = isPointInPolygon(elementCenterX, elementCenterY, freeformPath);
          break;
        }
      }
      
      if (isInSelection) {
        selectedIndices.push(i);
      }
    }
    
    return selectedIndices;
  };
  
  // Point-in-polygon algorithm for freeform selection
  const isPointInPolygon = (x, y, polygon) => {
    if (polygon.length < 3) return false;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].y > y) !== (polygon[j].y > y)) &&
          (x < (polygon[j].x - polygon[i].x) * (y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
        inside = !inside;
      }
    }
    return inside;
  };

  const addTextElement = (x, y) => {
    saveToHistory();
    
    const newElement = {
      type: 'text',
      id: Date.now(),
      x,
      y,
      ...textSettings,
      width: 200,
      height: textSettings.fontSize * 1.2
    };
    
    setDesignElements(prev => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const addRectangleElement = (x, y) => {
    saveToHistory();
    
    const newElement = {
      type: 'rectangle',
      id: Date.now(),
      x,
      y,
      width: 100,
      height: 100,
      ...drawSettings
    };
    
    setDesignElements(prev => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const addCircleElement = (x, y) => {
    saveToHistory();
    
    const newElement = {
      type: 'circle',
      id: Date.now(),
      x,
      y,
      width: 100,
      height: 100,
      ...drawSettings
    };
    
    setDesignElements(prev => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const startDrawing = (x, y) => {
    saveToHistory();
    
    setIsDrawing(true);
    const newElement = {
      type: 'path',
      id: Date.now(),
      path: [{ x, y }],
      ...drawSettings
    };
    
    setDesignElements(prev => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const continueDrawing = (x, y) => {
    if (selectedElement !== null) {
      setDesignElements(prev => {
        const updated = [...prev];
        updated[selectedElement].path.push({ x, y });
        return updated;
      });
    }
  };

  const startLineDrawing = (x, y) => {
    saveToHistory();
    
    const newElement = {
      type: 'line',
      id: Date.now(),
      x,
      y,
      x2: x + 100,
      y2: y,
      ...drawSettings
    };
    
    setDesignElements(prev => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const updateSelectedElement = (updates) => {
    if (selectedElement !== null) {
      saveToHistory();
      
      setDesignElements(prev => {
        const updated = [...prev];
        updated[selectedElement] = { ...updated[selectedElement], ...updates };
        return updated;
      });
    }
  };

  const deleteSelectedElement = () => {
    if (selectedElement !== null) {
      saveToHistory();
      
      setDesignElements(prev => prev.filter((_, index) => index !== selectedElement));
      setSelectedElement(null);
    }
  };

  const duplicateSelectedElement = () => {
    if (selectedElement !== null) {
      saveToHistory();
      
      const element = designElements[selectedElement];
      const duplicated = {
        ...element,
        id: Date.now(),
        x: element.x + 20,
        y: element.y + 20
      };
      setDesignElements(prev => [...prev, duplicated]);
      setSelectedElement(designElements.length);
    }
  };

  const drawSelectionArea = (ctx) => {
    ctx.save();
    ctx.strokeStyle = '#007acc';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.fillStyle = 'rgba(0, 122, 204, 0.1)';
    
    switch (selectionMode) {
      case 'rectangle': {
        const width = selectionEnd.x - selectionStart.x;
        const height = selectionEnd.y - selectionStart.y;
        
        ctx.fillRect(selectionStart.x, selectionStart.y, width, height);
        ctx.strokeRect(selectionStart.x, selectionStart.y, width, height);
        break;
      }
      
      case 'circle': {
        const centerX = (selectionStart.x + selectionEnd.x) / 2;
        const centerY = (selectionStart.y + selectionEnd.y) / 2;
        const radius = Math.sqrt(
          Math.pow(selectionEnd.x - selectionStart.x, 2) +
          Math.pow(selectionEnd.y - selectionStart.y, 2)
        ) / 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      }
      
      case 'freeform': {
        if (freeformPath.length > 2) {
          ctx.beginPath();
          ctx.moveTo(freeformPath[0].x, freeformPath[0].y);
          for (let i = 1; i < freeformPath.length; i++) {
            ctx.lineTo(freeformPath[i].x, freeformPath[i].y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        break;
      }
    }
    
    ctx.restore();
  };
  
  const clearCanvas = () => {
    saveToHistory();
    
    setDesignElements([]);
    setSelectedElement(null);
    setSelectedElements([]);
  };

  const generateExportData = () => {
    return {
      canvas: canvasRef.current?.toDataURL('image/png'),
      elements: designElements,
      settings: canvasSettings,
      timestamp: new Date().toISOString()
    };
  };

  const exportDesign = () => {
    if (!isAuthenticated) {
      alert('Please sign in to export designs');
      return;
    }

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `design-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const currentElement = selectedElement !== null ? designElements[selectedElement] : null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="header-primary">Design Canvas</h2>
        <div className={`flex items-center gap-2 ${isMobile ? 'flex-wrap' : 'space-x-2'}`}>
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="btn-secondary"
            title="Undo (Ctrl+Z)"
          >
            <span>↶</span>
            <span className={isMobile ? 'hidden' : 'hidden sm:inline'}>Undo</span>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="btn-secondary"
            title="Redo (Ctrl+Y)"
          >
            <span>↷</span>
            <span className={isMobile ? 'hidden' : 'hidden sm:inline'}>Redo</span>
          </button>
          <button
            onClick={clearCanvas}
            className="btn-action-red"
          >
            {isMobile ? '🗑️' : 'Clear'}
          </button>
          {isAuthenticated && (
            <button
              onClick={exportDesign}
              className="btn-action-blue"
            >
              {isMobile ? '📤' : 'Export'}
            </button>
          )}
        </div>
      </div>

      {/* Control Panels Row */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
          {/* Tools Panel */}
          <div className="p-4">
            <h3 className="header-primary">Tools</h3>
            <div className="grid grid-cols-2 gap-x-1 gap-y-3">
              {tools.map(toolItem => (
                <button
                  key={toolItem.id}
                  onClick={() => setTool(toolItem.id)}
                  className={tool === toolItem.id ? 'btn-tool-active' : 'btn-tool-inactive'}
                >
                  <div className="text-lg mb-1">{toolItem.icon}</div>
                  <div className="font-bold text-center">{toolItem.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Text Settings Panel */}
          <div className="p-4">
            <h3 className="header-primary">Text Settings</h3>
            {tool === 'text' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                    <textarea
                      value={textSettings.text}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Enter your text..."
                      className="input-large w-full"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                      <select
                        value={textSettings.fontFamily}
                        onChange={(e) => setTextSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                        className="select-primary w-full"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Impact">Impact</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                      <input
                        type="number"
                        value={textSettings.fontSize}
                        onChange={(e) => setTextSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                        min="8"
                        max="200"
                        className="input-number w-full"
                        placeholder="Size"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={textSettings.color}
                        onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                        className="input-color"
                      />
                      <input
                        type="text"
                        value={textSettings.color}
                        onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                        className="input-primary flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {tool === 'select' && (
              <div>
                <h4 className="font-bold text-gray-700 mb-2">Selection Mode</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectionModes.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectionMode(mode.id)}
                      className={selectionMode === mode.id ? 'btn-selection-active' : 'btn-selection-inactive'}
                    >
                      <div className="text-lg mb-1">{mode.icon}</div>
                      <div className="font-bold text-center">{mode.name}</div>
                    </button>
                  ))}
                </div>
              
              {selectedElements.length > 1 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    {selectedElements.length} elements selected
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        selectedElements.forEach(index => {
                          const element = designElements[index];
                          if (element) {
                            duplicateSelectedElement();
                          }
                        });
                      }}
                      className="btn-action-blue"
                    >
                      Duplicate All
                    </button>
                    <button
                      onClick={() => {
                        saveToHistory();
                        setDesignElements(prev => prev.filter((_, index) => !selectedElements.includes(index)));
                        setSelectedElements([]);
                        setSelectedElement(null);
                      }}
                      className="btn-action-red"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
          
          {/* Canvas Settings Panel */}
          <div className="p-4">
            <h3 className="header-primary">Canvas Settings</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* Canvas Width */}
              <div className="text-center">
                <label className="text-canvas-size">
                  Width 📏
                </label>
                <input
                  type="number"
                  value={canvasSettings.width}
                  onChange={(e) => setCanvasSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                  min="100"
                  max="1000"
                  className="input-number"
                />
              </div>

              {/* Canvas Height */}
              <div className="text-center">
                <label className="text-canvas-size">
                  Height 📐
                </label>
                <input
                  type="number"
                  value={canvasSettings.height}
                  onChange={(e) => setCanvasSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  min="100"
                  max="1000"
                  className="input-number"
                />
              </div>

              {/* Background Color */}
              <div className="text-center">
                <label className="text-background-color">
                  Background 🌈
                </label>
                <input
                  type="color"
                  value={canvasSettings.backgroundColor}
                  onChange={(e) => setCanvasSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="input-color mx-auto block"
                />
              </div>

              {/* Show Grid */}
              <div className="text-center">
                <label className="text-canvas-size">
                  Grid 📋
                </label>
                <label className="flex items-center justify-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canvasSettings.gridEnabled}
                    onChange={(e) => setCanvasSettings(prev => ({ ...prev, gridEnabled: e.target.checked }))}
                    className="checkbox-primary"
                  />
                  <span className="checkbox-label">Show</span>
                </label>
              </div>

              {/* Snap to Grid */}
              <div className="text-center">
                <label className="text-canvas-size">
                  Snap 🧲
                </label>
                <label className="flex items-center justify-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canvasSettings.snapToGrid}
                    onChange={(e) => setCanvasSettings(prev => ({ ...prev, snapToGrid: e.target.checked }))}
                    className="checkbox-primary"
                  />
                  <span className="checkbox-label">Snap</span>
                </label>
              </div>

              {/* Grid Size */}
              <div className="text-center">
                <label className="text-canvas-size">
                  Size 🔢
                </label>
                <input
                  type="number"
                  value={canvasSettings.gridSize}
                  onChange={(e) => setCanvasSettings(prev => ({ ...prev, gridSize: parseInt(e.target.value) }))}
                  min="10"
                  max="50"
                  className="input-number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area - Now Below All Controls */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-8 flex justify-center items-center" style={{ minHeight: '400px' }}>
          <div className="w-2/3 max-w-lg">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onTouchStart={isMobile ? handleTouchStart : undefined}
              onTouchMove={isMobile ? handleTouchMove : undefined}
              onTouchEnd={isMobile ? handleTouchEnd : undefined}
              className="w-full h-auto block border border-gray-200 rounded-lg shadow-sm"
              style={{ 
                imageRendering: 'crisp-edges',
                cursor: tool === 'select' ? 'default' : 'crosshair',
                touchAction: 'none',
                aspectRatio: '1 / 1'
              }}
            />
          </div>
        </div>
          
          <div className={`mt-4 text-center text-sm text-gray-600 space-y-1 ${isMobile ? 'text-xs' : ''}`}>
            {!isMobile && (
              <>
                <p>Current tool: <span className="font-medium">{tools.find(t => t.id === tool)?.name}</span></p>
                {selectedElement !== null && (
                  <p>Selected: Element {selectedElement + 1} ({designElements[selectedElement]?.type})</p>
                )}
                <p className="text-xs">
                  History: {historyIndex + 1}/{history.length} | 
                  Press Ctrl+Z to undo, Ctrl+Y to redo
                </p>
              </>
            )}
            {selectedElements.length > 1 && (
              <p className={`font-medium text-blue-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                {selectedElements.length} elements selected
              </p>
            )}
            {isMobile && (
              <p className="text-xs text-gray-500">
                Tap to add • Pinch to zoom • Two-finger drag to pan
              </p>
            )}
          </div>
        </div>
      </div>

    // </div>
  );
};

export default DesignCanvas;