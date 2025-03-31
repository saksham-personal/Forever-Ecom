#!/bin/bash

# Get absolute path of script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Update system and install dependencies
sudo apt update
sudo apt remove -y nodejs npm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g npm@latest pm2

# Install Nginx from Ubuntu repositories
sudo apt install -y nginx-light
sudo systemctl enable nginx
sudo systemctl start nginx

# Configure Nginx
sudo cp "$SCRIPT_DIR/nginx.conf" /etc/nginx/nginx.conf
sudo rm -f /etc/nginx/sites-enabled/default

# Build frontend
cd "$SCRIPT_DIR/frontend" || { echo "Frontend directory not found"; exit 1; }
npm install
npm run build || { echo "Frontend build failed"; exit 1; }
sudo mkdir -p /var/www/frontend
[ -d "dist" ] && sudo cp -r dist/* /var/www/frontend/

# Build admin
cd "$SCRIPT_DIR/admin" || { echo "Admin directory not found"; exit 1; }
npm install
npm run build || { echo "Admin build failed"; exit 1; }
sudo mkdir -p /var/www/admin
[ -d "dist" ] && sudo cp -r dist/* /var/www/admin/

# Start backend
cd "$SCRIPT_DIR/backend" || { echo "Backend directory not found"; exit 1; }
npm install
npm audit fix --force
pm2 delete backend 2>/dev/null
pm2 start "npm start" --name "backend"
pm2 save
pm2 startup

# Restart services
sudo nginx -t && sudo systemctl restart nginx

echo "Deployment completed successfully!"
PUBLIC_IP=$(curl -s ifconfig.me)
echo "Frontend: http://$PUBLIC_IP"
echo "Admin: http://$PUBLIC_IP/admin"
