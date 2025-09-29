# Yard Sale App

A simple React frontend and Node.js backend for managing and displaying items for sale.

## Features

- **Item Management**: Add items by creating JSON files in the `/items` directory
- **Image Support**: Automatic image discovery and serving
- **Search & Filter**: Search by name, description, category with advanced filtering
- **Favorites**: Save favorite items locally with export functionality
- **Responsive Design**: Works on mobile and desktop
- **Dark Theme**: Modern dark UI with Mantine components

## Quick Start

### Development

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup** (in another terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Add Items**: Create folders in `/items` directory with `item.json` files

### Production (Docker)

1. **Build and run with Docker**:
   ```bash
   docker-compose up --build
   ```

2. **Or build Docker image manually**:
   ```bash
   docker build -t yardsale .
   docker run -p 3000:3000 yardsale
   ```

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

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:3000)
- `PORT` - Server port (default: 3000)

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
