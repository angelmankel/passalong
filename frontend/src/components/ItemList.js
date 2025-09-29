import React from 'react';
import { SimpleGrid, Text, Center, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import useStore from '../store/useStore';
import ItemCard from './ItemCard';

function ItemList() {
  const { getFilteredItems } = useStore();
  const filteredItems = getFilteredItems();
  const isMobile = useMediaQuery('(max-width: 968px)');

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
      cols={isMobile ? 1 : 2}
      spacing={isMobile ? 'md' : 'lg'}
    >
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </SimpleGrid>
  );
}

export default ItemList;
