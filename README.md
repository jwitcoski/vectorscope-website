# Vector Scope AI Website

[![Deploy Website](https://github.com/jwitcoski/vectorscope-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/jwitcoski/vectorscope-website/actions/workflows/deploy.yml)

This repository contains the website for Vector Scope AI LLC, a geospatial AI solutions company. The website is automatically deployed to AWS using GitHub Actions.

## 🌐 Website

- Production: [vectorscopeai.com](https://vectorscopeai.com)
- Development: [S3 Website Endpoint]

## 🏗️ Infrastructure

The website is hosted on AWS using:
- **S3** for static website hosting
- **CloudFront** for content delivery
- **Route 53** for DNS management (coming soon)
- **GitHub Actions** for CI/CD

## 🚀 Deployment Status

The website is automatically deployed when changes are merged to the main branch. You can check the deployment status in the [Actions tab](https://github.com/jwitcoski/vectorscope-website/actions).

### Recent Deployments
- Main Branch: ![Deploy Website](https://github.com/jwitcoski/vectorscope-website/actions/workflows/deploy.yml/badge.svg?branch=main)

## 🛠️ Development

### Prerequisites

1. AWS Account with appropriate permissions
2. Terraform installed locally
3. Git

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/jwitcoski/vectorscope-website.git
cd vectorscope-website
```

2. Initialize Terraform:
```bash
terraform init
```

3. Make changes and test locally
4. Create a pull request to trigger the deployment workflow

## 📝 Contributing

1. Create a new branch from main
2. Make your changes
3. Submit a pull request
4. Wait for the automated checks to pass
5. Request review

## 🔐 Security

- All deployments are handled through GitHub Actions using OIDC authentication
- No long-term AWS credentials are stored in GitHub
- Branch protection rules ensure code quality and security

## 📄 License

See [LICENSE](LICENSE.txt) file for details.

## 🤝 Contact

For questions or support, please [open an issue](https://github.com/jwitcoski/vectorscope-website/issues) or contact us through our website.

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