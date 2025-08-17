const fs = require('fs');
const path = require('path');

module.exports = {
  // Upload single image
  uploadImage: (req, res) => {
    try {
      if (!req.processedFile) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please select an image file to upload'
        });
      }

      const fileData = {
        id: req.processedFile.filename.split('-')[0], // Use UUID part as ID
        filename: req.processedFile.filename,
        originalName: req.processedFile.originalName,
        size: req.processedFile.size,
        url: req.processedFile.url,
        thumbnailUrl: req.processedFile.thumbnailUrl,
        uploadedAt: new Date().toISOString()
      };

      console.log('Image uploaded successfully:', fileData);

      res.status(200).json({
        message: 'Image uploaded successfully',
        file: fileData
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: 'Upload failed',
        message: error.message
      });
    }
  },

  // Delete uploaded image
  deleteImage: (req, res) => {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({
          error: 'Missing filename',
          message: 'Filename is required'
        });
      }

      const uploadsDir = path.join(__dirname, '../uploads');
      const filePath = path.join(uploadsDir, filename);
      const thumbnailPath = path.join(uploadsDir, `thumb_${filename}`);

      // Delete main file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete thumbnail
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }

      res.status(200).json({
        message: 'Image deleted successfully',
        filename: filename
      });

    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        error: 'Delete failed',
        message: error.message
      });
    }
  },

  // Get image info
  getImageInfo: (req, res) => {
    try {
      const { filename } = req.params;
      const uploadsDir = path.join(__dirname, '../uploads');
      const filePath = path.join(uploadsDir, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          error: 'File not found',
          message: 'The requested image does not exist'
        });
      }

      const stats = fs.statSync(filePath);
      const fileInfo = {
        filename: filename,
        size: stats.size,
        uploadedAt: stats.birthtime,
        url: `/uploads/${filename}`,
        thumbnailUrl: `/uploads/thumb_${filename}`
      };

      res.status(200).json({
        message: 'Image info retrieved successfully',
        file: fileInfo
      });

    } catch (error) {
      console.error('Get image info error:', error);
      res.status(500).json({
        error: 'Failed to get image info',
        message: error.message
      });
    }
  }
};