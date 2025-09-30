import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import { IconHeart, IconHeartFilled, IconExternalLink } from '@tabler/icons-react';
import { useModals } from '@mantine/modals';
import useStore from '../store/useStore';
import { getImageUrl } from '../constants';

// Fullscreen Image Modal Component
function FullscreenImageModal({ item, startIndex }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(startIndex);
  const modals = useModals();
  const isMobile = useMediaQuery('(max-width: 968px)');
  
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
    // Close only the topmost modal (the fullscreen one)
    const modalStack = modals.modals;
    if (modalStack.length > 1) {
      // Close only the last modal (fullscreen)
      modals.closeModal(modalStack[modalStack.length - 1].id);
    } else {
      modals.closeAll();
    }
  };
  
  const currentImageUrl = getImageUrl(item.id, item.images[currentImageIndex]);
  
  return (
    <div 
      style={{ 
        height: '100dvh', // Use dynamic viewport height for iOS Safari
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
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
          top: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '20px',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: isMobile ? '44px' : '40px',
          height: isMobile ? '44px' : '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '24px' : '20px',
          lineHeight: '40px',
          fontWeight: 'normal',
          padding: '0',
          margin: '0',
          textAlign: 'center',
          touchAction: 'manipulation' // Prevent double-tap zoom on mobile
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
  const isMobile = window.innerWidth <= 968;
  

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

  // Touch events for mobile with optimized pinch-to-zoom
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const animationFrameRef = useRef(null);

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && scale > 1) {
      // Single touch - dragging
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    } else if (e.touches.length === 2) {
      // Two touches - pinch to zoom
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
      setIsPinching(true);
    }
  }, [scale, position]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging && scale > 1) {
      // Single touch - dragging
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && isPinching) {
      // Two touches - pinch to zoom (optimized with requestAnimationFrame)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        const distance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);
        
        if (lastTouchDistance > 0) {
          const scaleChange = distance / lastTouchDistance;
          const newScale = Math.max(0.5, Math.min(3, scale * scaleChange));
          
          // Calculate new position to keep the pinch center in place
          const scaleRatio = newScale / scale;
          const centerOffset = {
            x: center.x - lastTouchCenter.x,
            y: center.y - lastTouchCenter.y
          };
          
          setScale(newScale);
          setPosition({
            x: position.x * scaleRatio + centerOffset.x * (1 - scaleRatio),
            y: position.y * scaleRatio + centerOffset.y * (1 - scaleRatio)
          });
        }
        
        setLastTouchDistance(distance);
        setLastTouchCenter(center);
      });
    }
  }, [isDragging, scale, dragStart, lastTouchDistance, lastTouchCenter, position, isPinching]);

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPinching(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scale, isDragging, position, dragStart, handleTouchMove, handleTouchStart]);

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
        height: '100dvh', // Use dynamic viewport height for iOS Safari
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
          transition: (isDragging || isPinching) ? 'none' : 'transform 0.1s ease-out',
          userSelect: 'none',
          pointerEvents: 'none',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          willChange: (isDragging || isPinching) ? 'transform' : 'auto' // Optimize for hardware acceleration
        }}
        draggable={false}
      />
       {/* Desktop Navigation buttons - side buttons */}
       {!isMobile && hasPrevious && (
         <button
           onClick={onPrevious}
           style={{
             position: 'absolute',
             left: '20px',
             top: '50%',
             transform: 'translateY(-50%)',
             background: 'rgba(0,0,0,0.5)',
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
             justifyContent: 'center',
             transition: 'all 0.2s ease',
             opacity: '0.5'
           }}
           onMouseEnter={(e) => {
             e.target.style.opacity = '1.0';
             e.target.style.background = 'rgba(0,0,0,0.7)';
           }}
           onMouseLeave={(e) => {
             e.target.style.opacity = '0.5';
             e.target.style.background = 'rgba(0,0,0,0.5)';
           }}
         >
           ◀
         </button>
       )}
       
       {!isMobile && hasNext && (
         <button
           onClick={onNext}
           style={{
             position: 'absolute',
             right: '20px',
             top: '50%',
             transform: 'translateY(-50%)',
             background: 'rgba(0,0,0,0.5)',
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
             justifyContent: 'center',
             transition: 'all 0.2s ease',
             opacity: '0.5'
           }}
           onMouseEnter={(e) => {
             e.target.style.opacity = '1.0';
             e.target.style.background = 'rgba(0,0,0,0.7)';
           }}
           onMouseLeave={(e) => {
             e.target.style.opacity = '0.5';
             e.target.style.background = 'rgba(0,0,0,0.5)';
           }}
         >
           ▶
         </button>
       )}

       {/* Mobile Navigation buttons - bottom buttons */}
       {isMobile && (
         <div style={{
           position: 'absolute',
           bottom: '20px',
           left: '50%',
           transform: 'translateX(-50%)',
           display: 'flex',
           gap: '15px',
           zIndex: 1000,
           pointerEvents: 'auto'
         }}>
           <button
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               if (hasPrevious) {
                 onPrevious();
               }
             }}
             onTouchStart={(e) => {
               e.preventDefault();
               e.stopPropagation();
             }}
             onTouchEnd={(e) => {
               e.preventDefault();
               e.stopPropagation();
               if (hasPrevious) {
                 onPrevious();
               }
             }}
             disabled={!hasPrevious}
             style={{
               background: hasPrevious ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
               color: hasPrevious ? 'white' : 'rgba(255,255,255,0.5)',
               border: 'none',
               borderRadius: '25px',
               padding: '12px 20px',
               cursor: hasPrevious ? 'pointer' : 'not-allowed',
               fontSize: '16px',
               fontWeight: 'bold',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '5px',
               pointerEvents: hasPrevious ? 'auto' : 'none',
               zIndex: 1001,
               position: 'relative',
               width: '140px',
               height: '50px',
               flexShrink: 0,
               opacity: hasPrevious ? 1 : 0.5
             }}
           >
             ◀ Previous
           </button>
           <button
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               if (hasNext) {
                 onNext();
               }
             }}
             onTouchStart={(e) => {
               e.preventDefault();
               e.stopPropagation();
             }}
             onTouchEnd={(e) => {
               e.preventDefault();
               e.stopPropagation();
               if (hasNext) {
                 onNext();
               }
             }}
             disabled={!hasNext}
             style={{
               background: hasNext ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
               color: hasNext ? 'white' : 'rgba(255,255,255,0.5)',
               border: 'none',
               borderRadius: '25px',
               padding: '12px 20px',
               cursor: hasNext ? 'pointer' : 'not-allowed',
               fontSize: '16px',
               fontWeight: 'bold',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '5px',
               pointerEvents: hasNext ? 'auto' : 'none',
               zIndex: 1001,
               position: 'relative',
               width: '140px',
               height: '50px',
               flexShrink: 0,
               opacity: hasNext ? 1 : 0.5
             }}
           >
             Next ▶
           </button>
         </div>
       )}

      {scale > 1 && (
        <button
          onClick={resetZoom}
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 10,
            transition: 'all 0.2s ease',
            opacity: '0.5'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '1.0';
            e.target.style.background = 'rgba(0,0,0,0.7)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '0.5';
            e.target.style.background = 'rgba(0,0,0,0.5)';
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
      size: '90%',
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
            <Tooltip label={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}>
              <ActionIcon
                variant="subtle"
                color={isFavorite(item.id) ? 'red' : 'gray'}
                onClick={handleToggleFavorite}
                size="lg"
              >
                {isFavorite(item.id) ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
              </ActionIcon>
            </Tooltip>
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
              {item.price === 0 ? 'FREE' : `$${item.price}`}
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
              leftSection={<IconExternalLink size={16} />}
              variant="outline"
            >
              View Link
            </Button>
          )}
          <Button
            leftSection={isFavorite(item.id) ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
            color={isFavorite(item.id) ? 'red' : 'gray'}
            variant={isFavorite(item.id) ? 'filled' : 'outline'}
            onClick={handleToggleFavorite}
          >
            {isFavorite(item.id) ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </Group>
      </Group>

      <Text weight={900} color="blue" style={{ fontFamily: 'monospace', textShadow: '0 1px 2px rgba(0,0,0,0.1)', fontSize: '28px', lineHeight: '1.2' }} mb="md">
        {item.price === 0 ? 'FREE' : `$${item.price}`}
      </Text>

      <Text mb="md">
        {item.description}
      </Text>

      <Group mb="md" spacing="xs">
        <Text size="sm" weight={500} color="dimmed">
          Condition:
        </Text>
        <Badge size="lg" color="green">
          {item.condition}
        </Badge>
      </Group>

      <Group mb="md" gap="xs">
        <Text size="sm" weight={500} color="dimmed">
          Categories:
        </Text>
        {item.category.map((cat) => (
          <Badge key={cat} size="lg" variant="outline">
            {cat}
          </Badge>
        ))}
      </Group>

      {item.images && item.images.length > 0 && (
        <div style={{ 
          backgroundColor: '#2a2a2a', 
          borderRadius: '8px', 
          padding: '12px',
          marginBottom: '16px'
        }}>
          <Carousel
            withIndicators
            height={300}
            slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
            breakpoints={[
              { maxWidth: 'sm', slideSize: '100%', slideGap: 0 },
              { maxWidth: 'md', slideSize: '50%', slideGap: 'md' },
              { slideSize: '33.333333%', slideGap: 'md' }
            ]}
            slideGap={{ base: 0, sm: 'md' }}
            loop
            align="start"
            containScroll="trimSnaps"
            styles={{
              viewport: {
                borderRadius: '6px'
              },
              container: {
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              },
              slide: {
                flexShrink: 0
              },
              indicators: {
                bottom: '8px'
              }
            }}
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
                    radius="sm"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      modals.openModal({
                        title: '',
                        children: <FullscreenImageModal item={item} startIndex={index} />,
                        size: '100%',
                        centered: true,
                        withCloseButton: false,
                        styles: {
                          content: { 
                            height: '100dvh', // Use dynamic viewport height for iOS Safari
                            maxHeight: '100dvh',
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
                            height: '100dvh', // Use dynamic viewport height for iOS Safari
                            width: '100vw',
                            margin: 0,
                            padding: 0,
                            overflow: 'hidden'
                          },
                          header: {
                            display: 'none'
                          }
                        }
                      });
                    }}
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
