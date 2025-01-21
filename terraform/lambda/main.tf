provider "aws" {
  region = "us-east-1"
}

# Lambda Function
resource "aws_lambda_function" "api_lambda" {
  function_name = var.lambda_function_name
  runtime       = var.lambda_runtime
  role          = aws_iam_role.lambda_role.arn
  handler       = var.lambda_handler

  
  architectures = ["x86_64"] # Define the architecture

  filename = "lambda_function.zip" # Path to deployment package

  ## Environment variables
  environment {
    variables = {
      MODEL_PATH = var.model_path # Path to the model file
    }
  }

  memory_size = var.lambda_memory_size
  timeout     = var.lambda_timeout
  
  ## tags
  tags = {
    Name = "api-lambda-credit-risk-score"
    Environment = "Dev"
    Project = "credit-risk-score"
  }
}

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


## Grant Lambda Permission to API Gateway
resource "aws_lambda_permission" "apigw_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}
