# Bootstrap IAM Role and Policy for GitHub Actions
# This script creates the IAM role and policy needed for GitHub Actions before running Terraform

param(
    [string]$AccountId = "298043721974",
    [string]$Repository = "jwitcoski/vectorscope-website",
    [string]$Region = "us-east-1"
)

Write-Host "Bootstrapping IAM role and policy for GitHub Actions..." -ForegroundColor Green

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Create the trust policy JSON
$trustPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Action = "sts:AssumeRoleWithWebIdentity"
            Effect = "Allow"
            Principal = @{
                Federated = "arn:aws:iam::$AccountId`:oidc-provider/token.actions.githubusercontent.com"
            }
            Condition = @{
                StringLike = @{
                    "token.actions.githubusercontent.com:sub" = "repo:$Repository`:*"
                }
                StringEquals = @{
                    "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
                }
            }
        }
    )
} | ConvertTo-Json -Depth 10

# Create OIDC provider if it doesn't exist
Write-Host "Creating OIDC provider..." -ForegroundColor Yellow
$oidcExists = aws iam get-open-id-connect-provider --open-id-connect-provider-arn "arn:aws:iam::$AccountId`:oidc-provider/token.actions.githubusercontent.com" 2>$null

if ($LASTEXITCODE -ne 0) {
    aws iam create-open-id-connect-provider `
        --url "https://token.actions.githubusercontent.com" `
        --client-id-list "sts.amazonaws.com" `
        --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OIDC provider created successfully" -ForegroundColor Green
    } else {
        Write-Host "Failed to create OIDC provider" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "OIDC provider already exists" -ForegroundColor Green
}

# Create IAM role
Write-Host "Creating IAM role..." -ForegroundColor Yellow
$roleExists = aws iam get-role --role-name "github-actions-vectorscope" 2>$null

if ($LASTEXITCODE -ne 0) {
    aws iam create-role `
        --role-name "github-actions-vectorscope" `
        --assume-role-policy-document $trustPolicy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "IAM role created successfully" -ForegroundColor Green
    } else {
        Write-Host "Failed to create IAM role" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "IAM role already exists" -ForegroundColor Green
}

# Attach permission policy using the JSON file
Write-Host "Attaching permission policy..." -ForegroundColor Yellow
aws iam put-role-policy `
    --role-name "github-actions-vectorscope" `
    --policy-name "github-actions-comprehensive" `
    --policy-document file://github-actions-policy.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "Permission policy attached successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to attach permission policy" -ForegroundColor Red
    exit 1
}

# Get the role ARN
$roleArn = aws iam get-role --role-name "github-actions-vectorscope" --query "Role.Arn" --output text

Write-Host "Bootstrap complete!" -ForegroundColor Green
Write-Host "Role ARN: $roleArn" -ForegroundColor Cyan
Write-Host "Add this ARN to your GitHub repository secrets as AWS_ROLE_ARN" -ForegroundColor Yellow 