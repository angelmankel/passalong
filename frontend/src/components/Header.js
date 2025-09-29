import React from 'react';
import { Group, Button, Text } from '@mantine/core';
import { IconRefresh, IconHeart } from '@tabler/icons-react';
import useStore from '../store/useStore';

function Header({ onRefresh }) {
  const { favorites, getFilteredItems } = useStore();

  const handleExportFavorites = () => {
    const filteredItems = getFilteredItems();
    const favoriteItems = filteredItems.filter(item => favorites.includes(item.id));
    
    if (favoriteItems.length === 0) {
      alert('No favorite items to export!');
      return;
    }

    const exportText = favoriteItems.map(item => 
      `• ${item.name} - $${item.price} (${item.condition})`
    ).join('\n');

    const fullText = `My Favorite Items:\n\n${exportText}\n\nContact me for more details!`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      alert('Favorites copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Favorites copied to clipboard!');
    });
  };

  return (
    <Group position="apart" mb="md">
      <Text size="lg" weight={500}>
        {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
      </Text>
      
      <Group>
        <Button
          leftIcon={<IconHeart size={16} />}
          variant="outline"
          onClick={handleExportFavorites}
          disabled={favorites.length === 0}
        >
          Export Favorites
        </Button>
        
        <Button
          leftIcon={<IconRefresh size={16} />}
          onClick={onRefresh}
        >
          Refresh Items
        </Button>
      </Group>
    </Group>
  );
}

export default Header;
