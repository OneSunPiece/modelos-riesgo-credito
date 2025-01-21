# IAM Policy for Lambda
resource "aws_iam_policy" "lambda_basic_execution_policy" {
  name   = "lambda_basic_execution_policy"
  policy = jsonencode({
    Version = "2012-10-17"
    # Allow Lambda to write logs to CloudWatch
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Attach IAM Policy to Role
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_basic_execution_policy.arn
}