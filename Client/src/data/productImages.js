// Import placeholder generator
import { generateProductPlaceholder } from '../utils/placeholderGenerator';

export const productImageConfig = {
  tshirts: {
    white: {
      name: 'White T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front.jpg", mockup: 'tshirt_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/angle-45.jpg", mockup: 'tshirt_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/side.jpg", mockup: 'tshirt_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/angle-135.jpg", mockup: 'tshirt_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/back.jpg", mockup: 'tshirt_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/angle-225.jpg", mockup: 'tshirt_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/side-left.jpg", mockup: 'tshirt_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/angle-315.jpg", mockup: 'tshirt_white_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    black: {
      name: 'Black T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/black/front.jpg", mockup: 'tshirt_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/black/angle-45.jpg", mockup: 'tshirt_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/black/side.jpg", mockup: 'tshirt_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/black/angle-135.jpg", mockup: 'tshirt_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/black/back.jpg", mockup: 'tshirt_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/black/angle-225.jpg", mockup: 'tshirt_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/black/side-left.jpg", mockup: 'tshirt_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/black/angle-315.jpg", mockup: 'tshirt_black_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    red: {
      name: 'Red T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/red/front.jpg", mockup: 'tshirt_red_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/red/angle-45.jpg", mockup: 'tshirt_red_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/red/side.jpg", mockup: 'tshirt_red_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/red/angle-135.jpg", mockup: 'tshirt_red_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/red/back.jpg", mockup: 'tshirt_red_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/red/angle-225.jpg", mockup: 'tshirt_red_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/red/side-left.jpg", mockup: 'tshirt_red_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/red/angle-315.jpg", mockup: 'tshirt_red_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    }
  },
  hoodies: {
    white: {
      name: 'White Hoodie',
      price: '$39.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hoodies/white/front.jpg", mockup: 'hoodie_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hoodies/white/angle-45.jpg", mockup: 'hoodie_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hoodies/white/side.jpg", mockup: 'hoodie_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hoodies/white/angle-135.jpg", mockup: 'hoodie_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hoodies/white/back.jpg", mockup: 'hoodie_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hoodies/white/angle-225.jpg", mockup: 'hoodie_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hoodies/white/side-left.jpg", mockup: 'hoodie_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hoodies/white/angle-315.jpg", mockup: 'hoodie_white_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.25 }
    },
    black: {
      name: 'Black Hoodie',
      price: '$39.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hoodies/black/front.jpg", mockup: 'hoodie_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hoodies/black/angle-45.jpg", mockup: 'hoodie_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hoodies/black/side.jpg", mockup: 'hoodie_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hoodies/black/angle-135.jpg", mockup: 'hoodie_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hoodies/black/back.jpg", mockup: 'hoodie_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hoodies/black/angle-225.jpg", mockup: 'hoodie_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hoodies/black/side-left.jpg", mockup: 'hoodie_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hoodies/black/angle-315.jpg", mockup: 'hoodie_black_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.25 }
    }
  },
  mugs: {
    white: {
      name: 'White Coffee Mug',
      price: '$12.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/mugs/white/front.jpg", mockup: 'mug_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/mugs/white/angle-45.jpg", mockup: 'mug_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/mugs/white/side.jpg", mockup: 'mug_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/mugs/white/angle-135.jpg", mockup: 'mug_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/mugs/white/back.jpg", mockup: 'mug_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/mugs/white/angle-225.jpg", mockup: 'mug_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/mugs/white/side-left.jpg", mockup: 'mug_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/mugs/white/angle-315.jpg", mockup: 'mug_white_front_left' },
      ],
      designArea: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 }
    },
    black: {
      name: 'Black Coffee Mug',
      price: '$12.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/mugs/black/front.jpg", mockup: 'mug_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/mugs/black/angle-45.jpg", mockup: 'mug_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/mugs/black/side.jpg", mockup: 'mug_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/mugs/black/angle-135.jpg", mockup: 'mug_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/mugs/black/back.jpg", mockup: 'mug_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/mugs/black/angle-225.jpg", mockup: 'mug_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/mugs/black/side-left.jpg", mockup: 'mug_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/mugs/black/angle-315.jpg", mockup: 'mug_black_front_left' },
      ],
      designArea: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 }
    },
    blue: {
      name: 'Blue Coffee Mug',
      price: '$12.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/mugs/blue/front.jpg", mockup: 'mug_blue_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/mugs/blue/angle-45.jpg", mockup: 'mug_blue_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/mugs/blue/side.jpg", mockup: 'mug_blue_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/mugs/blue/angle-135.jpg", mockup: 'mug_blue_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/mugs/blue/back.jpg", mockup: 'mug_blue_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/mugs/blue/angle-225.jpg", mockup: 'mug_blue_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/mugs/blue/side-left.jpg", mockup: 'mug_blue_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/mugs/blue/angle-315.jpg", mockup: 'mug_blue_front_left' },
      ],
      designArea: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 }
    }
  },
  hats: {
    white: {
      name: 'White Baseball Cap',
      price: '$24.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hats/white/front.jpg", mockup: 'hat_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hats/white/angle-45.jpg", mockup: 'hat_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hats/white/side.jpg", mockup: 'hat_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hats/white/angle-135.jpg", mockup: 'hat_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hats/white/back.jpg", mockup: 'hat_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hats/white/angle-225.jpg", mockup: 'hat_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hats/white/side-left.jpg", mockup: 'hat_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hats/white/angle-315.jpg", mockup: 'hat_white_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.2 }
    },
    black: {
      name: 'Black Baseball Cap',
      price: '$24.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hats/black/front.jpg", mockup: 'hat_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hats/black/angle-45.jpg", mockup: 'hat_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hats/black/side.jpg", mockup: 'hat_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hats/black/angle-135.jpg", mockup: 'hat_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hats/black/back.jpg", mockup: 'hat_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hats/black/angle-225.jpg", mockup: 'hat_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hats/black/side-left.jpg", mockup: 'hat_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hats/black/angle-315.jpg", mockup: 'hat_black_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.2 }
    },
    navy: {
      name: 'Navy Baseball Cap',
      price: '$24.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hats/navy/front.jpg", mockup: 'hat_navy_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hats/navy/angle-45.jpg", mockup: 'hat_navy_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hats/navy/side.jpg", mockup: 'hat_navy_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hats/navy/angle-135.jpg", mockup: 'hat_navy_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hats/navy/back.jpg", mockup: 'hat_navy_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hats/navy/angle-225.jpg", mockup: 'hat_navy_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hats/navy/side-left.jpg", mockup: 'hat_navy_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hats/navy/angle-315.jpg", mockup: 'hat_navy_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.2 }
    }
  },
  mousepads: {
    black: {
      name: 'Black Mouse Pad',
      price: '$9.99',
      images: [
        { angle: 0, label: "Top View", src: "/images/products/mousepads/black/top.jpg", mockup: 'mousepad_black_top' },
        { angle: 45, label: "Angle View", src: "/images/products/mousepads/black/angle-45.jpg", mockup: 'mousepad_black_angle' },
        { angle: 90, label: "Side View", src: "/images/products/mousepads/black/side.jpg", mockup: 'mousepad_black_side' },
        { angle: 135, label: "Perspective View", src: "/images/products/mousepads/black/angle-135.jpg", mockup: 'mousepad_black_perspective' },
        { angle: 180, label: "Bottom View", src: "/images/products/mousepads/black/bottom.jpg", mockup: 'mousepad_black_bottom' },
        { angle: 225, label: "Back Angle", src: "/images/products/mousepads/black/angle-225.jpg", mockup: 'mousepad_black_back_angle' },
        { angle: 270, label: "Left Side", src: "/images/products/mousepads/black/side-left.jpg", mockup: 'mousepad_black_left' },
        { angle: 315, label: "Front Angle", src: "/images/products/mousepads/black/angle-315.jpg", mockup: 'mousepad_black_front_angle' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    },
    white: {
      name: 'White Mouse Pad',
      price: '$9.99',
      images: [
        { angle: 0, label: "Top View", src: "/images/products/mousepads/white/top.jpg", mockup: 'mousepad_white_top' },
        { angle: 45, label: "Angle View", src: "/images/products/mousepads/white/angle-45.jpg", mockup: 'mousepad_white_angle' },
        { angle: 90, label: "Side View", src: "/images/products/mousepads/white/side.jpg", mockup: 'mousepad_white_side' },
        { angle: 135, label: "Perspective View", src: "/images/products/mousepads/white/angle-135.jpg", mockup: 'mousepad_white_perspective' },
        { angle: 180, label: "Bottom View", src: "/images/products/mousepads/white/bottom.jpg", mockup: 'mousepad_white_bottom' },
        { angle: 225, label: "Back Angle", src: "/images/products/mousepads/white/angle-225.jpg", mockup: 'mousepad_white_back_angle' },
        { angle: 270, label: "Left Side", src: "/images/products/mousepads/white/side-left.jpg", mockup: 'mousepad_white_left' },
        { angle: 315, label: "Front Angle", src: "/images/products/mousepads/white/angle-315.jpg", mockup: 'mousepad_white_front_angle' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    }
  },
  totebags: {
    white: {
      name: 'White Tote Bag',
      price: '$14.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/totebags/white/front.jpg", mockup: 'totebag_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/totebags/white/angle-45.jpg", mockup: 'totebag_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/totebags/white/side.jpg", mockup: 'totebag_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/totebags/white/angle-135.jpg", mockup: 'totebag_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/totebags/white/back.jpg", mockup: 'totebag_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/totebags/white/angle-225.jpg", mockup: 'totebag_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/totebags/white/side-left.jpg", mockup: 'totebag_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/totebags/white/angle-315.jpg", mockup: 'totebag_white_front_left' },
      ],
      designArea: { x: 0.25, y: 0.3, width: 0.5, height: 0.4 }
    },
    black: {
      name: 'Black Tote Bag',
      price: '$14.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/totebags/black/front.jpg", mockup: 'totebag_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/totebags/black/angle-45.jpg", mockup: 'totebag_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/totebags/black/side.jpg", mockup: 'totebag_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/totebags/black/angle-135.jpg", mockup: 'totebag_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/totebags/black/back.jpg", mockup: 'totebag_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/totebags/black/angle-225.jpg", mockup: 'totebag_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/totebags/black/side-left.jpg", mockup: 'totebag_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/totebags/black/angle-315.jpg", mockup: 'totebag_black_front_left' },
      ],
      designArea: { x: 0.25, y: 0.3, width: 0.5, height: 0.4 }
    }
  },
  phonecases: {
    clear: {
      name: 'Clear Phone Case',
      price: '$18.99',
      images: [
        { angle: 0, label: "Back View", src: "/images/products/phonecases/clear/back.jpg", mockup: 'phonecase_clear_back' },
        { angle: 45, label: "Back-Right View", src: "/images/products/phonecases/clear/angle-45.jpg", mockup: 'phonecase_clear_back_right' },
        { angle: 90, label: "Side View", src: "/images/products/phonecases/clear/side.jpg", mockup: 'phonecase_clear_side' },
        { angle: 135, label: "Side-Front View", src: "/images/products/phonecases/clear/angle-135.jpg", mockup: 'phonecase_clear_side_front' },
        { angle: 180, label: "Front View", src: "/images/products/phonecases/clear/front.jpg", mockup: 'phonecase_clear_front' },
        { angle: 225, label: "Front-Left View", src: "/images/products/phonecases/clear/angle-225.jpg", mockup: 'phonecase_clear_front_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/phonecases/clear/side-left.jpg", mockup: 'phonecase_clear_left' },
        { angle: 315, label: "Back-Left View", src: "/images/products/phonecases/clear/angle-315.jpg", mockup: 'phonecase_clear_back_left' },
      ],
      designArea: { x: 0.1, y: 0.15, width: 0.8, height: 0.7 }
    },
    black: {
      name: 'Black Phone Case',
      price: '$18.99',
      images: [
        { angle: 0, label: "Back View", src: "/images/products/phonecases/black/back.jpg", mockup: 'phonecase_black_back' },
        { angle: 45, label: "Back-Right View", src: "/images/products/phonecases/black/angle-45.jpg", mockup: 'phonecase_black_back_right' },
        { angle: 90, label: "Side View", src: "/images/products/phonecases/black/side.jpg", mockup: 'phonecase_black_side' },
        { angle: 135, label: "Side-Front View", src: "/images/products/phonecases/black/angle-135.jpg", mockup: 'phonecase_black_side_front' },
        { angle: 180, label: "Front View", src: "/images/products/phonecases/black/front.jpg", mockup: 'phonecase_black_front' },
        { angle: 225, label: "Front-Left View", src: "/images/products/phonecases/black/angle-225.jpg", mockup: 'phonecase_black_front_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/phonecases/black/side-left.jpg", mockup: 'phonecase_black_left' },
        { angle: 315, label: "Back-Left View", src: "/images/products/phonecases/black/angle-315.jpg", mockup: 'phonecase_black_back_left' },
      ],
      designArea: { x: 0.1, y: 0.15, width: 0.8, height: 0.7 }
    }
  },
  stickers: {
    white: {
      name: 'White Vinyl Sticker',
      price: '$3.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/stickers/white/front.jpg", mockup: 'sticker_white_front' },
        { angle: 45, label: "Angle View", src: "/images/products/stickers/white/angle-45.jpg", mockup: 'sticker_white_angle' },
        { angle: 90, label: "Side View", src: "/images/products/stickers/white/side.jpg", mockup: 'sticker_white_side' },
        { angle: 135, label: "Back Angle", src: "/images/products/stickers/white/angle-135.jpg", mockup: 'sticker_white_back_angle' },
        { angle: 180, label: "Back View", src: "/images/products/stickers/white/back.jpg", mockup: 'sticker_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/stickers/white/angle-225.jpg", mockup: 'sticker_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/stickers/white/side-left.jpg", mockup: 'sticker_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/stickers/white/angle-315.jpg", mockup: 'sticker_white_front_left' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    },
    clear: {
      name: 'Clear Vinyl Sticker',
      price: '$4.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/stickers/clear/front.jpg", mockup: 'sticker_clear_front' },
        { angle: 45, label: "Angle View", src: "/images/products/stickers/clear/angle-45.jpg", mockup: 'sticker_clear_angle' },
        { angle: 90, label: "Side View", src: "/images/products/stickers/clear/side.jpg", mockup: 'sticker_clear_side' },
        { angle: 135, label: "Back Angle", src: "/images/products/stickers/clear/angle-135.jpg", mockup: 'sticker_clear_back_angle' },
        { angle: 180, label: "Back View", src: "/images/products/stickers/clear/back.jpg", mockup: 'sticker_clear_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/stickers/clear/angle-225.jpg", mockup: 'sticker_clear_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/stickers/clear/side-left.jpg", mockup: 'sticker_clear_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/stickers/clear/angle-315.jpg", mockup: 'sticker_clear_front_left' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    }
  }
};

export const fallbackImages = {
  tshirts: '/images/products/fallback/tshirt-placeholder.jpg',
  hoodies: '/images/products/fallback/hoodie-placeholder.jpg',
  mugs: '/images/products/fallback/mug-placeholder.jpg',
  hats: '/images/products/fallback/hat-placeholder.jpg',
  mousepads: '/images/products/fallback/mousepad-placeholder.jpg',
  totebags: '/images/products/fallback/totebag-placeholder.jpg',
  phonecases: '/images/products/fallback/phonecase-placeholder.jpg',
  stickers: '/images/products/fallback/sticker-placeholder.jpg'
};

export const getProductImage = (productType, color, angle = 0) => {
  const product = productImageConfig[productType];
  if (!product || !product[color]) {
    // Return fallback placeholder if available
    return fallbackImages[productType] || generateProductPlaceholder(productType, color);
  }

  const colorVariant = product[color];
  if (!colorVariant.images || colorVariant.images.length === 0) {
    return fallbackImages[productType] || generateProductPlaceholder(productType, color);
  }

  const normalizedAngle = ((angle % 360) + 360) % 360;
  const angleStep = 45;
  const closestAngleIndex = Math.round(normalizedAngle / angleStep) % colorVariant.images.length;

  return colorVariant.images[closestAngleIndex]?.src || generateProductPlaceholder(productType, color);
};

export const getProductVariant = (productType, color) => {
  return productImageConfig[productType]?.[color] || null;
};

export const getAllProductTypes = () => {
  return Object.keys(productImageConfig);
};

export const getAvailableColors = (productType) => {
  return Object.keys(productImageConfig[productType] || {});
};