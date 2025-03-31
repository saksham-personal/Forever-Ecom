#!/bin/bash

# Deployment script for Forever Full Stack application on EC2
# This script should be run on the EC2 instance

# Exit on error
set -e

# Configuration
APP_DIR="/var/www"
FRONTEND_DIR="$APP_DIR/frontend"
ADMIN_DIR="$APP_DIR/admin"
BACKEND_DIR="$APP_DIR/backend"
REPO_URL="https://github.com/saksham-personal/Forever-Ecom.git"  # Replace with your actual repository URL
BRANCH="main"  # Replace with your branch name

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print section header
section() {
  echo -e "\n${GREEN}==== $1 ====${NC}\n"
}

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo -e "${RED}This script must be run as root${NC}" 1>&2
   exit 1
fi

# Update system packages
section "Updating system packages"
apt-get update
apt-get upgrade -y

# Install required packages if not already installed
section "Installing required packages"
apt-get install -y nginx nodejs npm mongodb git

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

# Create application directories if they don't exist
section "Creating application directories"
mkdir -p $FRONTEND_DIR $ADMIN_DIR $BACKEND_DIR

# Clone or pull the repository
section "Fetching latest code"
if [ -d "$APP_DIR/repo" ]; then
  cd "$APP_DIR/repo"
  git pull origin $BRANCH
else
  git clone -b $BRANCH $REPO_URL "$APP_DIR/repo"
  cd "$APP_DIR/repo"
fi

# Install dependencies
section "Installing dependencies"
npm run install-all

# Build applications
section "Building applications"
npm run build

# Copy built files to their respective directories
section "Deploying built files"
rm -rf $FRONTEND_DIR/*
cp -r frontend/dist/* $FRONTEND_DIR/

rm -rf $ADMIN_DIR/*
cp -r admin/dist/* $ADMIN_DIR/

rm -rf $BACKEND_DIR/*
cp -r backend/* $BACKEND_DIR/

# Set up environment variables for production
section "Setting up environment variables"
cat > "$BACKEND_DIR/.env" << EOL
NODE_ENV=production
PORT=4000
MONGO_URI="mongodb+srv://db:8177@ecom.ba7m2.mongodb.net/ecom?retryWrites=true&w=majority&appName=ecom"
DATABASE_URL="mongodb+srv://db:8177@ecom.ba7m2.mongodb.net/ecom?retryWrites=true&w=majority&appName=ecom"
JWT_SECRET="eskayneuro999"
CLOUDINARY_CLOUD_NAME="dpjzsmdui"
CLOUDINARY_API_KEY="664691377398727"
CLOUDINARY_API_SECRET="ra2_D0TrPIjnsBFgla0kR26hOH0"
CLOUDINARY_URL="cloudinary://664691377398727:ra2_D0TrPIjnsBFgla0kR26hOH0@dpjzsmdui"
ADMIN_EMAIL="admin@admin.com"
ADMIN_PASSWORD="abc123abc123"
STRIPE_SECRET_KEY=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_KEY_ID=""
EOL

# Configure Nginx
section "Configuring Nginx"
cp nginx.conf /etc/nginx/sites-available/forever-full-stack
ln -sf /etc/nginx/sites-available/forever-full-stack /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Start the backend with PM2
section "Starting backend with PM2"
cd $BACKEND_DIR
npm install
pm2 stop forever-backend || true
pm2 start dist/index.js --name forever-backend

# Save PM2 configuration
pm2 save

# Configure PM2 to start on boot
pm2 startup

section "Deployment completed successfully!"
# Get the EC2 instance public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "Frontend: http://$EC2_IP"
echo "Admin: http://$EC2_IP/admin"
echo "Backend API: http://$EC2_IP/api"
