const Design = require('../models/Design.model');
const User = require('../models/User.model');

// Get all designs for a user
const getUserDesigns = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const userId = req.user._id;

    const filter = { userId };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const designs = await Design.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username first last')
      .exec();

    const total = await Design.countDocuments(filter);

    res.json({
      designs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalDesigns: total
    });
  } catch (error) {
    console.error('Get user designs error:', error);
    res.status(500).json({ message: 'Server error fetching designs' });
  }
};

// Get single design
const getDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const design = await Design.findOne({ 
      _id: id, 
      $or: [{ userId }, { isPublic: true }] 
    }).populate('userId', 'username first last');

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.json(design);
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ message: 'Server error fetching design' });
  }
};

// Create new design
const createDesign = async (req, res) => {
  try {
    const { name, description, category, dimensions, backgroundColor, elements, tags } = req.body;
    const userId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Design name is required' });
    }

    const design = new Design({
      name: name.trim(),
      description: description?.trim(),
      userId,
      category: category || 'custom',
      dimensions: {
        width: dimensions?.width || 800,
        height: dimensions?.height || 600
      },
      backgroundColor: backgroundColor || '#ffffff',
      elements: elements || [],
      tags: tags || []
    });

    await design.save();

    const populatedDesign = await Design.findById(design._id)
      .populate('userId', 'username first last');

    res.status(201).json(populatedDesign);
  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({ message: 'Server error creating design' });
  }
};

// Update design
const updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const design = await Design.findOne({ _id: id, userId });

    if (!design) {
      return res.status(404).json({ message: 'Design not found or access denied' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'name', 'description', 'category', 'dimensions', 'backgroundColor', 
      'elements', 'tags', 'isPublic', 'previewImage'
    ];

    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        design[field] = updateData[field];
      }
    });

    // Increment version
    design.version += 1;

    await design.save();

    const updatedDesign = await Design.findById(design._id)
      .populate('userId', 'username first last');

    res.json(updatedDesign);
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ message: 'Server error updating design' });
  }
};

// Delete design
const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const design = await Design.findOne({ _id: id, userId });

    if (!design) {
      return res.status(404).json({ message: 'Design not found or access denied' });
    }

    await Design.findByIdAndDelete(id);

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ message: 'Server error deleting design' });
  }
};

// Duplicate design
const duplicateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const originalDesign = await Design.findOne({ 
      _id: id, 
      $or: [{ userId }, { isPublic: true }] 
    });

    if (!originalDesign) {
      return res.status(404).json({ message: 'Design not found' });
    }

    const duplicatedDesign = new Design({
      name: `${originalDesign.name} (Copy)`,
      description: originalDesign.description,
      userId,
      category: originalDesign.category,
      dimensions: originalDesign.dimensions,
      backgroundColor: originalDesign.backgroundColor,
      elements: originalDesign.elements,
      tags: originalDesign.tags,
      isPublic: false
    });

    await duplicatedDesign.save();

    const populatedDesign = await Design.findById(duplicatedDesign._id)
      .populate('userId', 'username first last');

    res.status(201).json(populatedDesign);
  } catch (error) {
    console.error('Duplicate design error:', error);
    res.status(500).json({ message: 'Server error duplicating design' });
  }
};

// Get public templates
const getTemplates = async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;

    const filter = { isTemplate: true, isPublic: true };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const templates = await Design.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username')
      .exec();

    const total = await Design.countDocuments(filter);

    res.json({
      templates,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTemplates: total
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error fetching templates' });
  }
};

// Get design statistics
const getDesignStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Design.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalDesigns: { $sum: 1 },
          publicDesigns: {
            $sum: { $cond: [{ $eq: ['$isPublic', true] }, 1, 0] }
          },
          categories: { $addToSet: '$category' }
        }
      }
    ]);

    const result = stats[0] || {
      totalDesigns: 0,
      publicDesigns: 0,
      categories: []
    };

    res.json(result);
  } catch (error) {
    console.error('Get design stats error:', error);
    res.status(500).json({ message: 'Server error fetching design statistics' });
  }
};

module.exports = {
  getUserDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  getTemplates,
  getDesignStats
};