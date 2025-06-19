# Setup Terraform Backend
# This script creates the S3 bucket needed for Terraform state management

param(
    [string]$BucketName = "vectorscope-terraform-state",
    [string]$Region = "us-east-1"
)

Write-Host "Setting up Terraform backend bucket..." -ForegroundColor Green

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if bucket already exists
Write-Host "Checking if bucket $BucketName already exists..." -ForegroundColor Yellow
$bucketExists = aws s3api head-bucket --bucket $BucketName 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Bucket $BucketName already exists" -ForegroundColor Green
} else {
    Write-Host "Creating bucket $BucketName..." -ForegroundColor Yellow
    
    # Create the bucket - handle us-east-1 differently
    if ($Region -eq "us-east-1") {
        # us-east-1 doesn't use LocationConstraint
        aws s3api create-bucket --bucket $BucketName --region $Region
    } else {
        # Other regions use LocationConstraint
        aws s3api create-bucket `
            --bucket $BucketName `
            --region $Region `
            --create-bucket-configuration LocationConstraint=$Region
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Bucket $BucketName created successfully" -ForegroundColor Green
    } else {
        Write-Host "Failed to create bucket $BucketName" -ForegroundColor Red
        exit 1
    }
}

# Enable versioning for the bucket
Write-Host "Enabling versioning on bucket..." -ForegroundColor Yellow
aws s3api put-bucket-versioning `
    --bucket $BucketName `
    --versioning-configuration Status=Enabled

if ($LASTEXITCODE -eq 0) {
    Write-Host "Versioning enabled successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to enable versioning" -ForegroundColor Red
}

# Enable server-side encryption
Write-Host "Enabling server-side encryption..." -ForegroundColor Yellow
aws s3api put-bucket-encryption `
    --bucket $BucketName `
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

if ($LASTEXITCODE -eq 0) {
    Write-Host "Server-side encryption enabled successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to enable server-side encryption" -ForegroundColor Red
}

Write-Host "Terraform backend setup complete!" -ForegroundColor Green
Write-Host "You can now run: terraform init" -ForegroundColor Cyan 