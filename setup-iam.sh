#!/bin/bash

# Replace these variables with your values
AWS_ACCOUNT_ID="298043721974"
GITHUB_USERNAME="jwitcoski"
GITHUB_REPO="vectorscope-website"

# Update the trust policy file with your values
sed -i "s/YOUR_AWS_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" trust-policy.json
sed -i "s/YOUR_GITHUB_USERNAME/$GITHUB_USERNAME/g" trust-policy.json

# Create the OIDC provider for GitHub Actions
aws iam create-open-id-connect-provider \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# Create the IAM role
aws iam create-role \
    --role-name github-actions-vectorscope \
    --assume-role-policy-document file://trust-policy.json

# Create the permission policy
aws iam create-policy \
    --policy-name github-actions-vectorscope-policy \
    --policy-document file://permission-policy.json

# Attach the policy to the role
aws iam attach-role-policy \
    --role-name github-actions-vectorscope \
    --policy-arn "arn:aws:iam::$AWS_ACCOUNT_ID:policy/github-actions-vectorscope-policy"

# Get the role ARN
ROLE_ARN=$(aws iam get-role --role-name github-actions-vectorscope --query 'Role.Arn' --output text)

echo "Setup complete!"
echo "Role ARN: $ROLE_ARN"
echo ""
echo "Next steps:"
echo "1. Add this Role ARN as a secret in your GitHub repository:"
echo "   - Go to your GitHub repository settings"
echo "   - Navigate to Secrets and variables > Actions"
echo "   - Create a new secret named 'AWS_ROLE_ARN'"
echo "   - Paste the Role ARN value: $ROLE_ARN" 