variable "github_repository" {
  description = "The GitHub repository in format: username/repository"
  type        = string
  # You'll need to update this with your actual GitHub repository
  default     = "your-username/vectorscope-website"
}

variable "aws_region" {
  description = "The AWS region to create resources in"
  type        = string
  default     = "us-east-1"
}

# Output the role ARN for GitHub Actions
output "github_actions_role_arn" {
  description = "The ARN of the IAM role for GitHub Actions"
  value       = aws_iam_role.github_actions.arn
} 