const Font = require('../models/Font.model');

// Get all fonts with filtering and pagination
const getFonts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      provider, 
      search, 
      sortBy = 'popularity', 
      sortOrder = 'desc',
      isPremium
    } = req.query;

    const filter = { isActive: true };
    
    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    // Provider filter
    if (provider && provider !== 'all') {
      filter.provider = provider;
    }
    
    // Premium filter
    if (isPremium !== undefined) {
      filter.isPremium = isPremium === 'true';
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { family: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort configuration
    const sort = {};
    if (sortBy === 'rating') {
      sort['rating.average'] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const fonts = await Font.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')
      .exec();

    const total = await Font.countDocuments(filter);

    res.json({
      fonts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalFonts: total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('Get fonts error:', error);
    res.status(500).json({ message: 'Server error fetching fonts' });
  }
};

// Get single font by ID
const getFont = async (req, res) => {
  try {
    const { id } = req.params;

    const font = await Font.findById(id);

    if (!font) {
      return res.status(404).json({ message: 'Font not found' });
    }

    // Increment download count
    font.downloadCount += 1;
    await font.save();

    res.json(font);
  } catch (error) {
    console.error('Get font error:', error);
    res.status(500).json({ message: 'Server error fetching font' });
  }
};

// Get popular fonts
const getPopularFonts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const fonts = await Font.find({ isActive: true })
      .sort({ popularity: -1, downloadCount: -1 })
      .limit(parseInt(limit))
      .select('name family category provider variants previewText popularity downloadCount rating')
      .exec();

    res.json(fonts);
  } catch (error) {
    console.error('Get popular fonts error:', error);
    res.status(500).json({ message: 'Server error fetching popular fonts' });
  }
};

// Get fonts by category
const getFontsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const filter = { isActive: true, category };

    const fonts = await Font.find(filter)
      .sort({ popularity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name family category variants previewText popularity rating')
      .exec();

    const total = await Font.countDocuments(filter);

    res.json({
      fonts,
      category,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalFonts: total
    });
  } catch (error) {
    console.error('Get fonts by category error:', error);
    res.status(500).json({ message: 'Server error fetching fonts by category' });
  }
};

// Create new font (Admin only)
const createFont = async (req, res) => {
  try {
    const fontData = req.body;

    // Check if font already exists
    const existingFont = await Font.findOne({ 
      $or: [
        { name: fontData.name },
        { family: fontData.family }
      ]
    });

    if (existingFont) {
      return res.status(400).json({ message: 'Font with this name or family already exists' });
    }

    const font = new Font(fontData);
    await font.save();

    res.status(201).json(font);
  } catch (error) {
    console.error('Create font error:', error);
    res.status(500).json({ message: 'Server error creating font' });
  }
};

// Update font (Admin only)
const updateFont = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const font = await Font.findByIdAndUpdate(
      id,
      { ...updateData, 'metadata.lastUpdated': new Date() },
      { new: true, runValidators: true }
    );

    if (!font) {
      return res.status(404).json({ message: 'Font not found' });
    }

    res.json(font);
  } catch (error) {
    console.error('Update font error:', error);
    res.status(500).json({ message: 'Server error updating font' });
  }
};

// Delete font (Admin only)
const deleteFont = async (req, res) => {
  try {
    const { id } = req.params;

    const font = await Font.findByIdAndDelete(id);

    if (!font) {
      return res.status(404).json({ message: 'Font not found' });
    }

    res.json({ message: 'Font deleted successfully' });
  } catch (error) {
    console.error('Delete font error:', error);
    res.status(500).json({ message: 'Server error deleting font' });
  }
};

// Rate a font
const rateFont = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const font = await Font.findById(id);

    if (!font) {
      return res.status(404).json({ message: 'Font not found' });
    }

    // Simple rating update (in real app, you'd track individual user ratings)
    const newCount = font.rating.count + 1;
    const newAverage = ((font.rating.average * font.rating.count) + rating) / newCount;

    font.rating.average = Math.round(newAverage * 10) / 10; // Round to 1 decimal
    font.rating.count = newCount;

    await font.save();

    res.json({
      message: 'Font rated successfully',
      rating: {
        average: font.rating.average,
        count: font.rating.count
      }
    });
  } catch (error) {
    console.error('Rate font error:', error);
    res.status(500).json({ message: 'Server error rating font' });
  }
};

// Get font categories with counts
const getFontCategories = async (req, res) => {
  try {
    const categories = await Font.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          popularitySum: { $sum: '$popularity' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          avgPopularity: { $divide: ['$popularitySum', '$count'] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Get font categories error:', error);
    res.status(500).json({ message: 'Server error fetching font categories' });
  }
};

// Generate CSS for multiple fonts
const generateFontCSS = async (req, res) => {
  try {
    const { fontIds } = req.body;

    if (!fontIds || !Array.isArray(fontIds)) {
      return res.status(400).json({ message: 'Font IDs array is required' });
    }

    const fonts = await Font.find({ _id: { $in: fontIds }, isActive: true });

    const cssRules = fonts.map(font => font.getFontFaceCSS()).join('\n\n');

    res.setHeader('Content-Type', 'text/css');
    res.send(cssRules);
  } catch (error) {
    console.error('Generate font CSS error:', error);
    res.status(500).json({ message: 'Server error generating CSS' });
  }
};

module.exports = {
  getFonts,
  getFont,
  getPopularFonts,
  getFontsByCategory,
  createFont,
  updateFont,
  deleteFont,
  rateFont,
  getFontCategories,
  generateFontCSS
};