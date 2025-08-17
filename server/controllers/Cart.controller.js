const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const Design = require('../models/Design.model');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId })
      .populate({
        path: 'items.productId',
        select: 'name category basePrice images inStock'
      })
      .populate({
        path: 'items.designId',
        select: 'name previewImage'
      })
      .populate({
        path: 'items.projectId',
        select: 'name previewImage'
      });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, designId, projectId, quantity = 1, size, color, customization } = req.body;

    // Validate product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.inStock) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Validate design if provided
    if (designId) {
      const design = await Design.findById(designId);
      if (!design) {
        return res.status(404).json({ message: 'Design not found' });
      }
    }

    // Calculate unit price (base price + any customization costs)
    let unitPrice = product.basePrice;
    
    // Add customization costs if any
    if (customization) {
      // Add logic for customization pricing
      unitPrice += 2.99; // Base customization fee
    }

    const cartItem = {
      productId,
      designId: designId || null,
      projectId: projectId || null,
      quantity,
      size: size || 'M',
      color: color || 'white',
      customization,
      unitPrice,
      totalPrice: quantity * unitPrice
    };

    await cart.addItem(cartItem);

    // Populate the updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.productId',
        select: 'name category basePrice images inStock'
      })
      .populate({
        path: 'items.designId',
        select: 'name previewImage'
      })
      .populate({
        path: 'items.projectId',
        select: 'name previewImage'
      });

    res.json(updatedCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding item to cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.updateItemQuantity(itemId, quantity);

    // Populate the updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.productId',
        select: 'name category basePrice images inStock'
      })
      .populate({
        path: 'items.designId',
        select: 'name previewImage'
      })
      .populate({
        path: 'items.projectId',
        select: 'name previewImage'
      });

    res.json(updatedCart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error updating cart item' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.removeItem(itemId);

    // Populate the updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.productId',
        select: 'name category basePrice images inStock'
      })
      .populate({
        path: 'items.designId',
        select: 'name previewImage'
      })
      .populate({
        path: 'items.projectId',
        select: 'name previewImage'
      });

    res.json(updatedCart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.clearCart();

    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};

// Apply discount code
const applyDiscount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { discountCode } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Simple discount logic (in real app, you'd have a discounts table)
    let discountAmount = 0;
    let isValid = false;

    switch (discountCode.toUpperCase()) {
      case 'WELCOME10':
        discountAmount = cart.subtotal * 0.1; // 10% off
        isValid = true;
        break;
      case 'SAVE5':
        discountAmount = 5.00; // $5 off
        isValid = true;
        break;
      case 'FREESHIP':
        discountAmount = cart.shippingCost; // Free shipping
        isValid = true;
        break;
      default:
        return res.status(400).json({ message: 'Invalid discount code' });
    }

    if (isValid) {
      await cart.applyDiscount(discountCode, discountAmount);
      
      const updatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.productId',
          select: 'name category basePrice images inStock'
        })
        .populate({
          path: 'items.designId',
          select: 'name previewImage'
        })
        .populate({
          path: 'items.projectId',
          select: 'name previewImage'
        });

      res.json({
        message: 'Discount applied successfully',
        cart: updatedCart
      });
    }
  } catch (error) {
    console.error('Apply discount error:', error);
    res.status(500).json({ message: 'Server error applying discount' });
  }
};

// Get cart summary
const getCartSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({
        itemCount: 0,
        subtotal: 0,
        taxAmount: 0,
        shippingCost: 0,
        discountAmount: 0,
        total: 0
      });
    }

    res.json({
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      taxAmount: cart.taxAmount,
      shippingCost: cart.shippingCost,
      discountAmount: cart.discountAmount,
      discountCode: cart.discountCode,
      total: cart.total
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({ message: 'Server error fetching cart summary' });
  }
};

// Validate cart before checkout
const validateCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId })
      .populate('items.productId', 'name inStock basePrice');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const issues = [];

    // Check each item for availability and pricing
    for (let item of cart.items) {
      if (!item.productId) {
        issues.push(`Product no longer exists`);
        continue;
      }

      if (!item.productId.inStock) {
        issues.push(`${item.productId.name} is out of stock`);
      }

      if (item.unitPrice !== item.productId.basePrice) {
        issues.push(`Price updated for ${item.productId.name}`);
      }
    }

    if (issues.length > 0) {
      return res.status(400).json({
        message: 'Cart validation failed',
        issues
      });
    }

    res.json({
      message: 'Cart is valid',
      cart
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({ message: 'Server error validating cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyDiscount,
  getCartSummary,
  validateCart
};