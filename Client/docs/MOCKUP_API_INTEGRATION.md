# Mockup API Integration Guide

## Overview
Whitney's Creations now supports integration with professional mockup generation services. The system automatically falls back to local canvas-based generation when APIs are not configured.

## Supported Services

### 1. **Printful** (Recommended)
- **Best for:** Print-on-demand with real product mockups
- **Features:** High-quality mockups, real product variants, fast generation
- **Setup:** [Get API Key](https://www.printful.com/dashboard/settings)
- **Pricing:** Free tier available

### 2. **Mockey.ai**
- **Best for:** AI-powered mockup generation
- **Features:** Smart background removal, realistic lighting
- **Setup:** [Get API Key](https://mockey.ai/api)
- **Pricing:** Pay-per-use

### 3. **Printify**
- **Best for:** Multiple print providers
- **Features:** Wide product selection, competitive pricing
- **Setup:** [Get API Key](https://printify.com/app/account#api)
- **Pricing:** Free to start

### 4. **Placeit by Envato**
- **Best for:** Professional templates
- **Features:** Thousands of templates, high-quality renders
- **Setup:** [Get API Key](https://placeit.net/api)
- **Pricing:** Subscription-based

## Configuration

### 1. Environment Setup
Copy `.env.example` to `.env` and add your API keys:

```bash
# Printful Configuration
REACT_APP_PRINTFUL_API_KEY=your_printful_api_key_here

# Printify Configuration
REACT_APP_PRINTIFY_API_KEY=your_printify_api_key_here
REACT_APP_PRINTIFY_SHOP_ID=your_shop_id_here

# Mockey.ai Configuration
REACT_APP_MOCKEY_API_KEY=your_mockey_api_key_here

# Placeit Configuration
REACT_APP_PLACEIT_API_KEY=your_placeit_api_key_here
```

### 2. Service Priority
Services are tried in this order:
1. Printful (best quality, most reliable)
2. Mockey.ai (AI-powered, good for quick generation)
3. Printify (good selection, reliable)
4. Placeit (template-based, professional)
5. Local Canvas (fallback, always available)

## Usage

### Basic Usage
The mockup service automatically selects the best available API:

```javascript
import mockupService from '../services/mockupAPI';

// Generate mockup with automatic service selection
const result = await mockupService.generateMockup(
  'tshirts',           // Product type
  designImageUrl,      // Your design URL
  {
    color: 'white',
    angle: 0,
    format: 'png',
    quality: 'high'
  }
);

if (result.success) {
  console.log('Mockup generated:', result.data);
  console.log('Service used:', result.service);
} else if (result.fallback) {
  console.log('Using local generation');
}
```

### Service-Specific Usage

#### Printful
```javascript
import { printfulAPI } from '../services/mockupAPI';

// Get available products
const products = await printfulAPI.getProducts();

// Generate mockup
const mockup = await printfulAPI.generateMockup(71, designUrl, {
  variantIds: [4012, 4013],
  placement: 'front',
  format: 'jpg',
  width: 1800,
  height: 2400
});

// Check status
const status = await printfulAPI.getMockupStatus(mockup.data.task_key);
```

#### Mockey.ai
```javascript
import { mockeyAPI } from '../services/mockupAPI';

const mockup = await mockeyAPI.generateMockup('tshirt', designUrl, {
  background: 'transparent',
  angle: 'front',
  resolution: 'high'
});
```

## Stock Photos Integration

The system now includes high-quality stock photos for all products:

```javascript
import { stockPhotos } from '../data/productImages';

// Get stock photo for specific product/color
const tshirtPhoto = stockPhotos.tshirts.white;
const hoodiePhoto = stockPhotos.hoodies.black;

// Photos are automatically used as fallbacks
// when mockup generation fails or APIs are unavailable
```

## Features

### Automatic Fallback
- Tries configured APIs in priority order
- Falls back to local canvas generation
- No API keys required for basic functionality

### High-Quality Images
- All stock photos: 1200px width, 95% quality
- Optimized for web and print
- Fast CDN delivery via Unsplash

### Performance
- Image preloading for smooth UX
- Caching for repeated requests
- Background processing for slow APIs

## Troubleshooting

### API Not Working
1. Check API key is correctly set in `.env`
2. Verify service is enabled (check service status)
3. Check network connectivity
4. Review service-specific rate limits

### Poor Image Quality
1. Increase resolution in options
2. Use `quality: 'high'` parameter
3. Try different service (Printful recommended)

### Slow Generation
1. Enable image preloading
2. Use caching where possible
3. Consider background processing
4. Check API service status

## Best Practices

1. **Always Provide Fallback:** Local generation ensures mockups always work
2. **Cache Results:** Store generated mockups to avoid repeat API calls
3. **Optimize Designs:** Provide high-res designs (minimum 1800x2400px)
4. **Monitor Usage:** Track API usage to stay within limits
5. **Test Locally First:** Use local generation during development

## API Response Format

```javascript
{
  success: true,
  data: {
    mockup_url: 'https://...',
    variant_ids: [4012],
    format: 'png',
    // Service-specific fields
  },
  service: 'printful'  // Which API was used
}
```

## Support

For issues or questions:
- Check [API Documentation](docs/)
- Review service-specific docs
- Check console for error messages
- Fallback to local generation always works

## Future Enhancements

- [ ] Batch mockup generation
- [ ] Custom template uploads
- [ ] Advanced positioning controls
- [ ] Multiple design layers
- [ ] Video mockup generation
- [ ] 3D product views
