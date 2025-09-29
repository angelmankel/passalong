import React from 'react';
import {
  Paper,
  TextInput,
  Select,
  Switch,
  Group,
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
    showFavoritesOnly,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCondition,
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
