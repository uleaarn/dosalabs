import { KitItem } from '../types.ts';

const kitsData: KitItem[] = [
  {
    "id": "k1",
    "name": "Dosa Starter Pan Kit",
    "price": 59,
    "delivery": "ship",
    "image": "https://images.unsplash.com/photo-1590159441113-146313506e78?q=80&w=800&auto=format&fit=crop",
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
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
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
    "image": "https://images.unsplash.com/photo-1626776876729-bab4369a5a54?q=80&w=800&auto=format&fit=crop",
    "description": "Freshly ground dosa batter (serves 4–6 dosas). Note: Available for local pickup only within NJ. Pickup slot required during checkout.",
    "details": [
      "Freshly ground dosa batter (serves 4–6)",
      "Fermentation timing card"
    ]
  }
];

export default kitsData;