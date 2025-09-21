export const generateProductPlaceholder = (productType, color = 'white', width = 400, height = 500) => {
  const colorMap = {
    white: '#FFFFFF',
    black: '#333333',
    red: '#DC2626',
    blue: '#2563EB',
    navy: '#1E3A8A',
    clear: 'rgba(255,255,255,0.1)'
  };

  const fillColor = colorMap[color] || '#CCCCCC';
  const strokeColor = color === 'white' ? '#E5E7EB' : '#374151';

  let svgContent = '';

  switch (productType) {
    case 'tshirts':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <path d="M 100 150 L 80 130 L 60 150 L 60 170 L 80 190 L 80 420 L 320 420 L 320 190 L 340 170 L 340 150 L 320 130 L 300 150 Z"
                fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <rect x="80" y="380" width="240" height="20" fill="rgba(0,0,0,0.1)"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">T-Shirt ${color}</text>
        </svg>
      `;
      break;

    case 'hoodies':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <path d="M 80 170 L 60 150 L 60 190 L 80 210 L 80 450 L 320 450 L 320 210 L 340 190 L 340 150 L 320 170 Z"
                fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <path d="M 140 125 A 60 60 0 0 1 260 125" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <rect x="140" y="275" width="120" height="60" fill="none" stroke="${strokeColor}" stroke-width="2"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Hoodie ${color}</text>
        </svg>
      `;
      break;

    case 'mugs':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <rect x="80" y="150" width="200" height="200" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <path d="M 280 200 A 40 40 0 0 1 280 300" fill="none" stroke="${fillColor}" stroke-width="8"/>
          <rect x="80" y="150" width="200" height="10" fill="rgba(0,0,0,0.1)"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Mug ${color}</text>
        </svg>
      `;
      break;

    case 'hats':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <path d="M 100 200 A 100 100 0 0 1 300 200" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <ellipse cx="200" cy="280" rx="80" ry="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <line x1="200" y1="100" x2="200" y2="200" stroke="${strokeColor}" stroke-width="1"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Cap ${color}</text>
        </svg>
      `;
      break;

    case 'mousepads':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <rect x="40" y="120" width="320" height="240" rx="20" ry="20" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <rect x="45" y="125" width="310" height="230" rx="15" ry="15" fill="rgba(0,0,0,0.05)"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Mouse Pad ${color}</text>
        </svg>
      `;
      break;

    case 'totebags':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <rect x="60" y="125" width="280" height="300" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <path d="M 120 125 L 140 75 L 180 75 L 200 125" fill="none" stroke="${fillColor}" stroke-width="6"/>
          <path d="M 200 125 L 220 75 L 260 75 L 280 125" fill="none" stroke="${fillColor}" stroke-width="6"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Tote Bag ${color}</text>
        </svg>
      `;
      break;

    case 'phonecases':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <rect x="80" y="50" width="160" height="320" rx="20" ry="20" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <rect x="90" y="60" width="140" height="280" rx="15" ry="15" fill="#000000"/>
          <circle cx="210" cy="90" r="8" fill="#333333"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Phone Case ${color}</text>
        </svg>
      `;
      break;

    case 'stickers':
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <rect x="80" y="120" width="160" height="160" rx="20" ry="20" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <rect x="85" y="125" width="150" height="150" rx="15" ry="15" fill="rgba(0,0,0,0.05)"/>
          <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">Sticker ${color}</text>
        </svg>
      `;
      break;

    default:
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F9FAFB"/>
          <rect x="40" y="40" width="${width-80}" height="${height-80}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
          <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Arial" font-size="16" fill="#6B7280">Product Placeholder</text>
        </svg>
      `;
  }

  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

export const generateAllPlaceholders = () => {
  const products = ['tshirts', 'hoodies', 'mugs', 'hats', 'mousepads', 'totebags', 'phonecases', 'stickers'];
  const colors = ['white', 'black', 'red', 'blue', 'navy'];

  const placeholders = {};

  products.forEach(product => {
    placeholders[product] = {};
    colors.forEach(color => {
      placeholders[product][color] = generateProductPlaceholder(product, color);
    });
  });

  return placeholders;
};