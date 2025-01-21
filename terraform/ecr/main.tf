provider "aws" {
  region = "us-east-1"
}

# ECR Repository
resource "aws_ecr_repository" "ecr_credit_risk_score" {
  name = "repositorio-ecr-credit-risk-score"
}


