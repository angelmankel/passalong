import { create } from 'zustand';
import localforage from 'localforage';
import { API_BASE_URL, DEFAULT_CATEGORIES, DEFAULT_CONDITIONS } from '../constants';

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
  
  // Configuration state
  categories: DEFAULT_CATEGORIES,
  conditions: DEFAULT_CONDITIONS,
  configLoading: false,
  
  // Filter state
  searchQuery: '',
  selectedCategory: '',
  selectedCondition: '',
  showFavoritesOnly: false,
  
  // Actions
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Configuration actions
  loadConfig: async () => {
    try {
      set({ configLoading: true });
      const response = await fetch(`${API_BASE_URL}/api/config`);
      if (response.ok) {
        const config = await response.json();
        set({ 
          categories: config.categories || DEFAULT_CATEGORIES,
          conditions: config.conditions || DEFAULT_CONDITIONS,
          configLoading: false 
        });
      } else {
        console.warn('Failed to load config, using defaults');
        set({ configLoading: false });
      }
    } catch (error) {
      console.error('Error loading config:', error);
      set({ configLoading: false });
    }
  },
  
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
  
  clearFavorites: async () => {
    try {
      await localforage.setItem('favorites', []);
      set({ favorites: [] });
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },
  
  // Filter actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedCondition: (condition) => set({ selectedCondition: condition }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
  
  // Clear all filters
  clearFilters: () => set({
    searchQuery: '',
    selectedCategory: '',
    selectedCondition: '',
    showFavoritesOnly: false
  }),
  
  // Get filtered items
  getFilteredItems: () => {
    const { items, searchQuery, selectedCategory, selectedCondition, showFavoritesOnly, favorites } = get();
    
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
      
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(item.id)) {
        return false;
      }
      
      return true;
    });
  }
}));

export default useStore;
