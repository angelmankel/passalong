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
  const isMobile = useMediaQuery('(max-width: 968px)');
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
      <Text size="sm" color="dimmed" weight={500}>
        Filter by Category
      </Text>
      <Select
        placeholder="All Categories"
        value={selectedCategory}
        onChange={setSelectedCategory}
        data={[
          { value: '', label: 'All Categories' },
          ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
        ]}
        clearable
        size="md"
      />
      
      <Text size="sm" color="dimmed" weight={500}>
        Filter by Condition
      </Text>
      <Select
        placeholder="All Conditions"
        value={selectedCondition}
        onChange={setSelectedCondition}
        data={[
          { value: '', label: 'All Conditions' },
          ...CONDITIONS.map(cond => ({ value: cond, label: cond }))
        ]}
        clearable
        size="md"
      />
      
      <Divider />
      
      <Switch
        label="Show favorites only"
        checked={showFavoritesOnly}
        onChange={(e) => setShowFavoritesOnly(e.currentTarget.checked)}
        size="md"
      />
      
      <Divider />
      
      <Group position="apart">
        <Button variant="outline" size="md" onClick={clearFilters} fullWidth>
          Clear All Filters
        </Button>
      </Group>
      
      <Text size="sm" color="dimmed" align="center">
        {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
      </Text>
    </Stack>
  );

  if (isMobile) {
    return (
      <>
        <AppShell.Header px="md" py="xs">
          <Stack spacing="xs" style={{ height: '100%' }}>
            {/* Top row: Title and action icons */}
              <Group position="apart">
                <img 
                  src="/package.png" 
                  alt="PassAlong" 
                  style={{ height: '32px', width: 'auto' }}
                />
              
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
            
            {/* Bottom row: Search input */}
            <TextInput
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<IconSearch size={14} />}
              size="xs"
              style={{ width: '100%' }}
            />
          </Stack>
        </AppShell.Header>

        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          title="Filters & Options"
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
          <img 
            src="/package.png" 
            alt="PassAlong" 
            style={{ height: '40px', width: 'auto' }}
          />
        
        <Group spacing="md" style={{ flex: 1, maxWidth: '100%' }}>
          <TextInput
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<IconSearch size={16} />}
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
