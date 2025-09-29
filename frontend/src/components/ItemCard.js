import React, { useState, useRef, useEffect } from 'react';
import { Card, Image, Text, Group, Badge, Button, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import { IconHeart, IconHeartFilled, IconEye, IconExternalLink, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useModals } from '@mantine/modals';
import useStore from '../store/useStore';
import { getImageUrl } from '../constants';

// Fullscreen Image Modal Component
function FullscreenImageModal({ item, startIndex }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(startIndex);
  const modals = useModals();
  
  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentImageIndex < item.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const closeModal = () => {
    modals.closeAll();
  };
  
  const currentImageUrl = getImageUrl(item.id, item.images[currentImageIndex]);
  
  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      onClick={(e) => {
        // Only close if clicking the background div itself, not child elements
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      {/* Close Button */}
      <button
        onClick={closeModal}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          lineHeight: '40px',
          fontWeight: 'normal',
          padding: '0',
          margin: '0',
          textAlign: 'center'
        }}
      >
        ✕
      </button>
      
      <div style={{ position: 'relative' }}>
        <ZoomableImage
          src={currentImageUrl}
          alt={`${item.name} - Image ${currentImageIndex + 1}`}
          style={{ 
            maxWidth: '100vw', 
            maxHeight: '100vh', 
            width: 'auto',
            height: 'auto',
            objectFit: 'contain' 
          }}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={currentImageIndex > 0}
          hasNext={currentImageIndex < item.images.length - 1}
        />
      </div>
    </div>
  );
}

// Zoomable Image Component
function ZoomableImage({ src, alt, style, onPrevious, onNext, hasPrevious, hasNext }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isDragging && scale > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Auto-reset when zoom goes below 1:1
  useEffect(() => {
    if (scale < 1) {
      resetZoom();
    }
  }, [scale]);

  // Add passive: false to touch and wheel events
  useEffect(() => {
    const container = imageRef.current?.parentElement;
    if (!container) return;

    const handleTouchStartPassive = (e) => {
      e.preventDefault();
      handleTouchStart(e);
    };

    const handleTouchMovePassive = (e) => {
      e.preventDefault();
      handleTouchMove(e);
    };

    const handleTouchEndPassive = (e) => {
      e.preventDefault();
      handleTouchEnd(e);
    };

    const handleWheelPassive = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    container.addEventListener('touchstart', handleTouchStartPassive, { passive: false });
    container.addEventListener('touchmove', handleTouchMovePassive, { passive: false });
    container.addEventListener('touchend', handleTouchEndPassive, { passive: false });
    container.addEventListener('wheel', handleWheelPassive, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStartPassive);
      container.removeEventListener('touchmove', handleTouchMovePassive);
      container.removeEventListener('touchend', handleTouchEndPassive);
      container.removeEventListener('wheel', handleWheelPassive);
    };
  }, [scale, isDragging, position, dragStart]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && hasPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onPrevious, onNext, hasPrevious, hasNext]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          ...style,
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          userSelect: 'none',
          pointerEvents: 'none',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
        draggable={false}
      />
      {/* Navigation buttons */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '0',
            margin: '0',
            lineHeight: '1',
            textAlign: 'center',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ◀
        </button>
      )}
      
      {hasNext && (
        <button
          onClick={onNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '0',
            margin: '0',
            lineHeight: '1',
            textAlign: 'center',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ▶
        </button>
      )}

      {scale > 1 && (
        <button
          onClick={resetZoom}
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 10
          }}
        >
          Reset Zoom
        </button>
      )}
    </div>
  );
}

function ItemCard({ item }) {
  const { toggleFavorite, isFavorite } = useStore();
  const modals = useModals();
  const isMobile = useMediaQuery('(max-width: 968px)');

  const openModal = () => {
    modals.openModal({
      title: item.name,
      children: <ItemModalContent item={item} modals={modals} />,
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
      <Group align="flex-start" spacing="md" wrap="nowrap">
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
function ItemModalContent({ item, modals }) {
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
        <Group spacing="sm">
          {item.link && (
            <Button
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<IconExternalLink size={16} />}
              variant="outline"
            >
              View Link
            </Button>
          )}
          <Button
            leftIcon={isFavorite(item.id) ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
            color={isFavorite(item.id) ? 'red' : 'gray'}
            variant={isFavorite(item.id) ? 'filled' : 'outline'}
            onClick={handleToggleFavorite}
          >
            {isFavorite(item.id) ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
          </Button>
        </Group>
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

      {item.images && item.images.length > 0 && (
        <div>
          <Text weight={500} mb="sm">
            Images ({item.images.length})
          </Text>
          <Carousel
            withIndicators
            height={300}
            slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
            slideGap={{ base: 0, sm: 'md' }}
            emblaOptions={{ loop: true, align: 'start' }}
          >
            {item.images.map((image, index) => {
              const imageUrl = getImageUrl(item.id, image);
              return (
                <Carousel.Slide key={index}>
                  <Image
                    src={imageUrl}
                    alt={`${item.name} - Image ${index + 1}`}
                    height={300}
                    fit="contain"
                    radius="md"
                    style={{ cursor: 'pointer' }}
                    onClick={() => modals.openModal({
                      title: '',
                      children: <FullscreenImageModal item={item} startIndex={index} />,
                      size: '100%',
                      centered: true,
                      withCloseButton: false,
                      styles: {
                        content: { 
                          height: '100vh', 
                          maxHeight: '100vh',
                          width: '100vw',
                          maxWidth: '100vw',
                          margin: 0,
                          padding: 0,
                          overflow: 'hidden',
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0
                        },
                        body: { 
                          height: '100vh', 
                          width: '100vw',
                          margin: 0,
                          padding: 0,
                          overflow: 'hidden'
                        },
                        header: {
                          display: 'none'
                        }
                      }
                    })}
                  />
                </Carousel.Slide>
              );
            })}
          </Carousel>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
