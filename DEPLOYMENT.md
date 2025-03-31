# Deploying Forever Full Stack on EC2

This guide provides step-by-step instructions for deploying the Forever Full Stack application on an Amazon EC2 instance.

## Prerequisites

1. An AWS account
2. Basic knowledge of AWS EC2

## Step 1: Launch an EC2 Instance

1. Log in to your AWS Management Console
2. Navigate to EC2 Dashboard
3. Click "Launch Instance"
4. Choose an Amazon Machine Image (AMI)
   - Recommended: Ubuntu Server 22.04 LTS
5. Choose an Instance Type
   - Recommended: t2.micro (free tier eligible) or t2.small for better performance
6. Configure Instance Details (default settings are usually fine)
7. Add Storage (default 8GB is usually sufficient)
8. Add Tags (optional)
9. Configure Security Group
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
10. Review and Launch
11. Create or select an existing key pair for SSH access
12. Launch Instance

## Step 2: Connect to Your EC2 Instance

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-dns
```

## Step 3: Prepare the Server

1. Update the system packages:

```bash
sudo apt update
sudo apt upgrade -y
```

2. Install required software:

```bash
sudo apt install -y nginx git nodejs npm
sudo npm install -g pm2
```

## Step 4: Clone the Repository

```bash
# Create application directory
sudo mkdir -p /var/www
cd /var/www

# Clone the repository
sudo git clone https://github.com/yourusername/forever-full-stack.git repo
cd repo
```

## Step 5: Configure the Application

1. Update the repository URL in the deployment script:

```bash
sudo nano deploy.sh
```

2. Change the `REPO_URL` variable to your actual repository URL.

3. Make the deployment script executable:

```bash
sudo chmod +x deploy.sh
```

## Step 6: Configure Nginx

1. Update the Nginx configuration:

```bash
sudo nano nginx.conf
```

2. No changes needed to the Nginx configuration as it's set up to work with any hostname.

## Step 7: Run the Deployment Script

```bash
sudo ./deploy.sh
```

This script will:
- Install all required dependencies
- Build the frontend, admin, and backend applications
- Configure Nginx as a reverse proxy
- Set up PM2 to manage the Node.js processes
- Start the application

## Step 8: Access Your Application

- Frontend: `http://your-ec2-public-ip` or `http://your-ec2-public-dns`
- Admin Panel: `http://your-ec2-public-ip/admin` or `http://your-ec2-public-dns/admin`
- Backend API: `http://your-ec2-public-ip/api` or `http://your-ec2-public-dns/api`

## Step 9: Security Considerations (Optional)

While you're not using a domain name, you might still want to consider security:

1. Set up a firewall to restrict access to your EC2 instance
2. Configure AWS Security Groups to limit access to necessary ports
3. Consider setting up a self-signed SSL certificate if you need HTTPS:

```bash
sudo apt install certbot python3-certbot-nginx
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```

## Troubleshooting

### Application Not Loading

Check Nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

Check backend logs:
```bash
pm2 logs forever-backend
```

### Nginx Configuration Issues

Test Nginx configuration:
```bash
sudo nginx -t
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Database Connection Issues

Check MongoDB connection:
```bash
mongo "mongodb+srv://ecom.ba7m2.mongodb.net/ecom" --username db
```

## Maintenance

### Updating the Application

To update the application with the latest changes:

```bash
cd /var/www/repo
sudo git pull
sudo ./deploy.sh
```

### Monitoring

Monitor the backend application:

```bash
pm2 status
pm2 monit
```

### Backup

Regularly backup your MongoDB database:

```bash
mongodump --uri="mongodb+srv://db:8177@ecom.ba7m2.mongodb.net/ecom"
```
