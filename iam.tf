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
      {
        Sid = "IAMPermissions",
        Effect = "Allow",
        Action = [
          "iam:CreateOpenIDConnectProvider",
          "iam:GetOpenIDConnectProvider",
          "iam:DeleteOpenIDConnectProvider",
          "iam:ListOpenIDConnectProviders",
          "iam:CreateRole",
          "iam:GetRole",
          "iam:PutRolePolicy",
          "iam:GetRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:DeleteRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PassRole"
        ],
        Resource = "*"
      },
      {
        Sid = "S3AllPermissions",
        Effect = "Allow",
        Action = [
          "s3:*"
        ],
        Resource = "*"
      },
      {
        Sid = "CloudFrontAllPermissions",
        Effect = "Allow",
        Action = [
          "cloudfront:*"
        ],
        Resource = "*"
      },
      {
        Sid = "EC2Permissions",
        Effect = "Allow",
        Action = [
          "ec2:DescribeRegions",
          "ec2:DescribeAvailabilityZones"
        ],
        Resource = "*"
      }
    ]
  })
} 