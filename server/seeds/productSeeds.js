const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Classic Cotton T-Shirt",
    description: "Premium 100% cotton t-shirt perfect for custom designs. Soft, comfortable, and durable with excellent print quality.",
    category: "apparel",
    type: "t-shirt",
    basePrice: 15.99,
    variants: [
      { size: "S", color: "White", colorHex: "#FFFFFF", price: 15.99, stock: 50, sku: "CT-WHT-S" },
      { size: "M", color: "White", colorHex: "#FFFFFF", price: 15.99, stock: 75, sku: "CT-WHT-M" },
      { size: "L", color: "White", colorHex: "#FFFFFF", price: 15.99, stock: 60, sku: "CT-WHT-L" },
      { size: "XL", color: "White", colorHex: "#FFFFFF", price: 17.99, stock: 40, sku: "CT-WHT-XL" },
      { size: "S", color: "Black", colorHex: "#000000", price: 15.99, stock: 45, sku: "CT-BLK-S" },
      { size: "M", color: "Black", colorHex: "#000000", price: 15.99, stock: 70, sku: "CT-BLK-M" },
      { size: "L", color: "Black", colorHex: "#000000", price: 15.99, stock: 55, sku: "CT-BLK-L" },
      { size: "S", color: "Navy", colorHex: "#1e3a8a", price: 15.99, stock: 30, sku: "CT-NVY-S" },
      { size: "M", color: "Navy", colorHex: "#1e3a8a", price: 15.99, stock: 35, sku: "CT-NVY-M" }
    ],
    images: [
      { url: "/images/products/tshirt-white.jpg", alt: "White Cotton T-Shirt", isPrimary: true },
      { url: "/images/products/tshirt-black.jpg", alt: "Black Cotton T-Shirt", isPrimary: false }
    ],
    printAreas: [
      { name: "Front", maxWidth: 11, maxHeight: 14, position: { x: 50, y: 25 } },
      { name: "Back", maxWidth: 11, maxHeight: 14, position: { x: 50, y: 25 } }
    ],
    material: "100% Cotton",
    brand: "Bella+Canvas",
    weight: 4.2,
    isActive: true,
    isFeatured: true,
    tags: ["cotton", "basic", "unisex", "comfortable"]
  },
  {
    name: "Premium Hoodie",
    description: "Cozy fleece-lined hoodie with kangaroo pocket. Perfect for cooler weather and bold custom designs.",
    category: "apparel",
    type: "hoodie",
    basePrice: 35.99,
    variants: [
      { size: "S", color: "Heather Grey", colorHex: "#9CA3AF", price: 35.99, stock: 25, sku: "HD-HGR-S" },
      { size: "M", color: "Heather Grey", colorHex: "#9CA3AF", price: 35.99, stock: 30, sku: "HD-HGR-M" },
      { size: "L", color: "Heather Grey", colorHex: "#9CA3AF", price: 35.99, stock: 35, sku: "HD-HGR-L" },
      { size: "XL", color: "Heather Grey", colorHex: "#9CA3AF", price: 38.99, stock: 20, sku: "HD-HGR-XL" },
      { size: "S", color: "Black", colorHex: "#000000", price: 35.99, stock: 20, sku: "HD-BLK-S" },
      { size: "M", color: "Black", colorHex: "#000000", price: 35.99, stock: 25, sku: "HD-BLK-M" },
      { size: "L", color: "Black", colorHex: "#000000", price: 35.99, stock: 30, sku: "HD-BLK-L" }
    ],
    images: [
      { url: "/images/products/hoodie-grey.jpg", alt: "Heather Grey Hoodie", isPrimary: true },
      { url: "/images/products/hoodie-black.jpg", alt: "Black Hoodie", isPrimary: false }
    ],
    printAreas: [
      { name: "Front", maxWidth: 10, maxHeight: 12, position: { x: 50, y: 30 } },
      { name: "Back", maxWidth: 12, maxHeight: 15, position: { x: 50, y: 25 } }
    ],
    material: "50% Cotton, 50% Polyester",
    brand: "Gildan",
    weight: 8.0,
    isActive: true,
    isFeatured: true,
    tags: ["hoodie", "warm", "fleece", "casual"]
  },
  {
    name: "Ceramic Coffee Mug",
    description: "High-quality 11oz ceramic mug with smooth finish. Dishwasher and microwave safe. Perfect for custom photos and text.",
    category: "accessories",
    type: "mug",
    basePrice: 12.99,
    variants: [
      { size: "One Size", color: "White", colorHex: "#FFFFFF", price: 12.99, stock: 100, sku: "MG-WHT-11" },
      { size: "One Size", color: "Black", colorHex: "#000000", price: 14.99, stock: 75, sku: "MG-BLK-11" },
      { size: "One Size", color: "Blue", colorHex: "#3B82F6", price: 14.99, stock: 50, sku: "MG-BLU-11" }
    ],
    images: [
      { url: "/images/products/mug-white.jpg", alt: "White Ceramic Mug", isPrimary: true },
      { url: "/images/products/mug-black.jpg", alt: "Black Ceramic Mug", isPrimary: false }
    ],
    printAreas: [
      { name: "Wrap Around", maxWidth: 8.5, maxHeight: 3.5, position: { x: 50, y: 50 } }
    ],
    material: "Ceramic",
    brand: "Premium Ceramics",
    weight: 0.8,
    dimensions: { length: 4.5, width: 3.25, height: 3.75 },
    isActive: true,
    isFeatured: false,
    tags: ["mug", "ceramic", "dishwasher-safe", "gift"]
  },
  {
    name: "Snapback Cap",
    description: "Classic 6-panel snapback cap with flat visor. Structured crown with mesh back panels for breathability.",
    category: "accessories",
    type: "cap",
    basePrice: 19.99,
    variants: [
      { size: "One Size", color: "Black/White", colorHex: "#000000", price: 19.99, stock: 40, sku: "CP-BW-OS" },
      { size: "One Size", color: "Navy/White", colorHex: "#1e3a8a", price: 19.99, stock: 35, sku: "CP-NW-OS" },
      { size: "One Size", color: "Red/White", colorHex: "#DC2626", price: 19.99, stock: 25, sku: "CP-RW-OS" }
    ],
    images: [
      { url: "/images/products/cap-black.jpg", alt: "Black Snapback Cap", isPrimary: true },
      { url: "/images/products/cap-navy.jpg", alt: "Navy Snapback Cap", isPrimary: false }
    ],
    printAreas: [
      { name: "Front Panel", maxWidth: 4, maxHeight: 3, position: { x: 50, y: 40 } }
    ],
    material: "Cotton/Polyester Blend",
    brand: "FlexFit",
    weight: 0.3,
    isActive: true,
    isFeatured: false,
    tags: ["cap", "snapback", "adjustable", "urban"]
  },
  {
    name: "Canvas Tote Bag",
    description: "Eco-friendly 15oz canvas tote bag with reinforced handles. Perfect for custom designs and everyday use.",
    category: "accessories",
    type: "tote-bag",
    basePrice: 14.99,
    variants: [
      { size: "One Size", color: "Natural", colorHex: "#F5F5DC", price: 14.99, stock: 60, sku: "TB-NAT-OS" },
      { size: "One Size", color: "Black", colorHex: "#000000", price: 16.99, stock: 45, sku: "TB-BLK-OS" }
    ],
    images: [
      { url: "/images/products/tote-natural.jpg", alt: "Natural Canvas Tote", isPrimary: true },
      { url: "/images/products/tote-black.jpg", alt: "Black Canvas Tote", isPrimary: false }
    ],
    printAreas: [
      { name: "Front", maxWidth: 10, maxHeight: 10, position: { x: 50, y: 50 } },
      { name: "Back", maxWidth: 10, maxHeight: 10, position: { x: 50, y: 50 } }
    ],
    material: "100% Cotton Canvas",
    brand: "EcoCanvas",
    weight: 0.5,
    dimensions: { length: 15, width: 16, height: 6 },
    isActive: true,
    isFeatured: false,
    tags: ["tote", "canvas", "eco-friendly", "reusable"]
  },
  {
    name: "Premium Poster Print",
    description: "High-quality matte finish poster print on premium paper. Available in multiple sizes for any space.",
    category: "home-decor",
    type: "poster",
    basePrice: 8.99,
    variants: [
      { size: "8x10", color: "Matte White", colorHex: "#FFFFFF", price: 8.99, stock: 200, sku: "PS-MW-8x10" },
      { size: "11x14", color: "Matte White", colorHex: "#FFFFFF", price: 12.99, stock: 150, sku: "PS-MW-11x14" },
      { size: "16x20", color: "Matte White", colorHex: "#FFFFFF", price: 18.99, stock: 100, sku: "PS-MW-16x20" },
      { size: "18x24", color: "Matte White", colorHex: "#FFFFFF", price: 24.99, stock: 75, sku: "PS-MW-18x24" }
    ],
    images: [
      { url: "/images/products/poster-8x10.jpg", alt: "8x10 Poster", isPrimary: true },
      { url: "/images/products/poster-16x20.jpg", alt: "16x20 Poster", isPrimary: false }
    ],
    printAreas: [
      { name: "Full Print", maxWidth: 100, maxHeight: 100, position: { x: 0, y: 0 } }
    ],
    material: "Premium Matte Paper",
    brand: "ArtPrint Pro",
    weight: 0.1,
    isActive: true,
    isFeatured: true,
    tags: ["poster", "wall-art", "matte", "custom-print"]
  },
  {
    name: "Throw Pillow Cover",
    description: "Soft polyester pillow cover with hidden zipper. Machine washable and perfect for custom home decor.",
    category: "home-decor",
    type: "pillow",
    basePrice: 16.99,
    variants: [
      { size: "16x16", color: "White", colorHex: "#FFFFFF", price: 16.99, stock: 80, sku: "PL-WHT-16" },
      { size: "18x18", color: "White", colorHex: "#FFFFFF", price: 18.99, stock: 70, sku: "PL-WHT-18" },
      { size: "20x20", color: "White", colorHex: "#FFFFFF", price: 21.99, stock: 60, sku: "PL-WHT-20" }
    ],
    images: [
      { url: "/images/products/pillow-white.jpg", alt: "White Throw Pillow", isPrimary: true }
    ],
    printAreas: [
      { name: "Front", maxWidth: 15, maxHeight: 15, position: { x: 50, y: 50 } }
    ],
    material: "100% Polyester",
    brand: "HomeDecor Plus",
    weight: 0.3,
    isActive: true,
    isFeatured: false,
    tags: ["pillow", "home-decor", "washable", "custom"]
  },
  {
    name: "Spiral Notebook",
    description: "80-page spiral-bound notebook with custom cover printing. Perfect for journals, sketchbooks, and planners.",
    category: "stationery",
    type: "notebook",
    basePrice: 9.99,
    variants: [
      { size: "5x7", color: "White Cover", colorHex: "#FFFFFF", price: 9.99, stock: 120, sku: "NB-WHT-5x7" },
      { size: "8.5x11", color: "White Cover", colorHex: "#FFFFFF", price: 12.99, stock: 100, sku: "NB-WHT-8x11" }
    ],
    images: [
      { url: "/images/products/notebook-5x7.jpg", alt: "5x7 Spiral Notebook", isPrimary: true },
      { url: "/images/products/notebook-8x11.jpg", alt: "8.5x11 Spiral Notebook", isPrimary: false }
    ],
    printAreas: [
      { name: "Front Cover", maxWidth: 100, maxHeight: 100, position: { x: 0, y: 0 } },
      { name: "Back Cover", maxWidth: 100, maxHeight: 100, position: { x: 0, y: 0 } }
    ],
    material: "Paper/Cardstock Cover",
    brand: "StudyMate",
    weight: 0.4,
    isActive: true,
    isFeatured: false,
    tags: ["notebook", "spiral", "journal", "custom-cover"]
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} sample products`);

    // Display summary
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    console.log('\nProducts by category:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} products`);
    });

    console.log('\nSeed completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, sampleProducts };