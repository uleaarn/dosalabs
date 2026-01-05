import { KitItem } from '../types.ts';

const kitsData: KitItem[] = [
  {
    "id": "k1",
    "name": "Dosa Starter Pan Kit",
    "price": 59,
    "delivery": "ship",
    "image": "https://firebasestorage.googleapis.com/v0/b/dosalabs-95e1b.firebasestorage.app/o/Dosa%20Pankit.jpg?alt=media&token=e1c291ba-aa99-454e-a9d6-d6159603b407",
    "description": "Premium flat dosa pan (pre-seasoned), heat distribution guide, and technique card. Most dosas fail because of uneven heat and sticky surfaces. This pan fixes that.",
    "details": [
      "Premium flat dosa pan (pre-seasoned)",
      "Heat distribution guide",
      "Spreading & flipping technique card"
    ],
    "recommended": true
  },
  {
    "id": "k2",
    "name": "Chutney Spice Kit",
    "price": 24,
    "delivery": "ship",
    "image": "https://firebasestorage.googleapis.com/v0/b/dosalabs-95e1b.firebasestorage.app/o/Spice%20Box.jpeg?alt=media&token=d4253ec5-8faf-4f5b-81a5-2596f46ae13a",
    "description": "Essential tempering spices and dal required to make restaurant-quality chutneys at home.",
    "details": [
      "Roasted urad dal",
      "Dried red chilies",
      "Curry leaves",
      "Mustard seeds",
      "Tempering spice mix"
    ]
  },
  {
    "id": "k3",
    "name": "Fresh Fermented Batter (32oz)",
    "price": 12,
    "delivery": "pickup",
    "image": "https://firebasestorage.googleapis.com/v0/b/dosalabs-95e1b.firebasestorage.app/o/dosabatter.jpg?alt=media&token=1c57d79f-1eee-4999-b68f-ec96d2bc767f",
    "description": "Freshly ground dosa batter (serves 4–6 dosas). Note: Available for local pickup only within NJ. Pickup slot required during checkout.",
    "details": [
      "Freshly ground dosa batter (serves 4–6)",
      "Fermentation timing card"
    ]
  }
];

export default kitsData;