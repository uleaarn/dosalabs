import { BlogPost } from '../types.ts';

const blogData: BlogPost[] = [
  {
    "id": "b1",
    "title": "The Chemistry of Fermentation",
    "slug": "chemistry-of-fermentation",
    "excerpt": "Why temperature and wild yeast are your best friends in the dosa lab.",
    "content": "Fermentation is a delicate dance of bacteria and yeast that transforms simple rice and lentils into a complex, tangy masterpiece. In a traditional South Indian environment, this happens naturally thanks to the ambient heat. However, in modern climate-controlled homes, we often need to simulate these conditions.\n\nThe secret lies in the 'soaking window'. By soaking the grains for exactly 6 hours, we initiate the enzymatic breakdown required for a smooth grind. Once ground, the aeration step—manually whisking the batter with your hands—introduces wild yeast that lives on our skin, which is essential for that signature rise.\n\nDuring our winter labs in New Jersey, we've found that placing the batter in a cold oven with just the light turned on creates a consistent 78-82°F micro-climate, perfect for a 12-hour fermentation cycle.",
    "date": "2024-10-12",
    "image": "https://firebasestorage.googleapis.com/v0/b/dosalabs-95e1b.firebasestorage.app/o/Dosa-Batter.jpg?alt=media&token=4381f65b-db69-46fa-b7b2-eea29ca3c20d"
  },
  {
    "id": "b2",
    "title": "Choosing Your Tawa",
    "slug": "choosing-your-tawa",
    "excerpt": "Non-stick vs. Cast Iron: Which one produces the best lattice texture?",
    "content": "A good dosa starts with the right thermal mass. While non-stick pans are convenient for beginners, they often lack the heat retention necessary to create the iconic 'pock-marked' lattice structure of a restaurant dosa.\n\nCast iron tawas, once seasoned, provide a superior radiating heat. This constant energy ensures that as soon as the thin layer of batter hits the surface, the water evaporates instantly, creating the structural holes that lead to crispness. \n\nWe recommend starting with a pre-seasoned flat cast iron pan. The trick is to never wash it with soap; instead, wipe it down with a damp cloth and a drop of neutral oil while it's still slightly warm. This builds a polymer layer that is more non-stick than Teflon over time.",
    "date": "2024-10-15",
    "image": "https://firebasestorage.googleapis.com/v0/b/dosalabs-95e1b.firebasestorage.app/o/Dosapaan.webp?alt=media&token=b816d63b-6261-4c41-8b6b-3c586c70e34c"
  }
];

export default blogData;