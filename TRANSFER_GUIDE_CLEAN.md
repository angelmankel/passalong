# 📦 Clean Transfer Guide: Windows → Linux Server

## Method 1: SCP with Exclusions (Recommended)

### From Windows (PowerShell):
```powershell
# Copy project excluding node_modules and build folders
scp -r -o "Exclude=node_modules,build,.git" . user@your-server:/home/user/passalong/
```

### From Windows (Git Bash/WSL):
```bash
# Create a clean copy first
rsync -avz --exclude node_modules --exclude build --exclude .git . user@your-server:/home/user/passalong/
```

---

## Method 2: ZIP with Exclusions

### 1. Create clean ZIP on Windows:
```powershell
# PowerShell - exclude node_modules and build
Compress-Archive -Path . -DestinationPath passalong-clean.zip -Exclude @('node_modules', 'build', '.git')
```

### 2. Transfer and extract:
```bash
# Transfer
scp passalong-clean.zip user@your-server:/home/user/

# Extract on server
unzip passalong-clean.zip
cd passalong
```

---

## Method 3: Git Clone (Best Option)

### 1. Push to GitHub from Windows:
```bash
# Add .gitignore to exclude node_modules
echo "node_modules/" >> .gitignore
echo "build/" >> .gitignore
echo ".env" >> .gitignore

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

## What Gets Copied (Clean):

### ✅ Source Code:
- `frontend/src/` - React source code
- `backend/src/` - Node.js source code
- `items/` - Your item data and images

### ✅ Configuration Files:
- `package.json` (root, frontend, backend)
- `Dockerfile`
- `docker-compose.yml`
- `deploy.sh`
- All other config files

### ✅ Documentation:
- `DEPLOYMENT.md`
- `TRANSFER_GUIDE.md`
- `README.md`

### ❌ What's Excluded:
- `node_modules/` - Will be installed by Docker
- `build/` - Will be built by Docker
- `.git/` - Version control (unless using git clone)
- `.env` - Environment files (if any)

---

## After Transfer - Deploy:

### 1. Navigate to project:
```bash
cd /home/user/passalong
```

### 2. Deploy with Docker:
```bash
# Docker will handle all dependencies
docker-compose up --build -d
```

### 3. Verify:
```bash
# Check if running
docker-compose ps

# Check logs
docker-compose logs -f
```

---

## Benefits of Clean Transfer:

### 🚀 Faster Transfer:
- **Without node_modules**: ~50MB
- **With node_modules**: ~500MB+ (10x larger!)

### 🔧 Better Builds:
- **Fresh dependencies** - No platform conflicts
- **Docker caching** - Better layer optimization
- **Clean environment** - Production-ready builds

### 📦 Smaller Footprint:
- **Less storage** - Cleaner server
- **Faster sync** - Quicker deployments
- **Version control** - Only source code tracked

---

## Docker Will Handle:
- ✅ **Install dependencies** - `npm install` in container
- ✅ **Build frontend** - `npm run build` in container
- ✅ **Optimize images** - Production builds
- ✅ **Platform compatibility** - Linux-optimized packages
