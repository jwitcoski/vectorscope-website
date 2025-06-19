#!/bin/bash

# Setup Terraform Backend
# This script creates the S3 bucket needed for Terraform state management

BUCKET_NAME=${1:-"vectorscope-terraform-state"}
REGION=${2:-"us-east-1"}

echo "Setting up Terraform backend bucket..."

# Check if bucket already exists
echo "Checking if bucket $BUCKET_NAME already exists..."
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "Bucket $BUCKET_NAME already exists"
else
    echo "Creating bucket $BUCKET_NAME..."
    
    # Create the bucket - handle us-east-1 differently
    if [ "$REGION" = "us-east-1" ]; then
        # us-east-1 doesn't use LocationConstraint
        if aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"; then
            echo "Bucket $BUCKET_NAME created successfully"
        else
            echo "Failed to create bucket $BUCKET_NAME"
            exit 1
        fi
    else
        # Other regions use LocationConstraint
        if aws s3api create-bucket \
            --bucket "$BUCKET_NAME" \
            --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"; then
            echo "Bucket $BUCKET_NAME created successfully"
        else
            echo "Failed to create bucket $BUCKET_NAME"
            exit 1
        fi
    fi
fi

# Enable versioning for the bucket
echo "Enabling versioning on bucket..."
if aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled; then
    echo "Versioning enabled successfully"
else
    echo "Failed to enable versioning"
fi

# Enable server-side encryption
echo "Enabling server-side encryption..."
if aws s3api put-bucket-encryption \
    --bucket "$BUCKET_NAME" \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'; then
    echo "Server-side encryption enabled successfully"
else
    echo "Failed to enable server-side encryption"
fi

echo "Terraform backend setup complete!"
echo "You can now run: terraform init" 