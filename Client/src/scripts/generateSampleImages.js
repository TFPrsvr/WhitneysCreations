import { generateProductPlaceholder } from '../utils/placeholderGenerator.js';
import { productImageConfig } from '../data/productImages.js';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import process from 'process';

// Convert SVG data URL to actual SVG file content
const convertDataUrlToSvg = (dataUrl) => {
  const base64Data = dataUrl.replace('data:image/svg+xml;base64,', '');
  return Buffer.from(base64Data, 'base64').toString('utf8');
};

// Generate sample images for all products and variants
const generateAllSampleImages = async () => {
  const baseDir = path.join(process.cwd(), 'public', 'images', 'products');

  console.log('🎨 Generating sample product images...');

  // Create base directory if it doesn't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  let generatedCount = 0;

  // Iterate through all products in configuration
  for (const [productType, productData] of Object.entries(productImageConfig)) {
    console.log(`\n📦 Processing ${productType}...`);

    for (const [color, variant] of Object.entries(productData)) {
      console.log(`  🎨 Creating ${color} variants...`);

      // Create color directory
      const colorDir = path.join(baseDir, productType, color);
      if (!fs.existsSync(colorDir)) {
        fs.mkdirSync(colorDir, { recursive: true });
      }

      // Generate images for each angle
      variant.images.forEach((imageData) => {
        const filename = `${imageData.label.toLowerCase().replace(/\s+/g, '-')}.svg`;
        const filePath = path.join(colorDir, filename);

        // Generate SVG placeholder
        const svgDataUrl = generateProductPlaceholder(productType, color, 400, 500);
        const svgContent = convertDataUrlToSvg(svgDataUrl);

        // Write SVG file
        fs.writeFileSync(filePath, svgContent);
        generatedCount++;

        console.log(`    ✅ ${filename}`);
      });
    }
  }

  // Generate fallback images
  const fallbackDir = path.join(baseDir, 'fallback');
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }

  const fallbackProducts = ['tshirts', 'hoodies', 'mugs', 'hats', 'mousepads', 'totebags', 'phonecases', 'stickers'];

  console.log(`\n🛡️ Generating fallback images...`);
  fallbackProducts.forEach(product => {
    const filename = `${product.slice(0, -1)}-placeholder.svg`;
    const filePath = path.join(fallbackDir, filename);

    const svgDataUrl = generateProductPlaceholder(product, 'white', 400, 500);
    const svgContent = convertDataUrlToSvg(svgDataUrl);

    fs.writeFileSync(filePath, svgContent);
    generatedCount++;

    console.log(`    ✅ ${filename}`);
  });

  console.log(`\n🎉 Generated ${generatedCount} sample images!`);
  console.log('📁 Images saved to: /public/images/products/');

  return generatedCount;
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllSampleImages().catch(console.error);
}

export { generateAllSampleImages };