#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${S3_BUCKET:-}" ]]; then
  echo "Usage: S3_BUCKET=your-bucket-name bash deploy/aws/frontend-deploy.sh"
  exit 1
fi

npm run build
aws s3 sync dist/public "s3://${S3_BUCKET}" --delete --cache-control "public,max-age=31536000,immutable"
aws s3 website "s3://${S3_BUCKET}" --index-document index.html --error-document index.html

echo "Frontend deployed to S3 bucket: ${S3_BUCKET}"
