# 🚀 PassAlong App Deployment Guide

## Quick Start (Linux Server with Traefik)

### 1. Copy Project to Server
```bash
# Copy the entire project folder to your Linux server
scp -r . user@your-server:/path/to/passalong/
```

### 2. Update Domain (Optional)
Edit `docker-compose.yml` and change the domain:
```yaml
- "traefik.http.routers.passalong.rule=Host(`store.blueoceanswim.com`)"
- "traefik.http.routers.passalong-secure.rule=Host(`store.blueoceanswim.com`)"
```

### 3. Build and Run with Docker Compose
```bash
# Navigate to project directory
cd /path/to/passalong/

# Build and start the application
docker-compose up --build -d

# Check if it's running
docker-compose ps
```

### 4. Access the Application
- **URL**: `https://store.blueoceanswim.com`
- **HTTP redirects to HTTPS** automatically via Traefik

---

## Alternative: Manual Docker Build

### 1. Build Docker Image
```bash
docker build -t passalong .
```

### 2. Run Container
```bash
docker run -d \
  --name passalong-app \
  -p 5000:5000 \
  -v $(pwd)/items:/app/items \
  passalong
```

---

## Managing the Application

### View Logs
```bash
# With docker-compose
docker-compose logs -f

# With manual docker
docker logs -f passalong-app
```

### Stop Application
```bash
# With docker-compose
docker-compose down

# With manual docker
docker stop passalong-app
docker rm passalong-app
```

### Restart Application
```bash
# With docker-compose
docker-compose restart

# With manual docker
docker restart passalong-app
```

---

## Adding Items

1. **Copy item folders** to `/path/to/passalong/items/` on your server
2. **Each item folder** should contain:
   - `item.json` (item data)
   - Image files (jpg, png, etc.)

3. **Restart the application** to load new items:
   ```bash
   docker-compose restart
   ```

---

## Production Considerations

### Firewall
```bash
# Allow port 5000 through firewall
sudo ufw allow 5000
```

### Reverse Proxy (Optional)
If you want to use a domain name, set up nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL/HTTPS (Optional)
Use Let's Encrypt with certbot for free SSL certificates.

---

## Troubleshooting

### Check if container is running
```bash
docker ps
```

### Check application logs
```bash
docker-compose logs passalong
```

### Rebuild if needed
```bash
docker-compose down
docker-compose up --build -d
```

### Check port availability
```bash
netstat -tlnp | grep 5000
```

---

## File Structure on Server
```
/path/to/passalong/
├── Dockerfile
├── docker-compose.yml
├── items/
│   ├── item-001/
│   │   ├── item.json
│   │   └── image1.jpg
│   └── item-002/
│       ├── item.json
│       └── image2.jpg
├── backend/
└── frontend/
```
