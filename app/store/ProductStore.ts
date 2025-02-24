import { create } from 'zustand';

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: string;
  location: string;
  image: string;
  category: string;
  description?: string;
  seller: {
    name: string;
    verified: boolean;
  };
};

type ProductStore = {
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: string;
  searchQuery: string;
  priceRange: { min: number; max: number };
  selectedLocation: string;
  sellerType: 'all' | 'verified' | 'unverified';
  addProduct: (product: Omit<Product, 'id'>) => void;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  setLocation: (location: string) => void;
  setSellerType: (type: 'all' | 'verified' | 'unverified') => void;
  applyFilters: () => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [
    {
      id: '1',
      name: 'Fresh Maize',
      price: 150,
      quantity: '50kg',
      location: 'Harare',
      category: 'crops',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600',
      seller: {
        name: 'John Moyo',
        verified: true,
      },
    },
    {
      id: '2',
      name: 'Organic Tomatoes',
      price: 80,
      quantity: '20kg',
      location: 'Bulawayo',
      category: 'crops',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600',
      seller: {
        name: 'Sarah Ndlovu',
        verified: true,
      },
    },
    {
      id: '3',
      name: 'Merino Sheep',
      price: 450,
      quantity: '1 head',
      location: 'Gweru',
      category: 'livestock',
      image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=600',
      seller: {
        name: 'David Mutasa',
        verified: true,
      },
    },
    {
      id: '4',
      name: 'Tractor (2020)',
      price: 15000,
      quantity: '1 unit',
      location: 'Harare',
      category: 'equipment',
      image: 'https://images.unsplash.com/photo-1530267981375-f09de85bf23c?q=80&w=600',
      seller: {
        name: 'Farm Solutions Ltd',
        verified: true,
      },
    },
    {
      id: '5',
      name: 'Hybrid Maize Seeds',
      price: 45,
      quantity: '5kg',
      location: 'Mutare',
      category: 'seeds',
      image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=600',
      seller: {
        name: 'Seed Co',
        verified: true,
      },
    },
  ],
  filteredProducts: [],
  selectedCategory: 'all',
  searchQuery: '',
  priceRange: { min: 0, max: 20000 },
  selectedLocation: '',
  sellerType: 'all',

  addProduct: (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    set((state) => ({
      products: [...state.products, newProduct],
    }));
    get().applyFilters();
  },

  setCategory: (category) => {
    set({ selectedCategory: category });
    get().applyFilters();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setPriceRange: (range) => {
    set({ priceRange: range });
    get().applyFilters();
  },

  setLocation: (location) => {
    set({ selectedLocation: location });
    get().applyFilters();
  },

  setSellerType: (type) => {
    set({ sellerType: type });
    get().applyFilters();
  },

  applyFilters: () => {
    const { 
      products, 
      selectedCategory, 
      searchQuery, 
      priceRange, 
      selectedLocation, 
      sellerType 
    } = get();
    
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === selectedCategory
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.location.toLowerCase().includes(query) ||
          product.seller.name.toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) => 
        product.price >= priceRange.min && 
        product.price <= priceRange.max
    );

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(
        (product) => product.location === selectedLocation
      );
    }

    // Apply seller type filter
    if (sellerType !== 'all') {
      filtered = filtered.filter(
        (product) => 
          sellerType === 'verified' ? product.seller.verified : !product.seller.verified
      );
    }
    
    set({ filteredProducts: filtered });
  },
})); 