import React from 'react';
import { Card, Image, Text, Group, Badge, Button, ActionIcon } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconEye } from '@tabler/icons-react';
import { useModals } from '@mantine/modals';
import useStore from '../store/useStore';

function ItemCard({ item }) {
  const { toggleFavorite, isFavorite } = useStore();
  const modals = useModals();

  const openModal = () => {
    modals.openModal({
      title: item.name,
      children: <ItemModalContent item={item} />,
      size: 'xl',
      centered: true
    });
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  const firstImage = item.images && item.images.length > 0 
    ? `/api/images/${item.id}/${item.images[0]}` 
    : null;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={openModal}>
      <Card.Section>
        {firstImage ? (
          <Image
            src={firstImage}
            height={200}
            alt={item.name}
            fit="cover"
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
          />
        ) : (
          <div style={{ height: 200, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text color="dimmed">No Image</Text>
          </div>
        )}
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500} lineClamp={2}>
          {item.name}
        </Text>
        <ActionIcon
          variant="subtle"
          color={isFavorite(item.id) ? 'red' : 'gray'}
          onClick={handleToggleFavorite}
        >
          {isFavorite(item.id) ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
        </ActionIcon>
      </Group>

      <Text size="sm" color="dimmed" lineClamp={2} mb="sm">
        {item.description}
      </Text>

      <Group position="apart" mb="sm">
        <Text size="xl" weight={700} color="blue">
          ${item.price}
        </Text>
        <Badge color="green" variant="light">
          {item.condition}
        </Badge>
      </Group>

      <Group spacing="xs" mb="sm">
        {item.category.map((cat) => (
          <Badge key={cat} size="sm" variant="outline">
            {cat}
          </Badge>
        ))}
      </Group>

      <Button
        fullWidth
        leftIcon={<IconEye size={16} />}
        variant="light"
        onClick={openModal}
      >
        View Details
      </Button>
    </Card>
  );
}

// Modal content component
function ItemModalContent({ item }) {
  const { toggleFavorite, isFavorite } = useStore();

  const handleToggleFavorite = () => {
    toggleFavorite(item.id);
  };

  return (
    <div>
      <Group position="apart" mb="md">
        <Text size="xl" weight={700}>
          {item.name}
        </Text>
        <Button
          leftIcon={isFavorite(item.id) ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
          color={isFavorite(item.id) ? 'red' : 'gray'}
          variant={isFavorite(item.id) ? 'filled' : 'outline'}
          onClick={handleToggleFavorite}
        >
          {isFavorite(item.id) ? 'Favorited' : 'Add to Favorites'}
        </Button>
      </Group>

      <Text size="lg" color="blue" weight={600} mb="md">
        ${item.price}
      </Text>

      <Text mb="md">
        {item.description}
      </Text>

      <Group mb="md">
        <Badge size="lg" color="green">
          {item.condition}
        </Badge>
        {item.category.map((cat) => (
          <Badge key={cat} size="lg" variant="outline">
            {cat}
          </Badge>
        ))}
      </Group>

      {item.link && (
        <Button
          component="a"
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          mb="md"
        >
          Contact Seller
        </Button>
      )}

      {item.images && item.images.length > 0 && (
        <div>
          <Text weight={500} mb="sm">
            Images ({item.images.length})
          </Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {item.images.map((image, index) => (
              <Image
                key={index}
                src={`/api/images/${item.id}/${image}`}
                alt={`${item.name} - Image ${index + 1}`}
                radius="md"
                style={{ cursor: 'pointer' }}
                onClick={() => window.open(`/api/images/${item.id}/${image}`, '_blank')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
