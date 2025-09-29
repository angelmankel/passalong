import React, { useState } from 'react';
import {
  AppShell,
  Group,
  TextInput,
  Select,
  Button,
  Text,
  ActionIcon,
  Drawer,
  Stack,
  Switch,
  Divider,
  useMantineTheme
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconFilter, IconRefresh, IconHeart, IconMenu2 } from '@tabler/icons-react';
import useStore from '../store/useStore';
import { CATEGORIES, CONDITIONS } from '../constants';

function Header({ onRefresh }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [drawerOpened, setDrawerOpened] = useState(false);
  
  const {
    searchQuery,
    selectedCategory,
    selectedCondition,
    showFavoritesOnly,
    favorites,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCondition,
    setShowFavoritesOnly,
    clearFilters,
    getFilteredItems
  } = useStore();

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

  const FilterContent = () => (
    <Stack spacing="md">
      <TextInput
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftIcon={<IconSearch size={16} />}
        size="sm"
      />
      
      <Select
        placeholder="Category"
        value={selectedCategory}
        onChange={setSelectedCategory}
        data={[
          { value: '', label: 'All Categories' },
          ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
        ]}
        clearable
        size="sm"
      />
      
      <Select
        placeholder="Condition"
        value={selectedCondition}
        onChange={setSelectedCondition}
        data={[
          { value: '', label: 'All Conditions' },
          ...CONDITIONS.map(cond => ({ value: cond, label: cond }))
        ]}
        clearable
        size="sm"
      />
      
      <Switch
        label="Show favorites only"
        checked={showFavoritesOnly}
        onChange={(e) => setShowFavoritesOnly(e.currentTarget.checked)}
        size="sm"
      />
      
      <Divider />
      
      <Group position="apart">
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
        <Text size="sm" color="dimmed">
          {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
        </Text>
      </Group>
    </Stack>
  );

  if (isMobile) {
    return (
      <>
        <AppShell.Header px="md">
          <Group position="apart" h="100%">
            <Text size="lg" weight={600}>
              🏠 Yard Sale
            </Text>
            
            <Group spacing="xs">
              <ActionIcon
                variant="subtle"
                color={favorites.length > 0 ? 'red' : 'gray'}
                onClick={handleExportFavorites}
                disabled={favorites.length === 0}
                size="lg"
              >
                <IconHeart size={18} />
              </ActionIcon>
              
              <ActionIcon
                variant="subtle"
                onClick={() => setDrawerOpened(true)}
                size="lg"
              >
                <IconFilter size={18} />
              </ActionIcon>
              
              <ActionIcon
                variant="subtle"
                onClick={onRefresh}
                size="lg"
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>

        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          title="Filters"
          padding="md"
          size="sm"
        >
          <FilterContent />
        </Drawer>
      </>
    );
  }

  return (
    <AppShell.Header px="md">
      <Group position="apart" h="100%">
        <Text size="xl" weight={700}>
          🏠 Yard Sale
        </Text>
        
        <Group spacing="md" style={{ flex: 1, maxWidth: '100%' }}>
          <TextInput
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<IconSearch size={16} />}
            style={{ flex: 1 }}
            size="sm"
          />
          
          <Select
            placeholder="Category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={[
              { value: '', label: 'All Categories' },
              ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
            ]}
            clearable
            style={{ minWidth: 120 }}
            size="sm"
          />
          
          <Select
            placeholder="Condition"
            value={selectedCondition}
            onChange={setSelectedCondition}
            data={[
              { value: '', label: 'All Conditions' },
              ...CONDITIONS.map(cond => ({ value: cond, label: cond }))
            ]}
            clearable
            style={{ minWidth: 120 }}
            size="sm"
          />
        </Group>
        
        <Group spacing="xs">
          <Switch
            label="Favorites only"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.currentTarget.checked)}
            size="sm"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear
          </Button>
          
          <ActionIcon
            variant="subtle"
            color={favorites.length > 0 ? 'red' : 'gray'}
            onClick={handleExportFavorites}
            disabled={favorites.length === 0}
            size="lg"
          >
            <IconHeart size={18} />
          </ActionIcon>
          
          <ActionIcon
            variant="subtle"
            onClick={onRefresh}
            size="lg"
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

export default Header;
