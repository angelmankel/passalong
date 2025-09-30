# 🔧 Troubleshooting Guide

## Common Docker Issues & Solutions

### Issue: Frontend Can't Connect to Backend API
**Problem**: Frontend shows "Failed to load resource: net::ERR_CONNECTION_REFUSED" when trying to access API
**Symptoms**: 
- App loads but no items display
- Console shows: `localhost:5000/api/items:1 Failed to load resource: net::ERR_CONNECTION_REFUSED`
- Network tab shows failed requests to localhost:5000

**Solution**: ✅ **FIXED** - Added `REACT_APP_API_URL` environment variable

**Root Cause**: Frontend was trying to connect to `localhost:5000` but in Docker, the frontend and backend are in the same container.

**Fix Applied**:
```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
  - REACT_APP_API_URL=http://localhost:5000  # ← This line fixes it
```

**How It Works**:
- Frontend uses `process.env.REACT_APP_API_URL || 'http://localhost:5000'`
- Environment variable overrides the default
- Both frontend and backend run in same container
- `localhost:5000` refers to the backend server inside the container

---

### Issue: `cd: not found` Error
**Problem**: Docker container fails with "cd: not found" error
**Solution**: ✅ **FIXED** - Updated Dockerfile CMD to use proper shell syntax

**Before (Broken)**:
```dockerfile
CMD ["cd", "backend", "&&", "npm", "start"]
```

**After (Fixed)**:
```dockerfile
CMD ["sh", "-c", "cd backend && npm start"]
```

---

### Issue: Container Won't Start
**Symptoms**: Container exits immediately or fails to start
**Solutions**:

1. **Check logs**:
   ```bash
   docker-compose logs -f
   ```

2. **Rebuild from scratch**:
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

3. **Check if port is available**:
   ```bash
   netstat -tulpn | grep :5000
   ```

---

### Issue: Traefik Not Routing
**Symptoms**: App builds but not accessible via domain
**Solutions**:

1. **Check Traefik labels**:
   ```bash
   docker-compose ps
   docker inspect passalong | grep -A 20 Labels
   ```

2. **Verify network connection**:
   ```bash
   docker network ls
   docker network inspect proxy
   ```

3. **Check Traefik logs**:
   ```bash
   docker logs traefik
   ```

---

### Issue: Frontend Not Loading
**Symptoms**: Backend works but frontend shows 404
**Solutions**:

1. **Check if build completed**:
   ```bash
   docker-compose logs | grep "build"
   ```

2. **Verify public directory**:
   ```bash
   docker exec -it passalong ls -la backend/public/
   ```

3. **Rebuild frontend**:
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

---

### Issue: Items Not Loading
**Symptoms**: App loads but no items display
**Solutions**:

1. **Check items directory**:
   ```bash
   docker exec -it passalong ls -la items/
   ```

2. **Verify file permissions**:
   ```bash
   docker exec -it passalong ls -la items/item-001/
   ```

3. **Check backend logs**:
   ```bash
   docker-compose logs passalong
   ```

---

## Quick Diagnostic Commands

### Check Container Status:
```bash
docker-compose ps
```

### View All Logs:
```bash
docker-compose logs -f
```

### View Specific Service Logs:
```bash
docker-compose logs -f passalong
```

### Check Container Resources:
```bash
docker stats passalong
```

### Access Container Shell:
```bash
docker exec -it passalong sh
```

### Check Network Connectivity:
```bash
docker network inspect proxy
```

---

## Deployment Checklist

### Before Deploying:
- [ ] Domain updated in `docker-compose.yml`
- [ ] Items folder copied with images
- [ ] Docker and docker-compose installed on server
- [ ] Traefik network exists (`docker network ls | grep proxy`)

### After Deploying:
- [ ] Container is running (`docker-compose ps`)
- [ ] No error logs (`docker-compose logs`)
- [ ] Domain resolves to server
- [ ] HTTPS redirect works
- [ ] Items display correctly

---

## Emergency Reset

If everything is broken:

```bash
# Stop everything
docker-compose down

# Remove containers and images
docker-compose down --rmi all

# Clean up volumes (if needed)
docker volume prune

# Rebuild from scratch
docker-compose up --build -d
```

---

## Getting Help

### Check These First:
1. **Container logs**: `docker-compose logs -f`
2. **Container status**: `docker-compose ps`
3. **Network connectivity**: `docker network inspect proxy`
4. **File permissions**: `docker exec -it passalong ls -la`

### Common Solutions:
- **Rebuild**: `docker-compose up --build -d`
- **Restart**: `docker-compose restart`
- **Clean rebuild**: `docker-compose down && docker-compose up --build -d`
