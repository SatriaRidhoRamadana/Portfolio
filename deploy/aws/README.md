# AWS deployment guide

This project is ready to be deployed with:
- Backend on an Ubuntu server over SSH
- Frontend on Amazon S3
- MySQL schema import for Ubuntu MySQL

## 1) Prepare Ubuntu server
Install Node.js 20+, Nginx, MySQL Server, and AWS CLI on the Ubuntu host.

Example:
```bash
sudo apt update
sudo apt install -y nginx mysql-server nodejs npm awscli
```

## 2) Create MySQL database and import schema
```bash
sudo mysql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

mysql -u portfolio_user -p portfolio < deploy/aws/schema.sql
```

## 3) Deploy backend to Ubuntu over SSH
Set the SSH destination and run:
```bash
SSH_HOST=your-ubuntu-host SSH_USER=ubuntu REMOTE_DIR=/var/www/portfolio bash deploy/aws/backend-deploy.sh
```

Then edit the remote environment file:
```bash
sudo nano /var/www/portfolio/.env
```

## 4) Deploy frontend to S3
Build and upload the static bundle:
```bash
S3_BUCKET=your-s3-bucket-name bash deploy/aws/frontend-deploy.sh
```

## 5) Configure DNS and CloudFront (recommended)
Point your domain to the S3 website endpoint or front it with CloudFront for HTTPS.

## 6) Environment variables
Use the values from [deploy/aws/.env.production.example](.env.production.example) as a starting point.
