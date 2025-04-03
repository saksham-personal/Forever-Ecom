#!/bin/bash

# Get absolute path of script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Dynamically get Public IP once
PUBLIC_IP=$(curl -s ifconfig.me)
if [ -z "$PUBLIC_IP" ]; then
    echo "Failed to get Public IP address. Exiting."
    exit 1
fi
BACKEND_URL="http://$PUBLIC_IP"

echo "--- Starting Deployment ---"
echo "Using Public IP: $PUBLIC_IP"
echo "Backend URL for builds: $BACKEND_URL"

# Update system and install dependencies
echo "Updating system packages..."
sudo apt update
echo "Installing Node.js v22..."
sudo apt remove -y nodejs npm # Remove old versions first
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
echo "Updating npm and installing PM2..."
sudo npm install -g npm@latest pm2

# Install Nginx from Ubuntu repositories
echo "Installing Nginx..."
sudo apt install -y nginx-light
sudo systemctl enable nginx
sudo systemctl start nginx

# Configure Nginx
echo "Configuring Nginx..."
if [ ! -f "$SCRIPT_DIR/nginx.conf" ]; then
    echo "Error: nginx.conf not found in script directory!"
    exit 1
fi
sudo cp "$SCRIPT_DIR/nginx.conf" /etc/nginx/nginx.conf
sudo rm -f /etc/nginx/sites-enabled/default

# Build frontend
echo "--- Building Frontend ---"
cd "$SCRIPT_DIR/frontend" || { echo "Frontend directory not found"; exit 1; }
echo "Running npm install in frontend..."
npm install || { echo "Frontend npm install failed"; exit 1; }
echo "Building frontend with backend URL: $BACKEND_URL"
rm -rf dist # Clean previous build
# Set the environment variable for the build command
VITE_BACKEND_URL="$BACKEND_URL" npm run build || { echo "Frontend build failed"; exit 1; }
echo "Copying frontend build to /var/www/frontend..."
sudo mkdir -p /var/www/frontend
[ -d "dist" ] && sudo cp -r dist/* /var/www/frontend/

# Build admin
echo "--- Building Admin Panel ---"
cd "$SCRIPT_DIR/admin" || { echo "Admin directory not found"; exit 1; }
echo "Running npm install in admin..."
npm install || { echo "Admin npm install failed"; exit 1; }
echo "Building admin with backend URL: $BACKEND_URL" # Added echo for clarity
rm -rf dist # Clean previous build
# --- FIX IS HERE: Added VITE_BACKEND_URL prefix ---
VITE_BACKEND_URL="$BACKEND_URL" npm run build || { echo "Admin build failed"; exit 1; }
echo "Copying admin build to /var/www/admin..."
sudo mkdir -p /var/www/admin
[ -d "dist" ] && sudo cp -r dist/* /var/www/admin/


# Start backend
echo "--- Setting up Backend ---"
cd "$SCRIPT_DIR/backend" || { echo "Backend directory not found"; exit 1; }
echo "Running npm install in backend..."
npm install || { echo "Backend npm install failed"; exit 1; }
# npm audit fix --force # Optional: Consider removing --force or running manually
echo "Starting backend with PM2..."
pm2 delete backend 2>/dev/null # Stop existing process if any
# Ensure dist/index.js exists from a previous build or add build step here if needed
if [ ! -f "dist/index.js" ]; then
    echo "Backend build (dist/index.js) not found. Running build..."
    npm run build || { echo "Backend build failed"; exit 1; }
fi
pm2 start "dist/index.js" --name "backend" || { echo "PM2 failed to start backend"; exit 1; }
echo "Saving PM2 process list..."
pm2 save
echo "Setting up PM2 startup script..."
pm2 startup # You might need to run the output command manually if this doesn't suffice

# Restart services
echo "Testing and restarting Nginx..."
sudo nginx -t && sudo systemctl restart nginx

echo "--- Deployment completed successfully! ---"
echo "Frontend should be accessible at: http://$PUBLIC_IP"
echo "Admin panel should be accessible at: http://$PUBLIC_IP/admin"
echo "Ensure backend PM2 process is stable: pm2 list"
echo "Check backend logs if needed: pm2 logs backend"