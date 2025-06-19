# Data source for existing GitHub OIDC Provider
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# Data source for existing IAM Role for GitHub Actions
data "aws_iam_role" "github_actions" {
  name = "github-actions-vectorscope"
} 