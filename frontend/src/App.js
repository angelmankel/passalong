import React, { useEffect, useCallback } from 'react';
import { Container, Title, LoadingOverlay } from '@mantine/core';
import useStore from './store/useStore';
import { itemsApi } from './services/api';
import Header from './components/Header';
import Filters from './components/Filters';
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

  useEffect(() => {
    loadFavorites();
    fetchItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container size="xl" py="md">
      <Title order={1} mb="xl" align="center">
        🏠 Yard Sale
      </Title>
      
      <Header onRefresh={fetchItems} />
      <Filters />
      
      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
          {error}
        </div>
      )}
      
      <LoadingOverlay visible={loading} />
      <ItemList />
      <ItemModal />
    </Container>
  );
}

export default App;
