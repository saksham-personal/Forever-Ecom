# EC2 Deployment Guide

## Prerequisites
- AWS EC2 instance (Ubuntu 20.04/22.04 recommended)
- Security group with ports 80 (HTTP) and 22 (SSH) open

## Deployment Steps

1. Connect to your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. Clone the repository:
```bash
git clone https://github.com/your-repo/forever-full-stack.git
cd forever-full-stack
```

3. Make the deploy script executable and run it:
```bash
chmod +x deploy.sh
./deploy.sh
```

4. Configure environment variables:
- Edit backend/.env with your database and other configurations
- Edit frontend/.env with your API base URL (should point to your EC2 IP)

5. Verify the deployment:
- Visit http://your-ec2-ip in your browser (should show frontend)
- Visit http://your-ec2-ip/admin (should redirect to admin login)

## Maintenance

- To restart services:
```bash
sudo systemctl restart nginx
pm2 restart backend
```

- To view logs:
```bash
sudo journalctl -u nginx -f  # Nginx logs
pm2 logs backend             # Backend logs
```

## Notes
- The IP address will directly serve the frontend
- /admin path will redirect to admin login page
- Backend API is available at /api/
