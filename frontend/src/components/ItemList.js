import React from 'react';
import { SimpleGrid, Text, Center } from '@mantine/core';
import useStore from '../store/useStore';
import ItemCard from './ItemCard';

function ItemList() {
  const { getFilteredItems } = useStore();
  const filteredItems = getFilteredItems();

  if (filteredItems.length === 0) {
    return (
      <Center py="xl">
        <Text size="lg" color="dimmed">
          No items found. Try adjusting your filters.
        </Text>
      </Center>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 2, xl: 2 }}
      spacing={{ base: 'md', sm: 'lg' }}
      breakpoints={[
        { minWidth: 1920, cols: 4 },
      ]}
    >
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </SimpleGrid>
  );
}

export default ItemList;
