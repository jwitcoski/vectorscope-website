# Data source for existing GitHub OIDC Provider
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# IAM Role for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "github-actions-vectorscope"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github.arn
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub": "repo:${var.github_repository}:*"
          }
          StringEquals = {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

# Comprehensive policy for all required permissions
resource "aws_iam_role_policy" "github_actions_policy" {
  name = "github-actions-comprehensive"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # IAM permissions for creating and managing OIDC providers and roles
      {
        Effect = "Allow"
        Action = [
          "iam:CreateOpenIDConnectProvider",
          "iam:GetOpenIDConnectProvider",
          "iam:DeleteOpenIDConnectProvider",
          "iam:CreateRole",
          "iam:GetRole",
          "iam:PutRolePolicy",
          "iam:GetRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:DeleteRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PassRole"
        ]
        Resource = "*"
      },
      # S3 permissions for website bucket (including creation)
      {
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:GetBucketLocation",
          "s3:GetBucketPolicy",
          "s3:PutBucketPolicy",
          "s3:DeleteBucketPolicy",
          "s3:PutBucketWebsite",
          "s3:GetBucketWebsite",
          "s3:DeleteBucketWebsite",
          "s3:PutBucketPublicAccessBlock",
          "s3:GetBucketPublicAccessBlock",
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject",
          "s3:PutObjectAcl",
          "s3:GetObjectAcl"
        ]
        Resource = [
          "arn:aws:s3:::vectorscopeai.com",
          "arn:aws:s3:::vectorscopeai.com/*"
        ]
      },
      # S3 permissions for Terraform state bucket (including creation)
      {
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:PutBucketVersioning",
          "s3:GetBucketVersioning",
          "s3:PutBucketEncryption",
          "s3:GetBucketEncryption",
          "s3:GetBucketPolicy",
          "s3:PutBucketPolicy",
          "s3:DeleteBucketPolicy"
        ]
        Resource = [
          "arn:aws:s3:::vectorscope-terraform-state"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObjectVersion",
          "s3:DeleteObjectVersion"
        ]
        Resource = [
          "arn:aws:s3:::vectorscope-terraform-state/*"
        ]
      },
      # CloudFront permissions (including creation)
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateDistribution",
          "cloudfront:GetDistribution",
          "cloudfront:UpdateDistribution",
          "cloudfront:DeleteDistribution",
          "cloudfront:ListDistributions",
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations",
          "cloudfront:CreateCloudFrontOriginAccessIdentity",
          "cloudfront:GetCloudFrontOriginAccessIdentity",
          "cloudfront:UpdateCloudFrontOriginAccessIdentity",
          "cloudfront:DeleteCloudFrontOriginAccessIdentity",
          "cloudfront:ListCloudFrontOriginAccessIdentities"
        ]
        Resource = "*"
      },
      # EC2 permissions for Terraform
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeRegions",
          "ec2:DescribeAvailabilityZones"
        ]
        Resource = "*"
      }
    ]
  })
} 