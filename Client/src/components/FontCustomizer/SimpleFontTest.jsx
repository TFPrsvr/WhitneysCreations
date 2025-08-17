import React, { useState } from 'react';

const SimpleFontTest = () => {
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState('#000000');
  const [text, setText] = useState('Sample Text');

  const fonts = [
    'Arial',
    'Helvetica', 
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Courier New'
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>Font Test Page</h1>
      
      {/* Controls */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginBottom: '30px',
        maxWidth: '600px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Font Family:
          </label>
          <select 
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Font Size: {fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Text Color:
          </label>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            style={{ width: '100%', height: '40px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Sample Text:
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>
      </div>

      {/* Preview */}
      <div style={{ 
        border: '2px solid #ccc', 
        borderRadius: '8px', 
        padding: '40px', 
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: selectedFont,
          fontSize: `${fontSize}px`,
          color: fontColor,
          wordBreak: 'break-word'
        }}>
          {text}
        </div>
      </div>

      {/* Font Info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e9e9e9', 
        borderRadius: '5px' 
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Current Settings:</h3>
        <p style={{ margin: '5px 0' }}><strong>Font:</strong> {selectedFont}</p>
        <p style={{ margin: '5px 0' }}><strong>Size:</strong> {fontSize}px</p>
        <p style={{ margin: '5px 0' }}><strong>Color:</strong> {fontColor}</p>
        <p style={{ margin: '5px 0' }}><strong>Text:</strong> "{text}"</p>
      </div>

      {/* Test Status */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#d4edda', 
        borderRadius: '5px',
        border: '1px solid #c3e6cb'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✅ Font Test Working!</h3>
        <p style={{ margin: '0', color: '#155724' }}>
          If you can see this page and interact with the controls, the fonts route is working correctly.
        </p>
      </div>
    </div>
  );
};

export default SimpleFontTest;