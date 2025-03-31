#!/bin/bash

# Update system and install dependencies
sudo apt update
sudo apt install -y nginx nodejs npm
sudo npm install -g pm2

# Configure Nginx
sudo rm /etc/nginx/sites-enabled/default
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo systemctl restart nginx

# Build frontend
cd frontend
npm install
npm run build
sudo mkdir -p /var/www/frontend
sudo cp -r dist/* /var/www/frontend/

# Build admin
cd ../admin
npm install
npm run build
sudo mkdir -p /var/www/admin
sudo cp -r dist/* /var/www/admin/

# Start backend
cd ../backend
npm install
pm2 start "npm start" --name "backend"

# Restart Nginx
sudo systemctl restart nginx

echo "Deployment completed successfully!"
