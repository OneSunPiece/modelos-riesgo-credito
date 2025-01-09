provider "aws" {
  region = "us-east-1"
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
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

# Lambda Function
resource "aws_lambda_function" "api_lambda" {
  function_name = var.lambda_function_name
  runtime       = var.lambda_runtime
  role          = aws_iam_role.lambda_role.arn
  handler       = var.lambda_handler

  # Define the architecture
  architectures = ["x86_64"]

  # Path to deployment package
  filename = "lambda_function.zip"

  # Environment variables
  environment {
    variables = {
      MODEL_PATH = var.model_path # Path to the model file
    }
  }

  # Memory and timeout configuration
  memory_size = var.lambda_memory_size
  timeout     = var.lambda_timeout

  tags = {
    Name = "fastapi-lambda"
  }
}

# API Gateway
resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "fastapi-api"
  protocol_type = "HTTP"
}

# API Integration with Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.api_gateway.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.api_lambda.arn
  payload_format_version = "2.0"
}

# API Route
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "POST /predict" # HTTP POST method for predictions
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# API Deployment
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "$default" # stage name
  auto_deploy = true
}

# Grant Lambda Permission to API Gateway
resource "aws_lambda_permission" "apigw_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}

