const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Image processing middleware
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const filename = `${uuidv4()}-${Date.now()}.webp`;
    const filepath = path.join(uploadsDir, filename);
    
    // Process image with sharp
    await sharp(req.file.buffer)
      .resize(2000, 2000, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Create thumbnail
    const thumbnailFilename = `thumb_${filename}`;
    const thumbnailPath = path.join(uploadsDir, thumbnailFilename);
    
    await sharp(req.file.buffer)
      .resize(300, 300, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    // Add processed file info to request
    req.processedFile = {
      filename: filename,
      thumbnailFilename: thumbnailFilename,
      originalName: req.file.originalname,
      mimetype: 'image/webp',
      size: fs.statSync(filepath).size,
      path: filepath,
      thumbnailPath: thumbnailPath,
      url: `/uploads/${filename}`,
      thumbnailUrl: `/uploads/${thumbnailFilename}`
    };

    next();
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      error: 'Image processing failed',
      message: error.message 
    });
  }
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size cannot exceed 10MB'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Invalid field',
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: error.message
    });
  }

  next(error);
};

module.exports = {
  upload,
  processImage,
  handleUploadError
};