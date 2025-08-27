import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/lib/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/lib/ui/card";

const DesignCanvas = ({ onDesignChange, initialDesign = null }) => {
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("text");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectionMode, setSelectionMode] = useState("single"); // 'single', 'rectangle', 'circle', 'freeform'
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
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
      timestamp: Date.now(),
    };

    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);

    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex((prev) => prev + 1);
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
      const isInputFocused =
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA" ||
          document.activeElement.contentEditable === "true");

      if (!isInputFocused && (e.ctrlKey || e.metaKey)) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);
  const [canvasSettings, setCanvasSettings] = useState({
    width: 1200,
    height: 800,
    backgroundColor: "#ffffff",
    gridEnabled: true,
    snapToGrid: true,
    gridSize: 20,
  });

  const [textSettings, setTextSettings] = useState({
    text: "Your Text Here",
    fontFamily: "Arial",
    fontSize: 32,
    fontWeight: "400",
    color: "#000000",
    textAlign: "center",
  });

  const [drawSettings, setDrawSettings] = useState({
    strokeColor: "#000000",
    strokeWidth: 3,
    fillColor: "transparent",
  });

  const tools = [
    { id: "select", name: "Select", icon: "🖱️" },
    { id: "text", name: "Text", icon: "📝" },
    { id: "draw", name: "Draw", icon: "✏️" },
    { id: "rectangle", name: "Rectangle", icon: "⬛" },
    { id: "circle", name: "Circle", icon: "⭕" },
    { id: "line", name: "Line", icon: "📏" },
    { id: "image", name: "Image", icon: "🖼️" },
  ];

  const selectionModes = [
    {
      id: "single",
      name: "Single",
      icon: "👆",
      description: "Click to select individual elements",
    },
    {
      id: "rectangle",
      name: "Rectangle",
      icon: "⬜",
      description: "Drag to select elements in rectangle",
    },
    {
      id: "circle",
      name: "Circle",
      icon: "⭕",
      description: "Drag to select elements in circle",
    },
    {
      id: "freeform",
      name: "Freeform",
      icon: "✏️",
      description: "Draw to select elements in custom shape",
    },
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
        setCanvasSettings((prev) => ({ ...prev, ...initialDesign.settings }));
      }

      // Initialize history with the loaded design
      const initialState = {
        elements: initialDesign.elements,
        settings: initialDesign.settings || canvasSettings,
        timestamp: Date.now(),
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    } else {
      // Initialize with empty canvas state
      const emptyState = {
        elements: [],
        settings: canvasSettings,
        timestamp: Date.now(),
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
        settings: canvasSettings,
      });
    }
  }, [designElements, canvasSettings]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.fillStyle = canvasSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (canvasSettings.gridEnabled) {
      drawGrid(ctx);
    }

    // Draw all design elements
    designElements.forEach((element, index) => {
      const isSelected =
        index === selectedElement || selectedElements.includes(index);
      drawElement(ctx, element, isSelected);
    });

    // Draw selection area
    if (isSelecting && tool === "select" && selectionStart && selectionEnd) {
      drawSelectionArea(ctx);
    }
  };

  const drawGrid = (ctx) => {
    const { width, height } = canvasSettings;
    const gridSize = canvasSettings.gridSize;

    ctx.strokeStyle = "rgba(0,0,0,0.1)";
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
      case "text":
        drawTextElement(ctx, element);
        break;
      case "rectangle":
        drawRectangleElement(ctx, element);
        break;
      case "circle":
        drawCircleElement(ctx, element);
        break;
      case "line":
        drawLineElement(ctx, element);
        break;
      case "path":
        drawPathElement(ctx, element);
        break;
      case "image":
        drawImageElement(ctx, element);
        break;
      case "sticker":
        drawStickerElement(ctx, element);
        break;
    }

    // Draw selection outline
    if (isSelected) {
      ctx.strokeStyle = "#007acc";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        element.x - 2,
        element.y - 2,
        (element.width || 100) + 4,
        (element.height || 30) + 4
      );
      ctx.setLineDash([]);

      // Draw resize handles for single selected element
      if (selectedElements.length <= 1) {
        const handleSize = 6;
        const x = element.x;
        const y = element.y;
        const w = element.width || 100;
        const h = element.height || 30;

        ctx.fillStyle = "#007acc";
        // Corner handles
        ctx.fillRect(
          x - handleSize / 2,
          y - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          x + w - handleSize / 2,
          y - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          x - handleSize / 2,
          y + h - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          x + w - handleSize / 2,
          y + h - handleSize / 2,
          handleSize,
          handleSize
        );
        // Side handles
        ctx.fillRect(
          x + w / 2 - handleSize / 2,
          y - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          x + w / 2 - handleSize / 2,
          y + h - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          x - handleSize / 2,
          y + h / 2 - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          x + w - handleSize / 2,
          y + h / 2 - handleSize / 2,
          handleSize,
          handleSize
        );
      }
    }

    ctx.restore();
  };

  const drawTextElement = (ctx, element) => {
    ctx.font = `${element.fontWeight || "400"} ${element.fontSize || 32}px ${
      element.fontFamily || "Arial"
    }`;
    ctx.fillStyle = element.color || "#000000";
    ctx.textAlign = element.textAlign || "left";
    ctx.textBaseline = "top";

    if (element.outline) {
      ctx.strokeStyle = element.outlineColor || "#000000";
      ctx.lineWidth = element.outlineWidth || 2;
      ctx.strokeText(element.text || "", element.x, element.y);
    }

    ctx.fillText(element.text || "", element.x, element.y);
  };

  const drawRectangleElement = (ctx, element) => {
    if (element.fillColor && element.fillColor !== "transparent") {
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

    if (element.fillColor && element.fillColor !== "transparent") {
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
    ctx.strokeStyle = element.strokeColor || "#000000";
    ctx.lineWidth = element.strokeWidth || 2;
    ctx.beginPath();
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(element.x2, element.y2);
    ctx.stroke();
  };

  const drawPathElement = (ctx, element) => {
    if (!element.path || element.path.length < 2) return;

    ctx.strokeStyle = element.strokeColor || "#000000";
    ctx.lineWidth = element.strokeWidth || 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(element.path[0].x, element.path[0].y);

    for (let i = 1; i < element.path.length; i++) {
      ctx.lineTo(element.path[i].x, element.path[i].y);
    }

    ctx.stroke();
  };

  const drawImageElement = (ctx, element) => {
    if (element.image) {
      ctx.drawImage(
        element.image,
        element.x,
        element.y,
        element.width,
        element.height
      );
    } else {
      // Placeholder for image
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(element.x, element.y, element.width, element.height);
      ctx.strokeStyle = "#cccccc";
      ctx.strokeRect(element.x, element.y, element.width, element.height);

      // Image icon
      ctx.fillStyle = "#666666";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "🖼️",
        element.x + element.width / 2,
        element.y + element.height / 2
      );
    }
  };

  const drawStickerElement = (ctx, element) => {
    ctx.save();

    if (element.stickerType === "text" && element.style) {
      // Handle styled text badges
      const style = element.style;

      // Set up text properties
      ctx.font = `${style.fontWeight || "bold"} ${
        style.fontSize || "12px"
      } Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Measure text to get proper dimensions
      const textMetrics = ctx.measureText(element.content);
      const textWidth = textMetrics.width;
      const textHeight = parseInt(style.fontSize || "12px");

      const padding = 8;
      const badgeWidth = textWidth + padding * 2;
      const badgeHeight = textHeight + padding * 2;

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
          ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height
          );
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
      ctx.fillStyle = style.color || "#000000";
      ctx.fillText(
        element.content,
        element.x + badgeWidth / 2,
        element.y + badgeHeight / 2
      );
    } else {
      // Handle emoji and symbol stickers
      ctx.font = `${element.fontSize || 32}px Arial`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = element.color || "#000000";
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

    if (tool === "select") {
      if (selectionMode === "single") {
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

        if (selectionMode === "freeform") {
          setFreeformPath([pos]);
        }
      }
    } else if (tool === "text") {
      addTextElement(pos.x, pos.y);
    } else if (tool === "draw") {
      startDrawing(pos.x, pos.y);
    } else if (tool === "rectangle") {
      addRectangleElement(pos.x, pos.y);
    } else if (tool === "circle") {
      addCircleElement(pos.x, pos.y);
    } else if (tool === "line") {
      startLineDrawing(pos.x, pos.y);
    }
  };

  const handleCanvasMouseMove = (e) => {
    const pos = getMousePos(e);

    if (isDrawing && tool === "draw") {
      continueDrawing(pos.x, pos.y);
    } else if (isSelecting && tool === "select") {
      setSelectionEnd(pos);

      if (selectionMode === "freeform") {
        setFreeformPath((prev) => [...prev, pos]);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);

    if (isSelecting && tool === "select" && selectionStart && selectionEnd) {
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

      if (tool === "select") {
        if (selectionMode === "single") {
          const clickedElement = findElementAtPosition(pos.x, pos.y);
          setSelectedElement(clickedElement);
          setSelectedElements(clickedElement !== null ? [clickedElement] : []);
        } else {
          setIsSelecting(true);
          setSelectionStart(pos);
          setSelectionEnd(pos);
          setSelectedElement(null);
          setSelectedElements([]);

          if (selectionMode === "freeform") {
            setFreeformPath([pos]);
          }
        }
      } else if (tool === "text") {
        addTextElement(pos.x, pos.y);
      } else if (tool === "draw") {
        startDrawing(pos.x, pos.y);
      } else if (tool === "rectangle") {
        addRectangleElement(pos.x, pos.y);
      } else if (tool === "circle") {
        addCircleElement(pos.x, pos.y);
      } else if (tool === "line") {
        startLineDrawing(pos.x, pos.y);
      }
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();

    if (e.touches.length === 1) {
      const pos = getTouchPos(e);

      if (isDrawing && tool === "draw") {
        continueDrawing(pos.x, pos.y);
      } else if (isSelecting && tool === "select") {
        setSelectionEnd(pos);

        if (selectionMode === "freeform") {
          setFreeformPath((prev) => [...prev, pos]);
        }
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();

    setIsDrawing(false);

    if (isSelecting && tool === "select" && selectionStart && selectionEnd) {
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
      if (
        x >= element.x &&
        x <= element.x + (element.width || 100) &&
        y >= element.y &&
        y <= element.y + (element.height || 30)
      ) {
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
        case "rectangle": {
          const minX = Math.min(selectionStart.x, selectionEnd.x);
          const maxX = Math.max(selectionStart.x, selectionEnd.x);
          const minY = Math.min(selectionStart.y, selectionEnd.y);
          const maxY = Math.max(selectionStart.y, selectionEnd.y);

          isInSelection =
            elementCenterX >= minX &&
            elementCenterX <= maxX &&
            elementCenterY >= minY &&
            elementCenterY <= maxY;
          break;
        }

        case "circle": {
          const centerX = (selectionStart.x + selectionEnd.x) / 2;
          const centerY = (selectionStart.y + selectionEnd.y) / 2;
          const radius =
            Math.sqrt(
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

        case "freeform": {
          // Use point-in-polygon algorithm
          isInSelection = isPointInPolygon(
            elementCenterX,
            elementCenterY,
            freeformPath
          );
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
      if (
        polygon[i].y > y !== polygon[j].y > y &&
        x <
          ((polygon[j].x - polygon[i].x) * (y - polygon[i].y)) /
            (polygon[j].y - polygon[i].y) +
            polygon[i].x
      ) {
        inside = !inside;
      }
    }
    return inside;
  };

  const addTextElement = (x, y) => {
    saveToHistory();

    const newElement = {
      type: "text",
      id: Date.now(),
      x,
      y,
      ...textSettings,
      width: 200,
      height: textSettings.fontSize * 1.2,
    };

    setDesignElements((prev) => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const addRectangleElement = (x, y) => {
    saveToHistory();

    const newElement = {
      type: "rectangle",
      id: Date.now(),
      x,
      y,
      width: 100,
      height: 100,
      ...drawSettings,
    };

    setDesignElements((prev) => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const addCircleElement = (x, y) => {
    saveToHistory();

    const newElement = {
      type: "circle",
      id: Date.now(),
      x,
      y,
      width: 100,
      height: 100,
      ...drawSettings,
    };

    setDesignElements((prev) => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const startDrawing = (x, y) => {
    saveToHistory();

    setIsDrawing(true);
    const newElement = {
      type: "path",
      id: Date.now(),
      path: [{ x, y }],
      ...drawSettings,
    };

    setDesignElements((prev) => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const continueDrawing = (x, y) => {
    if (selectedElement !== null) {
      setDesignElements((prev) => {
        const updated = [...prev];
        updated[selectedElement].path.push({ x, y });
        return updated;
      });
    }
  };

  const startLineDrawing = (x, y) => {
    saveToHistory();

    const newElement = {
      type: "line",
      id: Date.now(),
      x,
      y,
      x2: x + 100,
      y2: y,
      ...drawSettings,
    };

    setDesignElements((prev) => [...prev, newElement]);
    setSelectedElement(designElements.length);
  };

  const updateSelectedElement = (updates) => {
    if (selectedElement !== null) {
      saveToHistory();

      setDesignElements((prev) => {
        const updated = [...prev];
        updated[selectedElement] = { ...updated[selectedElement], ...updates };
        return updated;
      });
    }
  };

  const deleteSelectedElement = () => {
    if (selectedElement !== null) {
      saveToHistory();

      setDesignElements((prev) =>
        prev.filter((_, index) => index !== selectedElement)
      );
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
        y: element.y + 20,
      };
      setDesignElements((prev) => [...prev, duplicated]);
      setSelectedElement(designElements.length);
    }
  };

  const drawSelectionArea = (ctx) => {
    ctx.save();
    ctx.strokeStyle = "#007acc";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.fillStyle = "rgba(0, 122, 204, 0.1)";

    switch (selectionMode) {
      case "rectangle": {
        const width = selectionEnd.x - selectionStart.x;
        const height = selectionEnd.y - selectionStart.y;

        ctx.fillRect(selectionStart.x, selectionStart.y, width, height);
        ctx.strokeRect(selectionStart.x, selectionStart.y, width, height);
        break;
      }

      case "circle": {
        const centerX = (selectionStart.x + selectionEnd.x) / 2;
        const centerY = (selectionStart.y + selectionEnd.y) / 2;
        const radius =
          Math.sqrt(
            Math.pow(selectionEnd.x - selectionStart.x, 2) +
              Math.pow(selectionEnd.y - selectionStart.y, 2)
          ) / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      }

      case "freeform": {
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
      canvas: canvasRef.current?.toDataURL("image/png"),
      elements: designElements,
      settings: canvasSettings,
      timestamp: new Date().toISOString(),
    };
  };

  const exportDesign = () => {
    if (!isAuthenticated) {
      alert("Please sign in to export designs");
      return;
    }

    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `design-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const currentElement =
    selectedElement !== null ? designElements[selectedElement] : null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mx-4 md:mx-8">
      <div className="flex justify-between items-center mb-16">
        <h2 className="header-primary text-4xl font-bold text-gray-800">
          <span className="text-6xl">🎨</span> Design Canvas
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <Button
            onClick={undo}
            disabled={historyIndex <= 0}
            variant="outline"
            size="sm"
            title="Undo (Ctrl+Z)"
            className={`border-none shadow-2xl transform hover:scale-110 hover:rotate-1 transition-all duration-300 relative overflow-hidden group ${
              historyIndex <= 0 
                ? 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700'
            }`}
            style={{ 
              fontFamily: 'Comfortaa, sans-serif',
              borderRadius: '15px',
              minWidth: '100px',
              boxShadow: historyIndex <= 0 ? '0 4px 15px rgba(107, 114, 128, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.4)',
              color: historyIndex <= 0 ? '#ffffff' : '#000000',
              textShadow: historyIndex <= 0 
                ? '0 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                : '0 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="mr-2 text-2xl relative z-10">↶</span>
            <span className={`${isMobile ? "hidden" : "font-bold"} relative z-10`}>Undo</span>
          </Button>
          
          <Button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            variant="outline"
            size="sm"
            title="Redo (Ctrl+Y)"
            className={`border-none shadow-2xl transform hover:scale-110 hover:-rotate-1 transition-all duration-300 relative overflow-hidden group ${
              historyIndex >= history.length - 1 
                ? 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700'
            }`}
            style={{ 
              fontFamily: 'Comfortaa, sans-serif',
              borderRadius: '15px',
              minWidth: '100px',
              boxShadow: historyIndex >= history.length - 1 ? '0 4px 15px rgba(107, 114, 128, 0.3)' : '0 8px 32px rgba(34, 197, 94, 0.4)',
              color: historyIndex >= history.length - 1 ? '#ffffff' : '#000000',
              textShadow: historyIndex >= history.length - 1 
                ? '0 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                : '0 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="mr-2 text-2xl relative z-10">↷</span>
            <span className={`${isMobile ? "hidden" : "font-bold"} relative z-10`}>Redo</span>
          </Button>
          
          <Button
            onClick={clearCanvas}
            variant="destructive"
            size="sm"
            className="bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white border-none shadow-2xl hover:from-red-600 hover:via-rose-700 hover:to-pink-700 transform hover:scale-110 hover:rotate-1 transition-all duration-300 relative overflow-hidden group"
            style={{ 
              fontFamily: 'Comfortaa, sans-serif',
              borderRadius: '15px',
              minWidth: '100px',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="mr-2 text-xl relative z-10">🗑️</span>
            <span className={`${isMobile ? "hidden" : "font-bold"} relative z-10`}>Clear</span>
          </Button>
          
          {isAuthenticated && (
            <Button
              onClick={exportDesign}
              size="sm"
              className="bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-600 text-white border-none shadow-2xl hover:from-orange-600 hover:via-amber-700 hover:to-yellow-700 transform hover:scale-110 hover:-rotate-1 transition-all duration-300 relative overflow-hidden group"
              style={{ 
                fontFamily: 'Comfortaa, sans-serif',
                borderRadius: '15px',
                minWidth: '100px',
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="mr-2 text-xl relative z-10">📤</span>
              <span className={`${isMobile ? "hidden" : "font-bold"} relative z-10`}>Export</span>
            </Button>
          )}
        </div>
      </div>

      {/* Control Panels Row - Grid Format */}
      <div className="w-full max-w-7xl mx-auto mb-20 px-4">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '48px',
          width: '100%'
        }}>
          {/* Tools Panel */}
          <div 
            className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/25"
            style={{ 
              backgroundColor: '#fef2f2', 
              padding: '20px', 
              borderRadius: '20px', 
              border: '3px solid #dc2626',
              background: 'linear-gradient(145deg, #fef2f2, #fee2e2)',
              position: 'relative'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-rose-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
            <Card className="relative z-10 border-none shadow-none bg-transparent"
                  style={{ fontFamily: 'Comfortaa, cursive' }}>
            <CardHeader>
              <CardTitle className="text-5xl flex items-center justify-center gap-4 font-bold" 
                         style={{ 
                           fontFamily: 'Comfortaa, cursive',
                           color: '#ff0040',
                           textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(255, 0, 64, 0.5)',
                           fontSize: '36px'
                         }}>
                <span className="text-6xl">🛠️</span> Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {tools.slice(0, -1).map((toolItem) => (
                  <button
                    key={toolItem.id}
                    onClick={() => setTool(toolItem.id)}
                    className={`group relative h-auto py-6 px-4 flex flex-col items-center gap-3 shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-2 overflow-hidden ${
                      tool === toolItem.id
                        ? "bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 text-white shadow-2xl"
                        : "bg-gradient-to-br from-white via-red-50 to-rose-100 text-red-800 hover:from-red-100 hover:via-rose-200 hover:to-pink-200 hover:text-red-900"
                    }`}
                    style={{ 
                      borderRadius: '20px',
                      fontFamily: 'Comfortaa, cursive',
                      border: tool === toolItem.id ? '3px solid #f87171' : '2px solid #dc2626',
                      minHeight: '120px',
                      boxShadow: tool === toolItem.id 
                        ? '0 20px 40px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.1)' 
                        : '0 8px 25px rgba(220, 38, 38, 0.15)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
                    <div className="text-3xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">{toolItem.icon}</div>
                    <div className="text-lg font-bold relative z-10 text-center leading-tight">{toolItem.name}</div>
                  </button>
                ))}
                {/* Rectangle tool - spans full width */}
                <div className="col-span-3">
                  <button
                    onClick={() => setTool('rectangle')}
                    className={`group relative w-full h-auto py-4 px-6 flex items-center justify-center gap-4 shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 overflow-hidden ${
                      tool === 'rectangle'
                        ? "bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 text-white shadow-2xl"
                        : "bg-gradient-to-br from-white via-red-50 to-rose-100 text-red-800 hover:from-red-100 hover:via-rose-200 hover:to-pink-200 hover:text-red-900"
                    }`}
                    style={{ 
                      borderRadius: '20px',
                      fontFamily: 'Comfortaa, cursive',
                      border: tool === 'rectangle' ? '3px solid #f87171' : '2px solid #dc2626',
                      minHeight: '80px',
                      boxShadow: tool === 'rectangle' 
                        ? '0 20px 40px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.1)' 
                        : '0 8px 25px rgba(220, 38, 38, 0.15)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
                    <div className="text-3xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">⬛</div>
                    <div className="text-lg font-bold relative z-10 text-center leading-tight">Rectangle</div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Text Settings Panel */}
          <div 
            className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25"
            style={{ 
              backgroundColor: '#eff6ff', 
              padding: '20px', 
              borderRadius: '20px', 
              border: '3px solid #2563eb',
              background: 'linear-gradient(145deg, #eff6ff, #dbeafe)',
              position: 'relative'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
            <Card className="relative z-10 border-none shadow-none bg-transparent"
                  style={{ fontFamily: 'Comfortaa, cursive' }}>
            <CardHeader>
              <CardTitle className="text-5xl flex items-center gap-4 font-bold" 
                         style={{ 
                           fontFamily: 'Comfortaa, cursive',
                           color: '#0040ff',
                           textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(0, 64, 255, 0.5)',
                           fontSize: '36px'
                         }}>
                <span className="text-6xl">📝</span> Text Settings
              </CardTitle>
            </CardHeader>
            <CardContent style={{ fontFamily: 'Comfortaa, cursive' }}>
              {tool === "text" ? (
                <div className="grid grid-cols-1 gap-4">
                  {/* Text Content - Full Width */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#0066ff',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(0, 102, 255, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '20px'
                           }}>
                      <span className="text-2xl">📝</span> Text Content
                    </label>
                    <textarea
                      value={textSettings.text}
                      onChange={(e) =>
                        setTextSettings((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      placeholder="Enter your text..."
                      className="w-full px-4 py-3 border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-br from-white via-blue-50 to-indigo-50 text-blue-900 font-semibold transition-all duration-300 hover:shadow-lg hover:border-blue-400 focus:shadow-xl resize-none"
                      style={{ 
                        borderRadius: '15px',
                        fontFamily: 'Comfortaa, cursive',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)',
                        minHeight: '60px',
                        maxHeight: '120px'
                      }}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                  {/* Font Family - Grid Item 1 */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#0066ff',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(0, 102, 255, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '16px'
                           }}>
                      <span className="text-xl">🎨</span> Font
                    </label>
                    <select
                      value={textSettings.fontFamily}
                      onChange={(e) =>
                        setTextSettings((prev) => ({
                          ...prev,
                          fontFamily: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-br from-white via-blue-50 to-indigo-50 text-blue-900 font-semibold transition-all duration-300 hover:shadow-lg hover:border-blue-400 focus:shadow-xl cursor-pointer text-sm"
                      style={{ 
                        borderRadius: '10px',
                        fontFamily: 'Comfortaa, cursive',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)'
                      }}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Impact">Impact</option>
                    </select>
                  </div>

                  {/* Font Size - Grid Item 2 */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#0066ff',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(0, 102, 255, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '16px'
                           }}>
                      <span className="text-xl">📏</span> Size
                    </label>
                    <input
                      type="number"
                      value={textSettings.fontSize}
                      onChange={(e) =>
                        setTextSettings((prev) => ({
                          ...prev,
                          fontSize: parseInt(e.target.value),
                        }))
                      }
                      min="8"
                      max="200"
                      className="w-full px-3 py-2 border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-br from-white via-blue-50 to-indigo-50 text-blue-900 font-semibold transition-all duration-300 hover:shadow-lg hover:border-blue-400 focus:shadow-xl text-center text-sm"
                      style={{ 
                        borderRadius: '10px',
                        fontFamily: 'Comfortaa, cursive',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)'
                      }}
                      placeholder="Size"
                    />
                  </div>

                  {/* Text Color - Grid Item 3 */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#0066ff',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(0, 102, 255, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '16px'
                           }}>
                      <span className="text-xl">🌈</span> Color
                    </label>
                    <div className="flex flex-col gap-2 items-center">
                      <input
                        type="color"
                        value={textSettings.color}
                        onChange={(e) =>
                          setTextSettings((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="w-full h-8 border-2 border-blue-300 cursor-pointer bg-gradient-to-br from-white via-blue-50 to-indigo-50 transition-all duration-300 hover:shadow-lg hover:border-blue-400 hover:scale-105"
                        style={{ 
                          borderRadius: '10px',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)'
                        }}
                      />
                      <input
                        type="text"
                        value={textSettings.color}
                        onChange={(e) =>
                          setTextSettings((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-br from-white via-blue-50 to-indigo-50 text-blue-900 font-semibold transition-all duration-300 hover:shadow-lg hover:border-blue-400 focus:shadow-xl text-center text-xs"
                        style={{ 
                          borderRadius: '8px',
                          fontFamily: 'Comfortaa, cursive',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)'
                        }}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className=" font-bold"
                     style={{ 
                       textShadow: '0 1px 2px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(255, 255, 255, 0.8), 1px -1px 0 rgba(255, 255, 255, 0.8), -1px 1px 0 rgba(255, 255, 255, 0.8), 1px 1px 0 rgba(255, 255, 255, 0.8)',
                       fontFamily: 'Comfortaa, cursive' 
                     }}>
                    Select the Text tool to edit text settings
                  </p>
                </div>
              )}

              {tool === "select" && (
                <div className="mt-6">
                  <h4 className="font-bold  mb-4"
                      style={{ 
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(255, 255, 255, 0.8), 1px -1px 0 rgba(255, 255, 255, 0.8), -1px 1px 0 rgba(255, 255, 255, 0.8), 1px 1px 0 rgba(255, 255, 255, 0.8)',
                        fontFamily: 'Comfortaa, cursive' 
                      }}>
                    🎯 Selection Mode
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectionModes.map((mode) => (
                      <Button
                        key={mode.id}
                        onClick={() => setSelectionMode(mode.id)}
                        variant={
                          selectionMode === mode.id ? "default" : "outline"
                        }
                        className={`h-auto py-4 px-3 flex flex-col items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:rotate-1 overflow-hidden group ${
                          selectionMode === mode.id
                            ? "bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-700 text-white shadow-2xl border-2 border-indigo-400"
                            : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 hover:from-indigo-100 hover:via-blue-200 hover:to-purple-200 border-2 border-blue-300 hover:border-indigo-400  hover:text-indigo-900"
                        }`}
                        style={{ 
                          borderRadius: '15px',
                          fontFamily: 'Comfortaa, cursive',
                          minHeight: '80px',
                          boxShadow: selectionMode === mode.id 
                            ? '0 8px 25px rgba(79, 70, 229, 0.4)' 
                            : '0 4px 15px rgba(59, 130, 246, 0.15)'
                        }}
                        size="sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="text-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">{mode.icon}</div>
                        <div className="text-xs font-bold relative z-10 text-center leading-tight">{mode.name}</div>
                      </Button>
                    ))}
                  </div>

                  {selectedElements.length > 1 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-2">
                        {selectedElements.length} elements selected
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            selectedElements.forEach((index) => {
                              const element = designElements[index];
                              if (element) {
                                duplicateSelectedElement();
                              }
                            });
                          }}
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-none shadow-md hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 font-semibold"
                        >
                          Duplicate All
                        </Button>
                        <Button
                          onClick={() => {
                            saveToHistory();
                            setDesignElements((prev) =>
                              prev.filter(
                                (_, index) => !selectedElements.includes(index)
                              )
                            );
                            setSelectedElements([]);
                            setSelectedElement(null);
                          }}
                          variant="destructive"
                          size="sm"
                          className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-none shadow-md hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 font-semibold"
                        >
                          Delete All
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          {/* Canvas Settings Panel */}
          <div 
            className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/25"
            style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '20px', 
              borderRadius: '20px', 
              border: '3px solid #16a34a',
              background: 'linear-gradient(145deg, #f0fdf4, #dcfce7)',
              position: 'relative'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-500/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
            <Card className="relative z-10 border-none shadow-none bg-transparent"
                  style={{ fontFamily: 'Comfortaa, cursive' }}>
            <CardHeader>
              <CardTitle className="text-4xl flex items-center gap-3 font-bold" 
                         style={{ 
                           fontFamily: 'Comfortaa, cursive',
                           color: '#ff6600',
                           textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(255, 102, 0, 0.5)',
                           fontSize: '32px'
                         }}>
                <span className="text-5xl">⚙️</span> Canvas Settings
              </CardTitle>
            </CardHeader>
            <CardContent style={{ fontFamily: 'Comfortaa, cursive', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="flex-grow space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Canvas Width */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#ff6600',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(255, 102, 0, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '18px'
                           }}>
                      <span className="text-xl">📏</span> Width
                    </label>
                    <input
                      type="number"
                      value={canvasSettings.width}
                      onChange={(e) =>
                        setCanvasSettings((prev) => ({
                          ...prev,
                          width: parseInt(e.target.value),
                        }))
                      }
                      min="100"
                      max="2000"
                      className="group relative w-full px-3 py-3 border-2 border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-br from-white via-green-50 to-emerald-50 text-green-900 font-semibold transition-all duration-300 hover:shadow-lg hover:border-green-400 focus:shadow-xl text-center"
                      style={{ 
                        borderRadius: '10px',
                        fontFamily: 'Comfortaa, cursive',
                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  {/* Canvas Height */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#ff6600',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(255, 102, 0, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '18px'
                           }}>
                      <span className="text-xl">📐</span> Height
                    </label>
                    <input
                      type="number"
                      value={canvasSettings.height}
                      onChange={(e) =>
                        setCanvasSettings((prev) => ({
                          ...prev,
                          height: parseInt(e.target.value),
                        }))
                      }
                      min="100"
                      max="2000"
                      className="group relative w-full px-3 py-3 border-2 border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-br from-white via-green-50 to-emerald-50 text-green-900 font-semibold transition-all duration-300 hover:shadow-lg hover:border-green-400 focus:shadow-xl text-center"
                      style={{ 
                        borderRadius: '10px',
                        fontFamily: 'Comfortaa, cursive',
                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  {/* Background Color */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#ff6600',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(255, 102, 0, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '18px'
                           }}>
                      <span className="text-xl">🌈</span> Background
                    </label>
                    <div className="flex justify-center">
                      <input
                        type="color"
                        value={canvasSettings.backgroundColor}
                        onChange={(e) =>
                          setCanvasSettings((prev) => ({
                            ...prev,
                            backgroundColor: e.target.value,
                          }))
                        }
                        className="group relative w-full h-12 border-2 border-green-300 cursor-pointer bg-gradient-to-br from-white via-green-50 to-emerald-50 transition-all duration-300 hover:shadow-lg hover:border-green-400 hover:scale-105"
                        style={{ 
                          borderRadius: '10px',
                          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Grid Size */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200">
                    <label className="block text-lg font-bold text-center"
                           style={{ 
                             color: '#ff6600',
                             textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 0 15px rgba(255, 102, 0, 0.5)',
                             fontFamily: 'Comfortaa, cursive',
                             fontSize: '18px'
                           }}>
                      <span className="text-xl">🔢</span> Grid Size
                    </label>
                    <input
                      type="number"
                      value={canvasSettings.gridSize}
                      onChange={(e) =>
                        setCanvasSettings((prev) => ({
                          ...prev,
                          gridSize: parseInt(e.target.value),
                        }))
                      }
                      min="10"
                      max="50"
                      className="group relative w-full px-3 py-3 border-2 border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-br from-white via-green-50 to-emerald-50 text-green-900 font-semibold transition-all duration-300 hover:shadow-lg hover:border-green-400 focus:shadow-xl text-center"
                      style={{ 
                        borderRadius: '10px',
                        fontFamily: 'Comfortaa, cursive',
                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

              </div>

              {/* Grid Options Footer - AT THE VERY BOTTOM */}
              <div className="mt-auto pt-4 border-t-2 border-orange-400">
                <div className="flex justify-center space-x-6">
                  {/* Show Grid */}
                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border-2 border-orange-300 hover:from-orange-200 hover:to-yellow-200 transition-all duration-200"
                         style={{ fontFamily: 'Comfortaa, cursive' }}>
                    <input
                      type="checkbox"
                      checked={canvasSettings.gridEnabled}
                      onChange={(e) =>
                        setCanvasSettings((prev) => ({
                          ...prev,
                          gridEnabled: e.target.checked,
                        }))
                      }
                      className="w-3 h-3 text-orange-600 bg-white border-2 border-orange-400 rounded focus:ring-orange-500 focus:ring-1 cursor-pointer"
                    />
                    <span className="text-xs font-bold"
                          style={{ 
                            fontFamily: 'Comfortaa, cursive',
                            color: '#cc4400',
                            textShadow: '0 1px 2px rgba(255, 255, 255, 0.9), -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                            fontSize: '12px'
                          }}>
                      <span className="text-sm">📋</span> Show Grid
                    </span>
                  </label>

                  {/* Snap to Grid */}
                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border-2 border-orange-300 hover:from-orange-200 hover:to-yellow-200 transition-all duration-200"
                         style={{ fontFamily: 'Comfortaa, cursive' }}>
                    <input
                      type="checkbox"
                      checked={canvasSettings.snapToGrid}
                      onChange={(e) =>
                        setCanvasSettings((prev) => ({
                          ...prev,
                          snapToGrid: e.target.checked,
                        }))
                      }
                      className="w-3 h-3 text-orange-600 bg-white border-2 border-orange-400 rounded focus:ring-orange-500 focus:ring-1 cursor-pointer"
                    />
                    <span className="text-xs font-bold"
                          style={{ 
                            fontFamily: 'Comfortaa, cursive',
                            color: '#cc4400',
                            textShadow: '0 1px 2px rgba(255, 255, 255, 0.9), -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                            fontSize: '12px'
                          }}>
                      <span className="text-sm">🧲</span> Snap to Grid
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      {/* Spacer between columns and canvas */}
      <div className="w-full h-24"></div>

      {/* Canvas Area - MASSIVE and More Prominent */}
      <div className="w-full max-w-[98vw] mx-auto">
        <div
          className="border-4 border-gradient-to-r from-blue-400 to-purple-500 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col justify-center items-center shadow-2xl"
          style={{ minHeight: "1000px" }}
        >
          <div className="w-full max-w-[90vw] mb-4">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onTouchStart={isMobile ? handleTouchStart : undefined}
              onTouchMove={isMobile ? handleTouchMove : undefined}
              onTouchEnd={isMobile ? handleTouchEnd : undefined}
              className="w-full h-auto block border-4 border-gray-400 rounded-xl shadow-2xl bg-white"
              style={{
                imageRendering: "crisp-edges",
                cursor: tool === "select" ? "default" : "crosshair",
                touchAction: "none",
                maxHeight: "800px",
                minHeight: "700px",
              }}
            />
          </div>

          <div
            className={`text-center text-sm text-gray-600 space-y-1 ${
              isMobile ? "text-xs" : ""
            }`}
          >
            {!isMobile && (
              <>
                <p>
                  Current tool:{" "}
                  <span className="font-medium">
                    {tools.find((t) => t.id === tool)?.name}
                  </span>
                </p>
                {selectedElement !== null && (
                  <p>
                    Selected: Element {selectedElement + 1} (
                    {designElements[selectedElement]?.type})
                  </p>
                )}
                <p className="text-xs">
                  History: {historyIndex + 1}/{history.length} | Press Ctrl+Z to
                  undo, Ctrl+Y to redo
                </p>
              </>
            )}
            {selectedElements.length > 1 && (
              <p
                className={`font-medium text-blue-600 ${
                  isMobile ? "text-xs" : "text-xs"
                }`}
              >
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
    </div>
  );
};

export default DesignCanvas;
