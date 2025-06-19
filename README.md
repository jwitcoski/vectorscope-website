# Vector Scope AI Website

This repository contains the website for Vector Scope AI LLC, a geospatial AI solutions company.

## Infrastructure

The website is hosted on AWS using the following services:
- S3 for static website hosting
- CloudFront for content delivery
- Route 53 for DNS management (optional)
- GitHub Actions for CI/CD

## Prerequisites

1. AWS Account with appropriate permissions
2. GitHub repository
3. Domain name (vectorscopeai.com)
4. Terraform installed locally for development

## Initial Setup

1. Create an S3 bucket for Terraform state:
```bash
aws s3 mb s3://vectorscope-terraform-state --region us-east-1
```

2. Create an IAM role for GitHub Actions with the following permissions:
   - S3 full access to the website bucket
   - CloudFront distribution management
   - Terraform state bucket access

3. Add the following secrets to your GitHub repository:
   - `AWS_ROLE_ARN`: The ARN of the IAM role created for GitHub Actions

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vectorscope-website.git
cd vectorscope-website
```

2. Initialize Terraform:
```bash
terraform init
```

3. Make changes and test locally
4. Commit and push changes to trigger the deployment

## Deployment

The website is automatically deployed when changes are pushed to the main branch:

1. GitHub Actions workflow is triggered
2. Terraform creates/updates infrastructure
3. Website files are synced to S3
4. CloudFront cache is invalidated

## Manual Deployment

If needed, you can deploy manually:

```bash
# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Sync files to S3
aws s3 sync . s3://vectorscopeai.com/ --exclude "*" --include "*.html" --include "*.css" --include "*.js" --include "assets/*" --include "images/*"

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

## Directory Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── images/
├── .gitignore
├── index.html
├── main.tf
└── README.md
```

## Contributing

1. Create a new branch
2. Make changes
3. Submit a pull request
4. Changes will be deployed automatically when merged to main

## License

See LICENSE file for details. 