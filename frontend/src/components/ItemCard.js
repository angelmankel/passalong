import React from 'react';
import { Card, Image, Text, Group, Badge, Button, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconHeart, IconHeartFilled, IconEye } from '@tabler/icons-react';
import { useModals } from '@mantine/modals';
import useStore from '../store/useStore';
import { getImageUrl } from '../constants';

function ItemCard({ item }) {
  const { toggleFavorite, isFavorite } = useStore();
  const modals = useModals();
  const isMobile = useMediaQuery('(max-width: 968px)');

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
    ? getImageUrl(item.id, item.images[0])
    : null;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={openModal}>
      <Group align="flex-start" spacing="md" noWrap>
        {/* Left side - Image */}
        <div style={{ flexShrink: 0, width: isMobile ? 120 : 240, height: isMobile ? 120 : 240 }}>
          {firstImage ? (
            <Image
              src={firstImage}
              width={isMobile ? 120 : 240}
              height={isMobile ? 120 : 240}
              alt={item.name}
              fit="cover"
              radius="md"
              fallbackSrc={isMobile ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==" : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="}
            />
          ) : (
            <div style={{ 
              width: isMobile ? 120 : 240, 
              height: isMobile ? 120 : 240, 
              backgroundColor: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '8px'
            }}>
              <Text color="dimmed" size={isMobile ? "sm" : "md"}>No Image</Text>
            </div>
          )}
        </div>

        {/* Right side - Item information */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Group position="apart" mb="xs">
            <Group spacing="xs" style={{ flex: 1 }}>
              <Text weight={500} lineClamp={1}>
                {item.name}
              </Text>
              <Badge color="green" variant="light" size="sm">
                {item.condition}
              </Badge>
            </Group>
            <ActionIcon
              variant="subtle"
              color={isFavorite(item.id) ? 'red' : 'gray'}
              onClick={handleToggleFavorite}
              size="lg"
            >
              {isFavorite(item.id) ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
            </ActionIcon>
          </Group>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {item.category.map((cat) => (
              <Badge key={cat} size="xs" variant="outline">
                {cat}
              </Badge>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Text weight={900} color="blue" style={{ fontFamily: 'monospace', flexShrink: 0, textShadow: '0 1px 2px rgba(0,0,0,0.1)', fontSize: '28px', lineHeight: '1.2' }}>
              ${item.price}
            </Text>
            <Text size="sm" color="dimmed" lineClamp={2} style={{ flex: 1 }}>
              {item.description}
            </Text>
          </div>
        </div>
      </Group>
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
            {item.images.map((image, index) => {
              const imageUrl = getImageUrl(item.id, image);
              return (
                <Image
                  key={index}
                  src={imageUrl}
                  alt={`${item.name} - Image ${index + 1}`}
                  radius="md"
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open(imageUrl, '_blank')}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
