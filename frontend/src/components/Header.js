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
  Tooltip,
  Modal,
  Checkbox,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconSearch, IconFilter, IconRefresh, IconHeart, IconTrash } from '@tabler/icons-react';
import useStore from '../store/useStore';
import { CATEGORIES, CONDITIONS } from '../constants';

function Header({ onRefresh }) {
  const isMobile = useMediaQuery('(max-width: 968px)');
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [confirmClearOpened, setConfirmClearOpened] = useState(false);
  const [neverAskAgain, setNeverAskAgain] = useState(false);
  
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
    getFilteredItems,
    clearFavorites
  } = useStore();

  const handleClearFavorites = () => {
    if (favorites.length === 0) {
      notifications.show({
        title: 'No favorites',
        message: 'No favorites to clear',
        color: 'orange',
        autoClose: 2000,
      });
      return;
    }
    
    // Check if user has set "never ask again" preference
    const skipConfirmation = localStorage.getItem('skipClearFavoritesConfirmation') === 'true';
    
    if (skipConfirmation) {
      performClearFavorites();
    } else {
      setConfirmClearOpened(true);
    }
  };

  const performClearFavorites = () => {
    clearFavorites();
    notifications.show({
      title: 'Favorites cleared',
      message: 'All favorites have been removed',
      color: 'blue',
      autoClose: 2000,
    });
    setConfirmClearOpened(false);
  };

  const handleConfirmClear = () => {
    if (neverAskAgain) {
      localStorage.setItem('skipClearFavoritesConfirmation', 'true');
    }
    performClearFavorites();
  };

  const handleExportFavorites = () => {
    const filteredItems = getFilteredItems();
    const favoriteItems = filteredItems.filter(item => favorites.includes(item.id));
    
    if (favoriteItems.length === 0) {
      notifications.show({
        title: 'No favorites',
        message: 'No favorite items to export!',
        color: 'orange',
        autoClose: 3000,
      });
      return;
    }

    const exportText = favoriteItems.map(item => 
      `• ${item.name} - $${item.price} (${item.condition})`
    ).join('\n');

    const fullText = `My Favorite Items:\n\n${exportText}\n\nContact me for more details!`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      notifications.show({
        title: 'Success',
        message: 'Favorites formatted and copied to clipboard',
        color: 'green',
        autoClose: 2000,
      });
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
                <Tooltip label="Refresh data">
                  <ActionIcon
                    variant="subtle"
                    onClick={onRefresh}
                    size="lg"
                  >
                    <IconRefresh size={18} />
                  </ActionIcon>
                </Tooltip>
                
                <Tooltip label="Copy favorites to clipboard">
                  <ActionIcon
                    variant="subtle"
                    color={favorites.length > 0 ? 'red' : 'gray'}
                    onClick={handleExportFavorites}
                    disabled={favorites.length === 0}
                    size="lg"
                  >
                    <IconHeart size={18} />
                  </ActionIcon>
                </Tooltip>
                
                <ActionIcon
                  variant="subtle"
                  onClick={() => setDrawerOpened(true)}
                  size="lg"
                >
                  <IconFilter size={18} />
                </ActionIcon>
              </Group>
              
              <Tooltip label="Clear all favorites">
                <ActionIcon
                  variant="subtle"
                  color={favorites.length > 0 ? 'red' : 'gray'}
                  onClick={handleClearFavorites}
                  disabled={favorites.length === 0}
                  size="lg"
                  style={{ 
                    marginLeft: '16px',
                    color: favorites.length > 0 ? '#d32f2f' : undefined
                  }}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
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
          <Group spacing="md">
            <img 
              src="/package.png" 
              alt="PassAlong" 
              style={{ height: '40px', width: 'auto' }}
            />
            
            <Tooltip label="Refresh data">
              <ActionIcon
                variant="subtle"
                onClick={onRefresh}
                size="lg"
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        
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
          
          <Tooltip label="Copy favorites to clipboard">
            <ActionIcon
              variant="subtle"
              color={favorites.length > 0 ? 'red' : 'gray'}
              onClick={handleExportFavorites}
              disabled={favorites.length === 0}
              size="lg"
            >
              <IconHeart size={18} />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip label="Clear all favorites">
            <ActionIcon
              variant="subtle"
              color={favorites.length > 0 ? 'red' : 'gray'}
              onClick={handleClearFavorites}
              disabled={favorites.length === 0}
              size="lg"
              style={{ 
                marginLeft: '16px',
                color: favorites.length > 0 ? '#d32f2f' : undefined
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      
      {/* Confirmation Modal */}
      <Modal
        opened={confirmClearOpened}
        onClose={() => setConfirmClearOpened(false)}
        title="Clear All Favorites"
        centered
      >
        <Stack spacing="md">
          <Text>
            Are you sure you want to clear all {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}? 
            This action cannot be undone.
          </Text>
          
          <Checkbox
            label="Don't ask me again"
            checked={neverAskAgain}
            onChange={(e) => setNeverAskAgain(e.currentTarget.checked)}
          />
          
          <Group position="right" spacing="sm">
            <Button
              variant="outline"
              onClick={() => setConfirmClearOpened(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleConfirmClear}
            >
              Clear All Favorites
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppShell.Header>
  );
}

export default Header;
