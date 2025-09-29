# PassAlong App

A simple React frontend and Node.js backend for managing and displaying items to pass along.

## Features

- **Item Management**: Add items by creating JSON files in the `/items` directory
- **Image Support**: Automatic image discovery and serving
- **Search & Filter**: Search by name, description, category with advanced filtering
- **Favorites**: Save favorite items locally with export functionality
- **Responsive Design**: Works on mobile and desktop
- **Dark Theme**: Modern dark UI with Mantine components

## Quick Start

### Development

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start both frontend and backend**:
   ```bash
   npm run dev
   ```
   
   Or start them separately:
   ```bash
   npm run backend:dev    # Backend with auto-reload
   npm run frontend:dev   # Frontend with hot-reload
   ```

3. **Add Items**: Create folders in `/items` directory with `item.json` files

### Production (Docker)

1. **Build and run with Docker**:
   ```bash
   npm run docker:up
   ```

2. **Or build Docker image manually**:
   ```bash
   npm run docker:build
   npm run docker:run
   ```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start both frontend and backend in production mode
- `npm run backend:dev` - Start only backend with auto-reload
- `npm run frontend:dev` - Start only frontend with hot-reload
- `npm run install:all` - Install all dependencies for both frontend and backend
- `npm run build` - Build frontend for production
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:up` - Build and run with docker-compose

## Adding Items

Create a folder in `/items` with the following structure:

```
items/
  item-001/
    item.json
    image1.jpg
    image2.png
  item-002/
    item.json
    photo.jpg
```

### Item JSON Format

```json
{
  "id": "item-001",
  "name": "Vintage Coffee Table",
  "description": "Beautiful wooden coffee table with glass top...",
  "price": 150.00,
  "category": ["Furniture", "Home Decor"],
  "link": "https://example.com/contact",
  "condition": "Good"
}
```

### Supported Image Formats
- PNG (.png)
- JPEG (.jpg, .jpeg)
- HEIC (.heic)

## API Endpoints

- `GET /api/items` - Get all items
- `POST /api/refresh` - Refresh items cache
- `GET /api/images/{itemId}/{filename}` - Serve item images

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)
- `PORT` - Server port (default: 5000)

## Tech Stack

### Frontend
- React 18
- Mantine UI
- Zustand (state management)
- LocalForage (local storage)
- Axios (HTTP client)

### Backend
- Node.js
- Express
- fs-extra (file operations)

### Deployment
- Docker
- Alpine Linux base image
