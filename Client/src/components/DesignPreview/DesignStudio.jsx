import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDesign } from "../../contexts/DesignContext";
import DesignCanvas from "./DesignCanvas";
import MockupGenerator from "./MockupGenerator";
import FontCustomizer from "../FontCustomizer/FontCustomizer";
import StickerLibrary from "./StickerLibrary";
import { Button } from "@/lib/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/lib/ui/card";

const DesignStudio = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    designs,
    currentDesign,
    templates,
    loading,
    error,
    createDesign,
    updateDesign,
    deleteDesign,
    setCurrentDesign,
    clearError,
  } = useDesign();
  const [activeTab, setActiveTab] = useState("canvas");
  const [designName, setDesignName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [designElements, setDesignElements] = useState([]);
  const [canvasSettings, setCanvasSettings] = useState({
    width: 400,
    height: 400,
    backgroundColor: "#ffffff",
  });

  // Design templates for quick start
  const designTemplates = [
    {
      id: "business-card",
      name: "Business Card",
      category: "Business",
      dimensions: { width: 350, height: 200 },
      description: "Professional business card design",
      thumbnail: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      elements: [
        {
          type: "text",
          id: 1,
          x: 20,
          y: 20,
          text: "Your Name",
          fontFamily: "Arial",
          fontSize: 24,
          fontWeight: "700",
          color: "#000000",
        },
        {
          type: "text",
          id: 2,
          x: 20,
          y: 60,
          text: "Your Title",
          fontFamily: "Arial",
          fontSize: 16,
          color: "#666666",
        },
        {
          type: "text",
          id: 3,
          x: 20,
          y: 140,
          text: "your.email@example.com",
          fontFamily: "Arial",
          fontSize: 14,
          color: "#333333",
        },
      ],
    },
    {
      id: "social-post",
      name: "Social Media Post",
      category: "Social",
      dimensions: { width: 400, height: 400 },
      description: "Square social media post template",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      elements: [
        {
          type: "rectangle",
          id: 1,
          x: 0,
          y: 0,
          width: 400,
          height: 400,
          fillColor: "#f0f0f0",
          strokeColor: "transparent",
          strokeWidth: 0,
        },
        {
          type: "text",
          id: 2,
          x: 200,
          y: 180,
          text: "Your Message Here",
          fontFamily: "Arial",
          fontSize: 32,
          fontWeight: "700",
          color: "#000000",
          textAlign: "center",
        },
      ],
    },
    {
      id: "logo-design",
      name: "Simple Logo",
      category: "Branding",
      dimensions: { width: 300, height: 300 },
      description: "Basic logo design template",
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      elements: [
        {
          type: "circle",
          id: 1,
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          fillColor: "#007acc",
          strokeColor: "#005c99",
          strokeWidth: 3,
        },
        {
          type: "text",
          id: 2,
          x: 150,
          y: 220,
          text: "LOGO",
          fontFamily: "Arial",
          fontSize: 28,
          fontWeight: "700",
          color: "#000000",
          textAlign: "center",
        },
      ],
    },
    {
      id: "poster",
      name: "Event Poster",
      category: "Marketing",
      dimensions: { width: 300, height: 400 },
      description: "Event poster template",
      thumbnail: "https://images.unsplash.com/photo-1594736797933-d0380ba902d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      elements: [
        {
          type: "rectangle",
          id: 1,
          x: 0,
          y: 0,
          width: 300,
          height: 120,
          fillColor: "#007acc",
          strokeColor: "transparent",
          strokeWidth: 0,
        },
        {
          type: "text",
          id: 2,
          x: 150,
          y: 40,
          text: "EVENT TITLE",
          fontFamily: "Arial",
          fontSize: 24,
          fontWeight: "700",
          color: "#ffffff",
          textAlign: "center",
        },
        {
          type: "text",
          id: 3,
          x: 150,
          y: 180,
          text: "Date & Time",
          fontFamily: "Arial",
          fontSize: 18,
          color: "#333333",
          textAlign: "center",
        },
        {
          type: "text",
          id: 4,
          x: 150,
          y: 220,
          text: "Location Details",
          fontFamily: "Arial",
          fontSize: 16,
          color: "#666666",
          textAlign: "center",
        },
      ],
    },
    {
      id: "sticker",
      name: "Sticker Design",
      category: "Fun",
      dimensions: { width: 200, height: 200 },
      description: "Circular sticker template",
      thumbnail: "https://images.unsplash.com/photo-1594736797933-d0380ba902d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      elements: [
        {
          type: "circle",
          id: 1,
          x: 25,
          y: 25,
          width: 150,
          height: 150,
          fillColor: "#ff6b6b",
          strokeColor: "#ffffff",
          strokeWidth: 5,
        },
        {
          type: "text",
          id: 2,
          x: 100,
          y: 85,
          text: "COOL",
          fontFamily: "Impact",
          fontSize: 28,
          fontWeight: "700",
          color: "#ffffff",
          textAlign: "center",
        },
      ],
    },
    {
      id: "label",
      name: "Product Label",
      category: "Business",
      dimensions: { width: 350, height: 150 },
      description: "Product label template",
      elements: [
        {
          type: "rectangle",
          id: 1,
          x: 10,
          y: 10,
          width: 330,
          height: 130,
          fillColor: "transparent",
          strokeColor: "#000000",
          strokeWidth: 2,
        },
        {
          type: "text",
          id: 2,
          x: 175,
          y: 30,
          text: "PRODUCT NAME",
          fontFamily: "Arial",
          fontSize: 20,
          fontWeight: "700",
          color: "#000000",
          textAlign: "center",
        },
        {
          type: "text",
          id: 3,
          x: 175,
          y: 70,
          text: "Description or details",
          fontFamily: "Arial",
          fontSize: 14,
          color: "#666666",
          textAlign: "center",
        },
      ],
    },
  ];

  const categories = [...new Set(designTemplates.map((t) => t.category))];

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []); // Empty dependency array - run only once on mount

  const handleDesignChange = (design) => {
    setDesignElements(design.elements || []);
    setCanvasSettings(design.settings || canvasSettings);
  };

  const handleStickerSelect = (stickerElement) => {
    // Add the sticker to the design elements
    setDesignElements((prev) => [...prev, stickerElement]);
    setActiveTab("canvas"); // Switch back to canvas to see the added sticker
  };

  const saveDesign = async () => {
    if (!isAuthenticated || !designName.trim()) return;

    try {
      const designData = {
        name: designName.trim(),
        elements: designElements,
        dimensions: {
          width: canvasSettings.width,
          height: canvasSettings.height,
        },
        backgroundColor: canvasSettings.backgroundColor,
        category: "custom",
      };

      if (currentDesign?._id) {
        // Update existing design
        await updateDesign(currentDesign._id, designData);
      } else {
        // Create new design
        const newDesign = await createDesign(designData);
        setCurrentDesign(newDesign);
      }

      setShowSaveModal(false);
      setDesignName("");
    } catch (error) {
      console.error("Save design error:", error);
      // Error is handled by the context
    }
  };

  const loadDesign = (savedDesign) => {
    setCurrentDesign(savedDesign);
    setDesignElements(savedDesign.elements || []);
    setCanvasSettings({
      width: savedDesign.dimensions?.width || 400,
      height: savedDesign.dimensions?.height || 400,
      backgroundColor: savedDesign.backgroundColor || "#ffffff",
    });
    setActiveTab("canvas");
  };

  const handleDeleteDesign = async (designId) => {
    try {
      await deleteDesign(designId);
    } catch (error) {
      console.error("Delete design error:", error);
    }
  };

  const loadTemplate = (template) => {
    setDesignElements(template.elements || []);
    setCanvasSettings({
      width: template.dimensions?.width || 400,
      height: template.dimensions?.height || 400,
      backgroundColor: "#ffffff",
      gridEnabled: true,
      snapToGrid: true,
      gridSize: 20,
    });
    setCurrentDesign(null); // Reset current design when loading template
    setSelectedTemplate(template.id);
    setActiveTab("canvas");
  };

  const newDesign = () => {
    setCurrentDesign(null);
    setDesignElements([]);
    setCanvasSettings({
      width: 400,
      height: 400,
      backgroundColor: "#ffffff",
    });
    setSelectedTemplate(null);
    setActiveTab("canvas");
  };

  const exportToMockup = () => {
    if (designElements.length > 0) {
      setActiveTab("mockup");
    }
  };

  const tabs = [
    { id: "canvas", name: "Design Canvas", icon: "🎨" },
    { id: "templates", name: "Templates", icon: "📋" },
    { id: "stickers", name: "Stickers & Assets", icon: "🎆" },
    { id: "mockup", name: "Mockup", icon: "👕" },
    { id: "fonts", name: "Typography", icon: "🔤" },
    { id: "saved", name: "Saved Designs", icon: "💾", authRequired: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white page-container">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🎨 Design Studio
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create stunning designs with our professional tools and templates
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={newDesign}
                className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-primary-100 hover:to-purple-100 text-gray-900 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-3 border border-gray-300 hover:border-primary-400 min-w-[140px]"
              >
                <span className="text-2xl">📄</span>
                <span>New Design</span>
              </button>
              {currentDesign && (
                <>
                  <button
                    onClick={exportToMockup}
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 min-w-[140px]"
                  >
                    <span className="text-2xl">👕</span>
                    <span>View Mockup</span>
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 min-w-[140px]"
                    >
                      <span className="text-2xl">💾</span>
                      <span>Save Design</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
              🛠️ <span>Design Tools</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => {
                if (tab.authRequired && !isAuthenticated) return null;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-8 py-4 font-semibold transition-all duration-200 flex items-center space-x-3 rounded-lg min-w-[160px] ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-primary-100 hover:to-purple-100 text-gray-900 border border-gray-300 hover:border-primary-400 hover:shadow-md"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-base font-bold whitespace-nowrap">
                      {tab.name}
                    </span>
                    {tab.id === "saved" && designs.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center font-bold shadow-sm">
                        {designs.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          <div className="min-h-[600px] bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            {activeTab === "canvas" && (
              <DesignCanvas
                onDesignChange={handleDesignChange}
                initialDesign={currentDesign}
                key={selectedTemplate || "new"} // Force re-render when template changes
              />
            )}

            {activeTab === "templates" && (
              <div className="h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    📋 <span>Design Templates</span>
                  </h2>
                  <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {designTemplates.length} templates available
                  </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-primary-100 hover:to-primary-200 text-gray-700 hover:text-primary-800 text-sm rounded-lg font-medium cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {/* Built-in Templates */}
                  {designTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg hover:border-primary-300 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                      onClick={() => loadTemplate(template)}
                    >
                      <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{template.thumbnail || '🎨'}</div>
                          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {template.dimensions.width} × {template.dimensions.height}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {template.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {template.description}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadTemplate(template);
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Use Template
                      </button>
                    </div>
                  ))}

                  {/* Backend Templates */}
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                      onClick={() => loadTemplate(template)}
                    >
                      <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        {template.previewImage ? (
                          <img
                            src={template.previewImage}
                            alt={template.name}
                            className="w-full h-full object-contain rounded"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎨</div>
                            <div className="text-xs text-gray-500">
                              {template.dimensions.width} ×{" "}
                              {template.dimensions.height}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {template.category}
                          </span>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            Pro
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {template.description}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadTemplate(template);
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "mockup" && (
              <MockupGenerator
                design={
                  currentDesign
                    ? {
                        text: "Your Design",
                        color: "#000000",
                        fontSize: 24,
                        fontFamily: "Arial",
                      }
                    : null
                }
              />
            )}

            {activeTab === "stickers" && (
              <StickerLibrary onStickerSelect={handleStickerSelect} />
            )}

            {activeTab === "fonts" && (
              <FontCustomizer
                onFontChange={(settings, text) => {
                  // This could integrate with the canvas to add text elements
                  console.log("Font settings:", settings, text);
                }}
              />
            )}

            {activeTab === "saved" && isAuthenticated && (
              <div className="h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    💾 <span>Saved Designs</span>
                  </h2>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {designs.length} design{designs.length !== 1 ? "s" : ""} saved
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">⚠️</span>
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <div className="text-2xl mb-2">⏳</div>
                    <p className="text-gray-600">Loading your designs...</p>
                  </div>
                )}

                {designs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designs.map((design) => (
                      <div
                        key={design._id}
                        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-primary-300 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          {design.previewImage ? (
                            <img
                              src={design.previewImage}
                              alt={design.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl mb-2">🎨</div>
                                <div className="text-xs text-gray-500">
                                  {design.dimensions?.width || 400} ×{" "}
                                  {design.dimensions?.height || 400}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {design.name}
                          </h3>
                          <button
                            onClick={() => handleDeleteDesign(design._id)}
                            className="text-red-500 hover:text-red-700 transition-colors ml-2"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {design.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            v{design.version}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">
                          Created:{" "}
                          {new Date(design.createdAt).toLocaleDateString()}
                          <br />
                          Updated:{" "}
                          {new Date(design.lastModified).toLocaleDateString()}
                        </p>

                        <div className="space-y-2">
                          <button
                            onClick={() => loadDesign(design)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={loading}
                          >
                            Open Design
                          </button>
                          <button
                            onClick={() => duplicateDesign(design._id)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-primary-100 hover:to-purple-100 text-gray-900 rounded-lg border border-gray-300 hover:border-primary-400 transition-all duration-200 font-bold"
                            disabled={loading}
                          >
                            Duplicate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">🎨</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No designs saved yet
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Create your first design and save it to access it later. Start with a template or build from scratch.
                    </p>
                    <button
                      onClick={() => setActiveTab("templates")}
                      className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Browse Templates
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save Design Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                💾 <span>Save Design</span>
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Name
                </label>
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="e.g., Business Card v1, Logo Draft..."
                  className="input-primary"
                  onKeyPress={(e) => e.key === "Enter" && saveDesign()}
                />
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">Design Info:</p>
                <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="flex justify-between"><span>Elements:</span> <span className="font-medium">{designElements.length}</span></p>
                    <p className="flex justify-between"><span>Size:</span> <span className="font-medium">{canvasSettings.width} × {canvasSettings.height}px</span></p>
                    <p className="flex justify-between"><span>Background:</span> <span className="font-medium">{canvasSettings.backgroundColor}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 rounded-lg font-bold border border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDesign}
                  disabled={!designName.trim() || loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading
                    ? "Saving..."
                    : currentDesign
                    ? "Update Design"
                    : "Save Design"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 text-center mt-8 shadow-lg">
            <div className="text-yellow-800">
              <p className="font-semibold text-lg mb-2 flex items-center justify-center gap-3">
                🔒 <span>Sign in to unlock full studio features</span>
              </p>
              <p className="text-sm">
                Save designs, access premium templates, and export high-resolution files
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignStudio;
