import { create } from 'zustand';
import localforage from 'localforage';

// Initialize localforage
localforage.config({
  name: 'yardsale',
  storeName: 'favorites'
});

const useStore = create((set, get) => ({
  // Items state
  items: [],
  loading: false,
  error: null,
  
  // Favorites state
  favorites: [],
  
  // Filter state
  searchQuery: '',
  selectedCategory: '',
  selectedCondition: '',
  priceRange: [0, 1000],
  showFavoritesOnly: false,
  
  // Actions
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Favorites actions
  loadFavorites: async () => {
    try {
      const favorites = await localforage.getItem('favorites') || [];
      set({ favorites });
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  },
  
  toggleFavorite: async (itemId) => {
    try {
      const currentFavorites = get().favorites;
      const isFavorite = currentFavorites.includes(itemId);
      
      let newFavorites;
      if (isFavorite) {
        newFavorites = currentFavorites.filter(id => id !== itemId);
      } else {
        newFavorites = [...currentFavorites, itemId];
      }
      
      await localforage.setItem('favorites', newFavorites);
      set({ favorites: newFavorites });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  },
  
  isFavorite: (itemId) => {
    return get().favorites.includes(itemId);
  },
  
  // Filter actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedCondition: (condition) => set({ selectedCondition: condition }),
  setPriceRange: (range) => set({ priceRange: range }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
  
  // Clear all filters
  clearFilters: () => set({
    searchQuery: '',
    selectedCategory: '',
    selectedCondition: '',
    priceRange: [0, 1000],
    showFavoritesOnly: false
  }),
  
  // Get filtered items
  getFilteredItems: () => {
    const { items, searchQuery, selectedCategory, selectedCondition, priceRange, showFavoritesOnly, favorites } = get();
    
    return items.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.some(cat => cat.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (selectedCategory && !item.category.includes(selectedCategory)) {
        return false;
      }
      
      // Condition filter
      if (selectedCondition && item.condition !== selectedCondition) {
        return false;
      }
      
      // Price filter
      if (item.price < priceRange[0] || item.price > priceRange[1]) {
        return false;
      }
      
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(item.id)) {
        return false;
      }
      
      return true;
    });
  }
}));

export default useStore;
