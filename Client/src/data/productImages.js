// Import placeholder generator
import { generateProductPlaceholder } from '../utils/placeholderGenerator';

export const productImageConfig = {
  tshirts: {
    white: {
      name: 'White T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_white_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    black: {
      name: 'Black T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/black/front-view.svg", mockup: 'tshirt_black_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    red: {
      name: 'Red T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_red_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    blue: {
      name: 'Blue T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_blue_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    navy: {
      name: 'Navy T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_navy_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    green: {
      name: 'Green T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_green_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    yellow: {
      name: 'Yellow T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_yellow_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    purple: {
      name: 'Purple T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_purple_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    pink: {
      name: 'Pink T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_pink_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    },
    orange: {
      name: 'Orange T-Shirt',
      price: '$19.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'tshirt_orange_front_left' },
      ],
      designArea: { x: 0.3, y: 0.35, width: 0.4, height: 0.3 }
    }
  },
  hoodies: {
    white: {
      name: 'White Hoodie',
      price: '$39.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_white_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.25 }
    },
    black: {
      name: 'Black Hoodie',
      price: '$39.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_black_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.25 }
    },
    red: {
      name: 'Red Hoodie',
      price: '$39.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_red_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.25 }
    },
    navy: {
      name: 'Navy Hoodie',
      price: '$39.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_navy_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.25 }
    },
    gray: {
      name: 'Gray Hoodie',
      price: '$39.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/hoodies/white/front-view.svg", mockup: 'hoodie_gray_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.25 }
    }
  },
  mugs: {
    white: {
      name: 'White Coffee Mug',
      price: '$12.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_white_front_left' },
      ],
      designArea: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 }
    },
    black: {
      name: 'Black Coffee Mug',
      price: '$12.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/mugs/white/front-view.svg", mockup: 'mug_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_black_front_left' },
      ],
      designArea: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 }
    },
    blue: {
      name: 'Blue Coffee Mug',
      price: '$12.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mug_blue_front_left' },
      ],
      designArea: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 }
    }
  },
  hats: {
    white: {
      name: 'White Baseball Cap',
      price: '$24.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_white_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.2 }
    },
    black: {
      name: 'Black Baseball Cap',
      price: '$24.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_black_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.2 }
    },
    navy: {
      name: 'Navy Baseball Cap',
      price: '$24.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'hat_navy_front_left' },
      ],
      designArea: { x: 0.3, y: 0.4, width: 0.4, height: 0.2 }
    }
  },
  mousepads: {
    black: {
      name: 'Black Mouse Pad',
      price: '$9.99',
      images: [
        { angle: 0, label: "Top View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_top' },
        { angle: 45, label: "Angle View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_angle' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_side' },
        { angle: 135, label: "Perspective View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_perspective' },
        { angle: 180, label: "Bottom View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_bottom' },
        { angle: 225, label: "Back Angle", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_back_angle' },
        { angle: 270, label: "Left Side", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_left' },
        { angle: 315, label: "Front Angle", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_black_front_angle' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    },
    white: {
      name: 'White Mouse Pad',
      price: '$9.99',
      images: [
        { angle: 0, label: "Top View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_top' },
        { angle: 45, label: "Angle View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_angle' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_side' },
        { angle: 135, label: "Perspective View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_perspective' },
        { angle: 180, label: "Bottom View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_bottom' },
        { angle: 225, label: "Back Angle", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_back_angle' },
        { angle: 270, label: "Left Side", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_left' },
        { angle: 315, label: "Front Angle", src: "/images/products/tshirts/white/front-view.svg", mockup: 'mousepad_white_front_angle' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    }
  },
  totebags: {
    white: {
      name: 'White Tote Bag',
      price: '$14.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_white_front_left' },
      ],
      designArea: { x: 0.25, y: 0.3, width: 0.5, height: 0.4 }
    },
    black: {
      name: 'Black Tote Bag',
      price: '$14.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_front' },
        { angle: 45, label: "Front-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_front_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_side' },
        { angle: 135, label: "Side-Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_side_back' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'totebag_black_front_left' },
      ],
      designArea: { x: 0.25, y: 0.3, width: 0.5, height: 0.4 }
    }
  },
  phonecases: {
    clear: {
      name: 'Clear Phone Case',
      price: '$18.99',
      images: [
        { angle: 0, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_back' },
        { angle: 45, label: "Back-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_back_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_side' },
        { angle: 135, label: "Side-Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_side_front' },
        { angle: 180, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_front' },
        { angle: 225, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_front_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_left' },
        { angle: 315, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_clear_back_left' },
      ],
      designArea: { x: 0.1, y: 0.15, width: 0.8, height: 0.7 }
    },
    black: {
      name: 'Black Phone Case',
      price: '$18.99',
      images: [
        { angle: 0, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_back' },
        { angle: 45, label: "Back-Right View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_back_right' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_side' },
        { angle: 135, label: "Side-Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_side_front' },
        { angle: 180, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_front' },
        { angle: 225, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_front_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_left' },
        { angle: 315, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'phonecase_black_back_left' },
      ],
      designArea: { x: 0.1, y: 0.15, width: 0.8, height: 0.7 }
    }
  },
  stickers: {
    white: {
      name: 'White Vinyl Sticker',
      price: '$3.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_front' },
        { angle: 45, label: "Angle View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_angle' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_side' },
        { angle: 135, label: "Back Angle", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_back_angle' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_white_front_left' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    },
    clear: {
      name: 'Clear Vinyl Sticker',
      price: '$4.99',
      images: [
        { angle: 0, label: "Front View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_front' },
        { angle: 45, label: "Angle View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_angle' },
        { angle: 90, label: "Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_side' },
        { angle: 135, label: "Back Angle", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_back_angle' },
        { angle: 180, label: "Back View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_back' },
        { angle: 225, label: "Back-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_back_left' },
        { angle: 270, label: "Left Side View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_left' },
        { angle: 315, label: "Front-Left View", src: "/images/products/tshirts/white/front-view.svg", mockup: 'sticker_clear_front_left' },
      ],
      designArea: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    }
  }
};

// High-quality stock photos from Unsplash and other sources
export const stockPhotos = {
  tshirts: {
    white: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=95',
    black: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=95',
    red: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=95',
    blue: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&q=95',
    navy: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=1200&q=95',
    green: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=1200&q=95',
    yellow: 'https://images.unsplash.com/photo-1622445275456-fc7a6b7238b4?w=1200&q=95',
    purple: 'https://images.unsplash.com/photo-1622445271453-879d4b2f2e5e?w=1200&q=95',
    pink: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&q=95',
    orange: 'https://images.unsplash.com/photo-1622445275623-42b7e3a4a2d3?w=1200&q=95',
  },
  hoodies: {
    white: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=95',
    black: 'https://images.unsplash.com/photo-1542406775-ade58c52d2e4?w=1200&q=95',
    red: 'https://images.unsplash.com/photo-1578932750355-5eb30ece2a04?w=1200&q=95',
    navy: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=1200&q=95',
    gray: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&q=95',
  },
  mugs: {
    white: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&q=95',
    black: 'https://images.unsplash.com/photo-1582991956147-0c6e3d1a2a57?w=1200&q=95',
    blue: 'https://images.unsplash.com/photo-1572443178835-bd0c88b6e3f4?w=1200&q=95',
  },
  hats: {
    white: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200&q=95',
    black: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=1200&q=95',
    navy: 'https://images.unsplash.com/photo-1608828532223-82959a47d5bc?w=1200&q=95',
  },
  mousepads: {
    black: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200&q=95',
    white: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=1200&q=95',
  },
  totebags: {
    white: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=95',
    black: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=95',
  },
  phonecases: {
    clear: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=1200&q=95',
    black: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=95',
  },
  stickers: {
    white: 'https://images.unsplash.com/photo-1594736797933-d0380ba902d8?w=1200&q=95',
    clear: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=95',
  },
};

export const fallbackImages = {
  tshirts: stockPhotos.tshirts.white,
  hoodies: stockPhotos.hoodies.white,
  mugs: stockPhotos.mugs.white,
  hats: stockPhotos.hats.white,
  mousepads: stockPhotos.mousepads.black,
  totebags: stockPhotos.totebags.white,
  phonecases: stockPhotos.phonecases.clear,
  stickers: stockPhotos.stickers.white
};

export const getProductImage = (productType, color, angle = 0) => {
  const product = productImageConfig[productType];

  // Try to get stock photo first if available
  const stockPhoto = stockPhotos[productType]?.[color];

  if (!product || !product[color]) {
    // Return stock photo, fallback, or placeholder
    return stockPhoto || fallbackImages[productType] || generateProductPlaceholder(productType, color);
  }

  const colorVariant = product[color];
  if (!colorVariant.images || colorVariant.images.length === 0) {
    return stockPhoto || fallbackImages[productType] || generateProductPlaceholder(productType, color);
  }

  const normalizedAngle = ((angle % 360) + 360) % 360;
  const angleStep = 45;
  const closestAngleIndex = Math.round(normalizedAngle / angleStep) % colorVariant.images.length;

  const imageSrc = colorVariant.images[closestAngleIndex]?.src;

  // Return stock photo if SVG doesn't exist or as fallback
  if (!imageSrc || imageSrc.includes('.svg')) {
    return stockPhoto || imageSrc || generateProductPlaceholder(productType, color);
  }

  return imageSrc;
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