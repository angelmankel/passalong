# 📦 Transfer Guide: Windows → Linux Server

## Method 1: SCP (Secure Copy) - Recommended

### From Windows (PowerShell/CMD):
```bash
# Copy entire project folder
scp -r C:\Users\donny\Documents\Github\yardsale user@your-server-ip:/home/user/

# Or copy specific files
scp -r . user@your-server-ip:/home/user/passalong/
```

### From Windows (Git Bash/WSL):
```bash
# Copy entire project
scp -r . user@your-server-ip:/home/user/passalong/
```

---

## Method 2: Git Clone (If you push to GitHub)

### 1. Push to GitHub from Windows:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Clone on Linux server:
```bash
git clone https://github.com/yourusername/yardsale.git
cd yardsale
```

---

## Method 3: ZIP Transfer

### 1. Create ZIP on Windows:
```powershell
# In PowerShell
Compress-Archive -Path . -DestinationPath passalong.zip
```

### 2. Transfer ZIP:
```bash
scp passalong.zip user@your-server-ip:/home/user/
```

### 3. Extract on Linux:
```bash
unzip passalong.zip
cd passalong
```

---

## Method 4: rsync (Advanced)

```bash
# Sync project to server
rsync -avz --exclude node_modules --exclude .git . user@your-server-ip:/home/user/passalong/
```

---

## After Transfer - Deploy on Linux Server

### 1. Navigate to project:
```bash
cd /home/user/passalong
```

### 2. Make deploy script executable:
```bash
chmod +x deploy.sh
```

### 3. Run deployment:
```bash
./deploy.sh
```

### 4. Or manual deployment:
```bash
docker-compose up --build -d
```

---

## Verify Deployment

### Check if running:
```bash
docker-compose ps
```

### Check logs:
```bash
docker-compose logs -f
```

### Test access:
```bash
curl http://localhost:5000
```

---

## Add Your Items

1. **Create item folders** in `/home/user/passalong/items/`:
   ```bash
   mkdir -p items/item-001
   mkdir -p items/item-002
   # etc...
   ```

2. **Add item.json files** with your data
3. **Add image files** to each item folder
4. **Restart app** to load new items:
   ```bash
   docker-compose restart
   ```

---

## Firewall Setup (Optional)

```bash
# Allow port 5000
sudo ufw allow 5000

# Or for specific IPs
sudo ufw allow from 192.168.1.0/24 to any port 5000
```
