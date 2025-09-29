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
      cols={1}
      spacing="md"
      breakpoints={[
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        { minWidth: 'sm', cols: 2, spacing: 'md' },
        { minWidth: 'md', cols: 3, spacing: 'md' },
        { minWidth: 'lg', cols: 4, spacing: 'lg' }
      ]}
    >
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </SimpleGrid>
  );
}

export default ItemList;
