import React, { useEffect, useCallback } from 'react';
import { AppShell, LoadingOverlay } from '@mantine/core';
import useStore from './store/useStore';
import { itemsApi } from './services/api';
import Header from './components/Header';
import ItemList from './components/ItemList';
import ItemModal from './components/ItemModal';

function App() {
  const { 
    loading, 
    error, 
    setItems, 
    setLoading, 
    setError,
    loadFavorites 
  } = useStore();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemsApi.getAll();
      setItems(response.data);
    } catch (err) {
      setError('Failed to load items. Please try again.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setItems]);

  const refreshItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // First call the refresh endpoint to reload items on the server
      await itemsApi.refresh();
      // Then fetch the updated items
      const response = await itemsApi.getAll();
      setItems(response.data);
    } catch (err) {
      setError('Failed to refresh items. Please try again.');
      console.error('Error refreshing items:', err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setItems]);

  useEffect(() => {
    loadFavorites();
    fetchItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell
      header={{ height: { base: 100, sm: 80 } }}
      padding="md"
    >
      <Header onRefresh={refreshItems} />
      
      <AppShell.Main style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
        {error && (
          <div style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
            {error}
          </div>
        )}
        
        <LoadingOverlay visible={loading} />
        <ItemList />
        <ItemModal />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
