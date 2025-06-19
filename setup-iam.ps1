# Replace these variables with your values
$AWS_ACCOUNT_ID = "298043721974"
$GITHUB_USERNAME = "jwitcoski"
$GITHUB_REPO = "vectorscope-website"

# Update the trust policy file with your values
(Get-Content -Path "trust-policy.json") -replace "YOUR_AWS_ACCOUNT_ID", $AWS_ACCOUNT_ID | Set-Content -Path "trust-policy.json"
(Get-Content -Path "trust-policy.json") -replace "YOUR_GITHUB_USERNAME", $GITHUB_USERNAME | Set-Content -Path "trust-policy.json"

Write-Host "Creating OIDC provider for GitHub Actions..."
try {
    aws iam create-open-id-connect-provider `
        --url "https://token.actions.githubusercontent.com" `
        --client-id-list "sts.amazonaws.com" `
        --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1"
} catch {
    Write-Host "OIDC provider might already exist, continuing..."
}

Write-Host "Creating IAM role..."
aws iam create-role `
    --role-name "github-actions-vectorscope" `
    --assume-role-policy-document "file://trust-policy.json"

Write-Host "Creating permission policy..."
$POLICY_ARN = aws iam create-policy `
    --policy-name "github-actions-vectorscope-policy" `
    --policy-document "file://permission-policy.json" `
    --query 'Policy.Arn' `
    --output text

Write-Host "Attaching policy to role..."
aws iam attach-role-policy `
    --role-name "github-actions-vectorscope" `
    --policy-arn $POLICY_ARN

Write-Host "Getting role ARN..."
$ROLE_ARN = aws iam get-role --role-name "github-actions-vectorscope" --query 'Role.Arn' --output text

Write-Host "`nSetup complete!"
Write-Host "Role ARN: $ROLE_ARN"
Write-Host "`nNext steps:"
Write-Host "1. Add this Role ARN as a secret in your GitHub repository:"
Write-Host "   - Go to your GitHub repository settings"
Write-Host "   - Navigate to Secrets and variables > Actions"
Write-Host "   - Create a new secret named 'AWS_ROLE_ARN'"
Write-Host "   - Paste the Role ARN value: $ROLE_ARN" 