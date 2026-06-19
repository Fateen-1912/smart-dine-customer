import cardMedium1 from '../assets/images/card_medium_1.png';
import cardMedium2 from '../assets/images/card_medium_2.png';
import cardBig1 from '../assets/images/card_big_1.png';
import cardBig2 from '../assets/images/card_big_2.png';
import cardBig3 from '../assets/images/card_big_3.png';

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  time: string;
  delivery: string;
  image: string;
  tags: string[];
  priceRange?: string;
  reviewCount?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  description?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isFeatured?: boolean;
  isPopular?: boolean;
}

export const categories: Category[] = [
  { id: '1', name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80' },
  { id: '4', name: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80' },
  { id: '5', name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&q=80' },
  { id: '6', name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80' },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: "McDonald's",
    rating: 4.5,
    time: '15-20 min',
    delivery: 'Free delivery',
    image: cardMedium1,
    tags: ['$$', 'Chinese', 'American'],
    priceRange: '$$',
    reviewCount: '20k',
    isFeatured: true,
    description: "McDonald's Corporation is an American fast food company, founded in 1940 as a restaurant operated by Richard and Maurice McDonald."
  },
  {
    id: '2',
    name: "The Halal Guys",
    rating: 4.7,
    time: '25-30 min',
    delivery: 'Free delivery',
    image: cardMedium2,
    tags: ['$$', 'Middle Eastern', 'Halal'],
    priceRange: '$$',
    reviewCount: '15k',
    isFeatured: true,
    description: "The Halal Guys are the pioneers of American Halal Food. American Halal Food features a flavor profile that is a mashup of Mediterranean and Middle Eastern flavors."
  },
  {
    id: '3',
    name: "Burger King",
    rating: 4.3,
    time: '20-25 min',
    delivery: 'Free delivery',
    image: cardBig1,
    tags: ['$', 'Burger', 'Fast Food'],
    priceRange: '$',
    reviewCount: '18k',
    description: "Burger King is an American multinational chain of hamburger fast food restaurants."
  },
  {
    id: '4',
    name: "Cafe Brichor's",
    rating: 4.8,
    time: '30-45 min',
    delivery: 'Rs 50 delivery',
    image: cardBig2,
    tags: ['$$', 'Chinese', 'American'],
    priceRange: '$$',
    reviewCount: '21k',
    isFeatured: true,
    description: "A cozy cafe serving the best coffee and pastries in town."
  },
  {
    id: '5',
    name: "Cafe Brichor's",
    rating: 4.1,
    time: '30-40 min',
    delivery: 'Free delivery',
    image: cardBig3,
    tags: ['$$', 'Chinese', 'American'],
    priceRange: '$$',
    reviewCount: '12k',
    description: "Cafe Brichor's second location serving fresh food with a modern twist."
  }
];

export const menuItems: MenuItem[] = [
  // McDonald's
  {
    id: '101',
    restaurantId: '1',
    name: 'Big Mac',
    description: 'Mouthwatering perfection starts with two 100% pure beef patties and Big Mac sauce sandwiched between a sesame seed bun.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
    categoryId: '1',
    isFeatured: true,
    isPopular: true
  },
  {
    id: '102',
    restaurantId: '1',
    name: 'McChicken',
    description: 'It’s a classic for a reason. Savor the satisfying crunch of our juicy chicken patty, topped with shredded lettuce and just the right amount of creamy mayonnaise, all served on a perfectly toasted bun.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=500&q=80',
    categoryId: '1',
    isPopular: true
  },
  {
    id: '103',
    restaurantId: '1',
    name: 'Fries (Medium)',
    description: 'Our World Famous Fries® are made with premium potatoes such as the Russet Burbank and the Shepody.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=500&q=80',
    categoryId: '1'
  },
  
  // The Halal Guys
  {
    id: '201',
    restaurantId: '2',
    name: 'Chicken Platter',
    description: 'Marinated chicken served over rice with lettuce, tomatoes, and our famous white sauce.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',
    categoryId: '3',
    isFeatured: true
  },
  {
    id: '202',
    restaurantId: '2',
    name: 'Gyro Sandwich',
    description: 'Beef gyro wrapped in warm pita bread with veggies and sauce.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1561651823-34febf224567?auto=format&fit=crop&w=500&q=80',
    categoryId: '3',
    isPopular: true
  },

  // Cafe Brichor's
  {
    id: '401',
    restaurantId: '4',
    name: 'Cookie Sandwich',
    description: 'Shortbread, chocolate turtle cookies, and red velvet. 8 ounces cream cheese, softened.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80',
    categoryId: '4',
    isFeatured: true,
    isPopular: true
  },
  {
    id: '402',
    restaurantId: '4',
    name: 'Cappuccino',
    description: 'Rich espresso with steamed milk and foam.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80',
    categoryId: '4'
  },

  // Pizza Hut
  {
    id: '501',
    restaurantId: '5',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni pizza with mozzarella cheese.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80',
    categoryId: '2',
    isFeatured: true
  },
  {
    id: '502',
    restaurantId: '5',
    name: 'Veggie Supreme',
    description: 'Loaded with fresh vegetables and cheese.',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    categoryId: '2'
  }
];
