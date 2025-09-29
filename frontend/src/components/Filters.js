import React from 'react';
import {
  Paper,
  TextInput,
  Select,
  Slider,
  Switch,
  Group,
  Stack,
  Text,
  Button,
  Grid
} from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import useStore from '../store/useStore';
import { CATEGORIES, CONDITIONS } from '../constants';

function Filters() {
  const {
    searchQuery,
    selectedCategory,
    selectedCondition,
    priceRange,
    showFavoritesOnly,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCondition,
    setPriceRange,
    setShowFavoritesOnly,
    clearFilters
  } = useStore();

  return (
    <Paper p="md" mb="md" shadow="sm">
      <Group position="apart" mb="md">
        <Text weight={500} size="lg">
          <IconFilter size={20} style={{ marginRight: 8 }} />
          Filters
        </Text>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={12} md={4}>
          <TextInput
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<IconSearch size={16} />}
          />
        </Grid.Col>

        <Grid.Col span={6} md={2}>
          <Select
            placeholder="Category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={[
              { value: '', label: 'All Categories' },
              ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
            ]}
            clearable
          />
        </Grid.Col>

        <Grid.Col span={6} md={2}>
          <Select
            placeholder="Condition"
            value={selectedCondition}
            onChange={setSelectedCondition}
            data={[
              { value: '', label: 'All Conditions' },
              ...CONDITIONS.map(cond => ({ value: cond, label: cond }))
            ]}
            clearable
          />
        </Grid.Col>

        <Grid.Col span={12} md={4}>
          <Stack spacing="xs">
            <Text size="sm" weight={500}>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Text>
            <Slider
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              marks={[
                { value: 0, label: '$0' },
                { value: 250, label: '$250' },
                { value: 500, label: '$500' },
                { value: 750, label: '$750' },
                { value: 1000, label: '$1000' }
              ]}
            />
          </Stack>
        </Grid.Col>
      </Grid>

      <Group mt="md">
        <Switch
          label="Show favorites only"
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.currentTarget.checked)}
        />
      </Group>
    </Paper>
  );
}

export default Filters;
